# Omni Tools for Safari

Расширение для Safari собирается автоматически из общего исходного кода (`OmniTools - Chromium`) с наложением патчей из `Safari Patches`.

## Сборка

Запустите:
```sh
./build-safari.sh
```
или:
```sh
python build.py --safari-only
```
(или просто `python build.py` для сборки всех версий: Chromium, Firefox и Safari).

Собранные файлы будут в папке `output/`:
- `output/Safari/` — распакованное расширение.
- `output/Safari_<version>.zip` — архив расширения.

## Быстрое тестирование в Safari на macOS

Safari 26 и новее позволяет загружать расширение напрямую без аккаунта разработчика:

1. Откройте **Safari > Настройки > Дополнительно** (Settings > Advanced) и включите меню «Разработка» (Show features for web developers).
2. Откройте **Safari > Настройки > Разработка** (Settings > Developer) и разрешите неподписанные расширения (Allow unsigned extensions).
3. Нажмите **Добавить временное расширение…** (Add Temporary Extension…) и выберите папку `output/Safari` или архив `output/Safari_<version>.zip`.
4. Включите **Omni Tools**, предоставьте доступ для `omni.top-academy.ru` и перезагрузите страницу Omni.

*Временное расширение активно в Safari 24 часа или до закрытия браузера.*

## Постоянный пакет для macOS / iOS через Xcode

Установите Xcode, убедитесь, что выбраны инструменты командной строки (`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`), затем выполните:

```sh
./package-safari.sh
```

Скрипт использует `safari-web-extension-packager` (или `safari-web-extension-converter`) от Apple и создаст Xcode-проект в папке `Safari App/`. Откройте этот проект в Xcode, выберите команду подписи (Team) и запустите сборку под macOS или iOS.
