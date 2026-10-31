const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
// Safari and Chromium expose the callback-compatible `chrome` namespace.
// Firefox falls back to `browser`.
const BrowserContext = typeof chrome !== "undefined" ? chrome : browser;
const SettingsPane = find('.settingsPane');
let UserSettings = {};

if (isFirefox) {
	document.body.classList.add('FF')
}


const fetcher = async (url, method = 'GET', data = null, asText = false, headers = {}) => {
  const options = { method: method.toUpperCase(), headers: { ...headers } };

  if (data !== null && data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    return { ok: false, status: 0, data: null, error };
  }

  let body = null;
  if (response.status !== 204) {
    body = await (asText ? response.text() : response.json()).catch(() => null);
  }

  return { 
	ok: response.ok,
	status: response.status,
	data: body, error: null
  };
};



async function UpdateSize() {
	let res = await BrowserContext.runtime.sendMessage({ __idbBridge: true, method: "getSize", args: [] });
	if (!res.ok) {res = {result: {count: 0, kb: 0}}} // db was cleared
	let dbSize = res.result;
	UpdateSizeCounters(dbSize.kb);
}

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
					if (newDivide.toLowerCase() === "none") {return}
					
					ClearAllSettingTypes();
					UpdateSize();
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
		
		
		

		
		
		
		setGitListener();
		MadeWithController.init();
		TypesRegister();
		MaxCacheMemoryController();
		RegCacheCleaners();
		UpdateActiveCacheChoice();
		setOnFirefoxListener();
		regPingStatus();
		UpdateTypes('functions')
		CreateStyle('EnableTransitions', '* { transition: all .3s, scrollbar-color 0s, scrollbar-width 0s; }');
		setInterval(UpdateSize, 2000);
	}
})();

function UpdateActiveCacheChoice() {
	let currentCacheSize = UserSettings.MaxCacheSize;
	let cacheField = find(`div.MemoryUsageControl div.MemoryUsageControlList div.UsageControlOption[mem="${currentCacheSize}"]`);
	findAll(`div.MemoryUsageControl div.MemoryUsageControlList div.UsageControlOption`).forEach(field => {
		field.classList.remove('active')
	})
	if (cacheField) {
		cacheField.classList.add('active')
	}
	
}

function setOnFirefoxListener() {
	let targetDiv = find('div.SettingSection.AuthorsTab div.NowInFirefox')
	targetDiv.onclick = () => {
		window.open('https://addons.mozilla.org/ru/firefox/addon/omni-tools/', target='_blank')
	}
}

function notifySettingsChange(){
	BrowserContext.runtime.sendMessage({type: "OmniTools.events.SettingsChange"}, () => {});
	onSettingsChanged();
}
const PING_INTERVAL = 60_000;
const PING_TIME_KEY = 'regPingStatus:lastSuccess';
const PING_CACHE_KEY = 'regPingStatus:lastPayload';
let pingTimer = null;

function scheduleNextPing(delay) {
	clearTimeout(pingTimer);
	pingTimer = setTimeout(regPingStatus, delay);
}

function regPingStatus() {
	let ParentPingDiv = find('div.ServerStatuses');
	let PingingSpan = ParentPingDiv.find('span.LoadingServStat');
	PingingSpan.classList.add('Pinging');
	ParentPingDiv.onclick = () => {
		window.open('https://status.journalui.ru/', '_blank');
	};

	const Statuses = {
		"OK": {name: 'ok', filter: ''},
		"GLITCH": {name: 'glitch', filter: 'hue-rotate(265deg)'},
		"FAIL": {name: 'fail', filter: 'contrast(2) hue-rotate(265deg)'},
		"MALFUNCTION": {name: 'malf', filter: 'contrast(2) hue-rotate(225deg)'}
	};

	function StatusByRate(rate) {
		if (rate < 50) return Statuses.MALFUNCTION;
		if (rate < 75) return Statuses.FAIL;
		if (rate < 95) return Statuses.GLITCH;
		return Statuses.OK;
	}

	function GetServiceStatus(dat) {
		if (!dat || !dat.alive) return Statuses.MALFUNCTION;
		return StatusByRate(dat.successRate);
	}

	function CalcAvgStatus(payload) {
		const services = Object.values(payload);
		if (services.length === 0) return Statuses.MALFUNCTION;

		let sum = 0;
		for (const service of services) {
			sum += service.alive ? service.successRate : 0;
		}
		return StatusByRate(sum / services.length);
	}

	function UpdateIcons(OmniStatus, AverageStatus) {
		let OmniIcon = ParentPingDiv.find('div.Omni img.PingIco');
		OmniIcon.style.filter = OmniStatus.filter;

		let GlobalIcon = ParentPingDiv.find('div.Global img.PingIco');
		GlobalIcon.style.filter = AverageStatus.filter;
	}

	function ApplyPayload(payload) {
		const OmniStatus = GetServiceStatus(payload.Omni);
		const AverageStatus = CalcAvgStatus(payload);
		UpdateIcons(OmniStatus, AverageStatus);
		ParentPingDiv.classList.add('WasLoaded');
		PingingSpan.classList.add('Hidden');
		PingingSpan.classList.remove('Pinging');
	}


	const lastSuccess = Number(localStorage.getItem(PING_TIME_KEY)) || 0;
	const remaining = PING_INTERVAL - (Date.now() - lastSuccess);

	if (remaining > 0) {
		try {
			const cached = JSON.parse(localStorage.getItem(PING_CACHE_KEY));
			if (cached) ApplyPayload(cached);
		} catch (e) { }

		scheduleNextPing(remaining);
		return;
	}

	if (!ParentPingDiv.classList.contains('WasLoaded')) {
		PingingSpan.classList.remove('Hidden');
		PingingSpan.classList.add('Pinging');
	}

	fetcher('https://status.journalui.ru/health', 'GET', null).then(res => {
		if (!res.ok) throw new Error('Health check failed');
		const payload = res.data;

		ApplyPayload(payload);

		try {
			localStorage.setItem(PING_TIME_KEY, String(Date.now()));
			localStorage.setItem(PING_CACHE_KEY, JSON.stringify(payload));
		} catch (e) { console.log(e); }
		PingingSpan.classList.remove('Pinging');
	}).catch(err => {
		console.log(err);
		PingingSpan.classList.remove('Pinging');
		PingingSpan.classList.add('Hidden');
	}).finally(() => {
		scheduleNextPing(PING_INTERVAL);
	});
}

function MaxCacheMemoryController() {
	const allOptions = findAll('div.MemoryUsageControl div.MemoryUsageControlList div.UsageControlOption');
	allOptions.forEach(option => {
		option.addEvent('click', async () => {
			const targetMemory = option.getAttribute('mem');
			if (targetMemory < 30) {
				console.warn("Min cache size: 30");
				return
			}
			
			await Settings.set("MaxCacheSize", targetMemory);
			UserSettings.MaxCacheSize = Number(targetMemory);
			UpdateSize();
			UpdateActiveCacheChoice();
		})
	})
}

function RegCacheCleaners() {
	const clearOld = find('div.CacheControl button#resetOldCache')
	const clearAll = find('div.CacheControl button#resetAllCache')
	
	
	clearOld.onclick = async () => {
		clearOld.disabled = true;
		let res = await clearOldCacheFunc("HWCacheDB");
		
		if (res > 0) {			
			Toast.create(TranslateAssistant.translate.get('DoneAndCleared') + res, 3000, {});
		} else {
			Toast.create(TranslateAssistant.translate.get('DoneAndNotCleared'), 3000, {});
		}
		UpdateActiveCacheChoice();
		UpdateSize();
		clearOld.disabled = false;
	}
	
	clearAll.onclick = async () => {
		clearAll.disabled = true;
		let res = confirm(TranslateAssistant.translate.get('ResetAllCacheConfirm'));
		if (res) {
			await eraseIndexedDB("HWCacheDB")
			Toast.create(TranslateAssistant.translate.get('Done'), 3000, {});
			UpdateActiveCacheChoice();
			UpdateSize();
		}
		clearAll.disabled = false;
	}
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





const manifestData = BrowserContext.runtime.getManifest();
if (manifestData && manifestData.version) {
	let versionDisplay = find('span.Extension.version');
	
	versionDisplay.textContent = "2.0.0 Beta1";
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
		window.open('https://github.com/0mnr0/OmniTools/tree/main-v2')
	}
	find('div.github.tg').onclick = () => {
		window.open('https://dsvl0.t.me/')
	}
}

