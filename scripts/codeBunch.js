// https://omni.top-academy.ru/auth/get-start-info

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
    background: #b7b7b7;
    width: 6px;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #7f7f7f;
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