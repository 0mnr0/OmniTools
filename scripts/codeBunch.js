// https://omni.top-academy.ru/auth/get-start-info

const DeveloperHash = "82cb119234503";
let lastCityId = null;
let CurrentSettings = {};

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) { a.download = fileName; }
  a.style.display = 'none'; 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
		height: 100% !important
	}
	
	.hw-md_single_stud-work__answer-text { max-width: 100%; line-break: anywhere }
	.internal-wrap-global md-input-container .md-placeholder, .internal-wrap-global md-input-container label {transition: all .2s}
`

