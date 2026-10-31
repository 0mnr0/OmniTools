// https://omni.top-academy.ru/auth/get-start-info

const DeveloperHash = "82cb119234503";
let lastCityId = null;
let CurrentSettings = {};

function downloadFileOld(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) { a.download = fileName; }
  a.style.display = 'none';
  a.setAttribute('target', '_blank');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function awaitWithTimeout(ms, promise) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Превышено время ожидания (Timeout)")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

async function downloadFile(url, fileName) {
  try {
    const r = await awaitWithTimeout(
      5000,
      BrowserContext.runtime.sendMessage({ type: "DownloadFile", url, filename: fileName })
    );
    if (!r?.ok) throw new Error(r?.error || "Пустой ответ от background");
  } catch (e) {
    console.warn(e);
    downloadFileOld(url, fileName);
  }
}

function getIcon(path) {
	return BrowserContext.runtime.getURL(path)
}

const IFrameMetaPatch = `
<meta charset="utf-8">
`

const IFrameCSSPatch = `
<style>
html, body {
    width: 100%;
    margin: 0;
	white-space: pre-wrap;
}

img, video {
    max-width: 100%;
    max-height: 100%;
	width: auto;
	height: auto;
	border-radius: 6px
}

::-webkit-scrollbar {
    width: 6px;
    max-width: 6px;
	max-height: 6px;
    border-radius: 10px;
}

::-webkit-scrollbar-track {
    background: transparent;
    width: 6px;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #7f7f7f8c;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4f4f4f;
}

</style>
`

const IFrameThemeBridgePatch = `
<script>
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_SINGLE_STYLE') {
      const { styleId, cssContent } = event.data;
      
      let styleTag = document.getElementById(styleId);
      
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      
      styleTag.textContent = cssContent;
    }
  });
</script>

`


const CSSImprove = `
	.hw-md_single__select-mark md-radio-button .md-label button span { top: -1px; position: relative } /* Fixes mark pos in hw check */
	.students .card .card-internal {border-radius: 8px} /* Students Tab */
	.groups .presents table {
		border-radius: 10px;
		overflow: hidden;
	}
	
	.has_header md-content md-select-header input {
		left: 0px;
		width: calc(100% - 16px);
		padding: 4px 8px;
	}
	
	.md-dialog-container {
		position: fixed;
		top: 0px !important;
		z-index: 101;
		height: 100% !important
	}
	
	.binding_materials .binding-materials-table pre {
		font-size: 13px;
	}
	
	@media (max-width: 1200px) {
		.binding_materials .binding-materials-table .cutted_wrap {
			width: fit-content; min-width: 30%; margin-bottom: 0px;
		}
	}
	
	.binding_materials .binding-materials-table tr {border-radius: 10px;}
	
	.hw-md_single_stud-work__answer-text { max-width: 100%; line-break: anywhere }
	.internal-wrap-global md-input-container .md-placeholder, .internal-wrap-global md-input-container label {transition: all .2s}
`

const CustomHwWindowHelper = `
	<h2> Рекомендации по работе с новым окном ДЗ </h2>
	<span class="warn"> 
		Это окно является полностью самописным, давая полный контроль над происходящим. Т.к. документаций нет - для разработки использовался реверс инжиниринг.
		Возможны ошибки в работе окна, если возникают проблемы - сообщите мне в <a href="https://dsvl0.t.me/" target='_blank' >Telegram</a>.
		<br>
		<br>
		Работа каждой горячей клавиши настраивается отдельно в настройках расширения
	</span>	
	
	<span type=divider></span>
	
	
	<div class="Shortcuts">
		<h4 title> Горячие клавишы </h4>
		
		<div class="ShortcutInfo">
			<div class="SCPreview">
				<span class="SCDemoKey"> SHIFT </span>
				<span class="SCDemoPlus"> + </span>
				<span class="SCDemoKey"> W </span>
			</div>
			<span> — Удерживая эти клавишы, поставьте оценку, и работа автоматически отправится с выбранной отметкой </span>		
		</div>
		
		<div class="ShortcutInfo">
			<div class="SCPreview">
				<span class="SCDemoKey"> SHIFT </span>
				<span class="SCDemoPlus"> + </span>
				<span class="SCDemoKey"> F </span>
			</div>
			<span> — Удерживая эти клавишы, наведитесь мышкой на работу чтобы поставить максимальную оценку</span>		
		</div>
		
		
	</div>
	
	<button class="HelperGoBack"> Назад </button>
			
`

// SHIFT + W
KeyboardController.when(
	["shift", "w"],
	() => {
		if (CurrentSettings.HotKey_OneClickSend) {
			document.body.classList.add("ShiftW")
		}
	}
)
KeyboardController.after(
	["shift", "w"],
	() => {document.body.classList.remove("ShiftW")}
)


// SHIFT + F
KeyboardController.when(
	["shift", "F"],
	() => { 
		if (CurrentSettings.HotKey_HoldToSetMark) {
			HwFastMarkStart();
		}
	},
	{ onDownEvent: true, ignoreInInput: true }
)
KeyboardController.after(
	["shift", "F"],
	() => {log(1); HwFastMarkStop();},
	{ onReleaseEvent: true }
)

