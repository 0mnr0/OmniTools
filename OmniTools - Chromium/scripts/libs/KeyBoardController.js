/**
 * KeyboardController
 *
 * Слушает клавиатуру и поддерживает публичный массив KeyboardPressedKeys,
 * например: ["leftShift", "f"].
 *
 * - Модификаторы различаются по сторонам: leftShift / rightShift,
 *   leftCtrl / rightCtrl, leftAlt / rightAlt, leftMeta / rightMeta.
 *   Общих "shift" / "control" / "alt" / "meta" в массиве не бывает.
 * - Буквы, цифры и знаки определяются по физической клавише (event.code), поэтому
 *   раскладка не важна: на русской раскладке клавиша "А" даст "f".
 *   Режим можно отключить: KeyboardController.layoutIndependent = false.
 * - Остальные клавиши попадают в виде event.key.toLowerCase() ("enter", "arrowup", ...).
 * - Клавиша удаляется по физическому коду (event.code), поэтому если
 *   отпустить Shift раньше, чем "1", в массиве не останется "залипшего" "!".
 *
 * when(conditions, callback, options)  — выполнить callback, когда комбинация собралась.
 * after(conditions, callback, options) — выполнить callback, когда комбинация распалась.
 */
(function (global) {
  "use strict";

  const MODIFIER_NAMES = {
    ShiftLeft: "leftShift",
    ShiftRight: "rightShift",
    ControlLeft: "leftCtrl",
    ControlRight: "rightCtrl",
    AltLeft: "leftAlt",
    AltRight: "rightAlt",
    MetaLeft: "leftMeta",
    MetaRight: "rightMeta",
  };

  // Короткие имена для строковых условий: when(["shift", "f"], ...)
  const MODIFIER_ALIASES = {
    shift: ["leftShift", "rightShift"],
    ctrl: ["leftCtrl", "rightCtrl"],
    control: ["leftCtrl", "rightCtrl"],
    alt: ["leftAlt", "rightAlt"],
    meta: ["leftMeta", "rightMeta"],
  };

  // Публичный объект. Меняется на месте (одна и та же ссылка всегда).
  const KeyboardPressedKeys = [];

  // code -> имя, под которым клавиша лежит в KeyboardPressedKeys
  const activeByCode = new Map();

  // Зарегистрированные правила when() / after()
  const rules = [];

  // Знаки препинания по физической клавише (как на английской раскладке)
  const CODE_PUNCTUATION = {
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
  };

  // true  — буквы/цифры/знаки определяются по физической клавише (event.code),
  //         раскладка не важна: на русской раскладке клавиша "А" даст "f".
  // false — по символу (event.key): на русской раскладке будет "а".
  let layoutIndependent = true;

  function resolveName(e) {
    if (MODIFIER_NAMES[e.code]) return MODIFIER_NAMES[e.code];

    if (layoutIndependent && e.code) {
      if (/^Key[A-Z]$/.test(e.code)) return e.code.slice(3).toLowerCase();
      if (/^Digit[0-9]$/.test(e.code)) return e.code.slice(5);
      if (CODE_PUNCTUATION[e.code]) return CODE_PUNCTUATION[e.code];
    }

    if (e.key === " ") return "space";
    return String(e.key).toLowerCase();
  }

  function has(name) {
    const lower = String(name).toLowerCase();
    return KeyboardPressedKeys.some((k) => k.toLowerCase() === lower);
  }

  // true, если текущий фокус находится в <input> или <textarea>
  // (учитываем и открытый shadow DOM).
  function isInInput() {
    let el = document.activeElement;
    while (el && el.shadowRoot && el.shadowRoot.activeElement) {
      el = el.shadowRoot.activeElement;
    }
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toUpperCase();
    return tag === "INPUT" || tag === "TEXTAREA";
  }

  // ---------- when / after ----------

  function toPredicate(cond, fnName) {
    if (typeof cond === "function") return cond;

    if (typeof cond === "string") {
      const lower = cond.toLowerCase();
      const group = MODIFIER_ALIASES[lower];
      if (group) return () => group.some(has);
      return () => has(lower);
    }

    throw new TypeError(
      fnName +
        "(): условие должно быть функцией или строкой с названием клавиши. " +
        "Значение вроде isKeyPressed('f') вычисляется один раз при вызове и " +
        "превращается в boolean, поэтому передавайте () => isKeyPressed('f')."
    );
  }

  function evaluateRules(e) {
    for (const rule of rules.slice()) {
      let ok;
      try {
        ok = rule.predicates.every((p) => !!p());
      } catch (err) {
        console.error(rule.mode + "(): ошибка в условии", err);
        ok = false;
      }

      const wasActive = rule.active;
      rule.active = ok;

      // when: комбинация только что собралась; after: только что распалась
      let fire = rule.mode === "after" ? wasActive && !ok : ok && !wasActive;

      // onDownEvent (только when): реагируем только на переходы, вызванные
      // нажатием клавиши (keydown). События keyup и reset() игнорируются.
      if (fire && rule.onDownEvent && !(e && e.type === "keydown")) fire = false;

      // onReleaseEvent (только after): реагируем только на переходы, вызванные
      // отпусканием клавиши (keyup). События keydown и reset() (потеря фокуса,
      // e === undefined) игнорируются.
      if (fire && rule.onReleaseEvent && !(e && e.type === "keyup")) fire = false;

      // ignoreInInput: не вызываем callback, пока фокус в <input>/<textarea>.
      // Состояние правила (rule.active) при этом уже обновлено, так что после
      // выхода из поля оно сработает только на следующем переходе.
      if (fire && rule.ignoreInInput && isInInput()) fire = false;

      if (!fire) continue;

      if (rule.preventDefault && e && e.type === "keydown") e.preventDefault();
      if (rule.once) removeRule(rule);

      try {
        rule.callback(e);
      } catch (err) {
        console.error(rule.mode + "(): ошибка в callback", err);
      }
    }
  }

  function removeRule(rule) {
    const i = rules.indexOf(rule);
    if (i !== -1) rules.splice(i, 1);
  }

  function createRule(mode, conditions, callback, options) {
    const list = Array.isArray(conditions) ? conditions : [conditions];
    if (list.length === 0) {
      throw new TypeError(mode + "(): список условий пуст");
    }
    if (typeof callback !== "function") {
      throw new TypeError(mode + "(): вторым аргументом нужна функция");
    }

    const opts = options || {};
    const rule = {
      mode,
      predicates: list.map((c) => toPredicate(c, mode)),
      callback,
      once: !!opts.once,
      onDownEvent: mode === "when" && !!opts.onDownEvent,
      onReleaseEvent: mode === "after" && !!opts.onReleaseEvent,
      preventDefault: mode === "when" && !!opts.preventDefault,
      ignoreInInput: !!opts.ignoreInInput,
      active: false,
    };

    // Запоминаем текущее состояние: если комбинация уже зажата,
    // when не сработает сразу, а after сработает, когда её отпустят.
    try {
      rule.active = rule.predicates.every((p) => !!p());
    } catch (_) {
      rule.active = false;
    }

    rules.push(rule);
    return () => removeRule(rule);
  }

  /**
   * Выполняет callback один раз в момент, когда ВСЕ условия стали истинными.
   * Повторно сработает только после того, как комбинация распалась
   * (хотя бы одно условие стало ложным) и собралась снова.
   *
   * @param {Array<Function|string>|Function|string} conditions
   *   Функции, возвращающие boolean, и/или строки с названиями клавиш:
   *   "f", "shift", "ctrl", "leftShift", "space", "enter" ...
   * @param {(e: KeyboardEvent) => void} callback
   * @param {{ once?: boolean, preventDefault?: boolean, onDownEvent?: boolean, ignoreInInput?: boolean }} [options]
   *   once — сработать один раз и отписаться;
   *   ignoreInInput — (по умолчанию false) не вызывать callback, если фокус
   *   находится в <input> или <textarea>;
   *   preventDefault — отменить действие браузера для keydown, собравшего комбинацию;
   *   onDownEvent — (по умолчанию false) срабатывать только когда переход состояния
   *   вызван нажатием клавиши (keydown); отпускание клавиши и потеря фокуса игнорируются.
   * @returns {() => void} функция отписки
   */
  function when(conditions, callback, options) {
    return createRule("when", conditions, callback, options);
  }

  /**
   * Выполняет callback один раз в момент, когда комбинация, бывшая истинной,
   * перестала быть истинной (отпустили любую из её клавиш).
   * Если комбинация не была собрана, ничего не происходит.
   *
   * Если окно потеряло фокус и состояние клавиш сбросилось, after тоже
   * сработает; в этом случае callback получит undefined вместо события.
   *
   * @param {Array<Function|string>|Function|string} conditions  как у when
   * @param {(e?: KeyboardEvent) => void} callback
   * @param {{ once?: boolean, onReleaseEvent?: boolean, ignoreInInput?: boolean }} [options]
   *   once — сработать один раз и отписаться;
   *   ignoreInInput — (по умолчанию false) не вызывать callback, если фокус
   *   находится в <input> или <textarea>;
   *   onReleaseEvent — (по умолчанию false) срабатывать только когда комбинация распалась
   *   из-за отпускания клавиши (keyup); потеря фокуса (reset) и keydown игнорируются.
   * @returns {() => void} функция отписки
   */
  function after(conditions, callback, options) {
    return createRule("after", conditions, callback, options);
  }

  // ---------- слушатели ----------

  function onKeyDown(e) {
    const code = e.code || e.key;
    if (activeByCode.has(code)) return; // автоповтор при удержании

    const name = resolveName(e);
    activeByCode.set(code, name);
    if (!KeyboardPressedKeys.includes(name)) KeyboardPressedKeys.push(name);

    evaluateRules(e);
  }

  function onKeyUp(e) {
    const code = e.code || e.key;
    const name = activeByCode.get(code);
    if (name === undefined) return;

    activeByCode.delete(code);

    // Убираем имя, только если его не держит другая физическая клавиша
    // (например, две клавиши, дающие один и тот же символ).
    const stillHeld = [...activeByCode.values()].includes(name);
    if (!stillHeld) {
      const i = KeyboardPressedKeys.indexOf(name);
      if (i !== -1) KeyboardPressedKeys.splice(i, 1);
    }

    evaluateRules(e);
  }

  // Если окно потеряло фокус, keyup мы уже не получим — сбрасываем всё
  // и пересчитываем правила (after-правила при этом сработают).
  function reset() {
    activeByCode.clear();
    KeyboardPressedKeys.length = 0;
    evaluateRules(undefined);
  }

  function onVisibilityChange() {
    if (document.hidden) reset();
  }

  let started = false;

  const KeyboardController = {
    KeyboardPressedKeys,

    start() {
      if (started) return this;
      started = true;
      window.addEventListener("keydown", onKeyDown, true);
      window.addEventListener("keyup", onKeyUp, true);
      window.addEventListener("blur", reset);
      document.addEventListener("visibilitychange", onVisibilityChange);
      return this;
    },

    stop() {
      if (!started) return this;
      started = false;
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reset();
      return this;
    },

    reset,
    when,
    after,

    get layoutIndependent() {
      return layoutIndependent;
    },
    set layoutIndependent(value) {
      layoutIndependent = !!value;
      reset(); // имена в массиве зависят от режима — начинаем с чистого состояния
    },

    get isShiftPressed() {
      return has("leftShift") || has("rightShift");
    },

    get isCtrlPressed() {
      return has("leftCtrl") || has("rightCtrl");
    },

    get isAltPressed() {
      return has("leftAlt") || has("rightAlt");
    },

    isKeyPressed(key) {
      return has(key);
    },
  };

  KeyboardController.start();

  global.KeyboardPressedKeys = KeyboardPressedKeys;
  global.KeyboardController = KeyboardController;
})(typeof window !== "undefined" ? window : globalThis);