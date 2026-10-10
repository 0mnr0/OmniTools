const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const BrowserContext = isFirefox ? browser : chrome;

const Settings = {
	  get(key, defValue) {
		return new Promise(resolve => {
		  chrome.storage.local.get(key, res => {
			if (res[key] === undefined) {resolve(defValue); return}
			resolve(res[key]);
		  });
		});
	  },

	  set(key, value) {
		return new Promise(resolve => {
		  chrome.storage.local.set({ [key]: value }, resolve);
		});
	  },

	  delete(key) {
		return new Promise(resolve => {
		  chrome.storage.local.remove(key, resolve);
		});
	  },

	  clear() {
		return new Promise(resolve => {
		  chrome.storage.local.clear(resolve);
		});
	  },

	  async isKeyExists(key) {
		return new Promise(resolve => {
		  chrome.storage.local.get(key, res => {
			resolve(Object.prototype.hasOwnProperty.call(res, key));
		  });
		});
	  },
	  
	  getAll() {
		return new Promise(resolve => {
		  chrome.storage.local.get(null, res => {
			resolve(res);
		  });
		});
	  } 
	};

BrowserContext.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "OmniTools.events.SettingsChange") {
		UpdateSettings();
	}
});


let darkThemeStyle = null;
let SettingsCssContent = null;
let lastWarnHwPreviewToastId = null;
async function UpdateSettings() {
	let newSettings = await Settings.getAll();
	if (!SettingsCssContent) {
		SettingsCssContent = document.createElement('style');
		document.body.after(SettingsCssContent);
	}
	let cssContent = "";
		
	
	
	if (newSettings.DarkTheme) {
		cssContent += darkThemeCssContent + CSSImprove;
	}
	if (newSettings.DarkTheme !== CurrentSettings.DarkTheme) {
		AutoUpdateIFrameDarkTheme(newSettings.DarkTheme);
	}
	
	if (newSettings.ShowTeacherPreview !== CurrentSettings.ShowTeacherPreview) {
		if (find('div.CustomHWDiv') !== null) {
			if (Toast.find(lastWarnHwPreviewToastId) === null) {
				lastWarnHwPreviewToastId = 
					Toast.create("Некоторые изменения будут внесены только после повторного открытия окна с проверкой заданий", 4500, {zIndex: 100000000, closeText: "Понятно"})
			}			
		}
	}
	
	if (!newSettings.ShowTeacherPreview) {
		cssContent += `div.CustomHWDiv div.hwPreview.teacherPreview {display: none !important}`
	}
	
	
	if (newSettings.LoadingIndicatorFix) {
		cssContent += `
		body.main .loader {
			filter: hue-rotate(195deg);
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 0px;
			height: 0px;
		}`;
	}	
	
	if (newSettings.FullScreenHomeworkCard) {
		cssContent += `
			div.CustomHWDiv div.content {
				height: 100%;
			}
		
			body div.CustomHWDiv div.content div.hwBlock {
				min-height: 100%;
				margin-bottom: 5px;
				padding-top: 0px;
			}
			
			div.CustomHWDiv div.content div.hwBlock div.Tools {
				margin-top: auto;
			}
		`

	}
	
	
	
	SettingsCssContent.textContent = cssContent;
	CurrentSettings = newSettings;
}


UpdateSettings();