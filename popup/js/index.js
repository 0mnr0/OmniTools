const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const BrowserContext = (typeof chrome === 'object') ? chrome : browser;
const SettingsPane = find('.settingsPane');
let UserSettings = {};


(async () => {
	
	function GenerateSwitch(SettingName) {
		const isEnabled = false;
		return `
		<label class="toggle-switch">
			<input type="checkbox" ${isEnabled ? 'checked' : ''}/>
			<span class="slider"></span>
		</label>
		`
	}
	
	document.runSettingBing = async () => {
		SettingsPane.innerHTML = await GenerateSettingsCode();
		TranslateAssistant.translate.all();
		
		
		SettingsPane.findAll('div.SettingLine h2').forEach(el => {
			el.onclick = () => {findInput(el.getAttribute('data-i18n'))}
		});
		
		SettingsPane.findAll('div.SettingLine input[type="checkbox"]').forEach(el => {
			el.onclick = () => {
				Settings.set(el.getAttribute('SettingName'), el.checked);
			}
		});
		
		SettingsPane.findAll('div.SettingLine input[type="range"]').forEach(el => {
			let SetName = el.getAttribute('SettingName');
			
			
			
			el.addEventListener('input', async () => {
				notifySettingsChange();
				if (SetName) {
					let NewValue = Number(el.value);
					if (SetName === 'PatSpeed') {NewValue = Math.round(NewValue*100); if (NewValue>=98 && NewValue<=102) { el.value = 1; NewValue = 100;}}

					const RangeTextValue = el.nextElementSibling;
					if (RangeTextValue) {RangeTextValue.textContent = `${NewValue}%`}
				}
			});
			
			if (SetName === 'PatVolume') {
				el.addEventListener('change', async () => {
					let NewValue = Number(el.value)
					await Settings.set(SetName, NewValue);
					await loadPackData();
					runPatSound();
				})
			}
			
			if (SetName === 'PatSpeed') {
				el.addEventListener('change', async () => {
					let NewValue = Number(el.value)
					await Settings.set(SetName, NewValue);
					await loadPackData();
				})
			}
		});
		
		
		
			// Divides Switcher
			
			findAll('div.SettingsDiv div.leftPane > div > div').forEach(settingType => {
				
				settingType.onclick = () => {
					let newDivide = settingType.getAttribute('SettingLinkedTo')
					ClearAllSettingTypes();
					findAll('div.SettingSection').forEach(SettingDisplayingType => {
						SettingDisplayingType.classList.remove('Chosen');
						SettingDisplayingType.classList.add('Hidden');
					});
					LocalStorage.save('LastSection', newDivide);
					let CurrentSetting = find(`div.SettingSection.${newDivide}`);
					if (!CurrentSetting) {warn('Setting Div is not found :('); return}
					CurrentSetting.classList.remove('Hidden');
					CurrentSetting.classList.add('Chosen');
					settingType.classList.add('active');
				}
			});
			const LastSectionOpened = LocalStorage.get('LastSection');
			if (LastSectionOpened) {find(`div[settinglinkedto="${LastSectionOpened}"]`).click()}
		
		
		

		find("button#resetCache").onclick = () => {
			indexedDB.deleteDatabase("HWCacheDB")
		}
		
		
		setGitListener();
		MadeWithController.init();
		TypesRegister();
		UpdateTypes('functions')
		CreateStyle('EnableTransitions', '* { transition: all .3s, scrollbar-color 0s, scrollbar-width 0s; }');
	}
})();

function notifySettingsChange(){
	chrome.runtime.sendMessage({type: "OmniTools.events.SettingsChange"}, () => {});
	onSettingsChanged();
}

const getCleanDomain = function(url) {
  try {
	  let checkUrl = url.startsWith('http://') || url.startsWith('https://') ? url : 'https://' + url;
	  
      let parsed = new URL(checkUrl);
      return parsed.hostname.replace(/^www\./, '').replaceAll("/","");
  } catch (e) {
      return null;
  }
}
function ClearAllSettingTypes() {
	findAll('div.SettingsDiv div.leftPane > div > div' ).forEach(settingType => { settingType.classList.remove('active'); })
}





const manifestData = chrome.runtime.getManifest();
if (manifestData && manifestData.version) {
	let versionDisplay = find('span.Extension.version');
	
	versionDisplay.textContent = manifestData.version;
	versionDisplay.onclick = () => {
		return; // i dont want to show that afwul design
		ClearAllSettingTypes();
		
		findAll('div.SettingSection').forEach(SettingDisplayingType => {
			SettingDisplayingType.classList.remove('Chosen');
			SettingDisplayingType.classList.add('Hidden');
		});
		let CurrentSetting = find(`div.SettingSection.changeLog`);
		if (!CurrentSetting) {warn('Setting Div is not found :('); return}
		
		CurrentSetting.classList.remove('Hidden');
		CurrentSetting.classList.add('Chosen');
		
	};
}

function setGitListener() {
	find('div.github').onclick = () => {
		window.open('https://github.com/0mnr0/OmniTools')
	}
}

