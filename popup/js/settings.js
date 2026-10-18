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
		  notifySettingsChange();
		});
	  },

	  delete(key) {
		return new Promise(resolve => {
		    chrome.storage.local.remove(key, resolve);
		    notifySettingsChange();
		});
	  },

	  clear() {
		return new Promise(resolve => {
		    chrome.storage.local.clear(resolve);
			notifySettingsChange();
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




const findInput = (settingName) => {
	find(`input[SettingName="${settingName}"]`).click()
}

const GetDatapackData = () => {
	return UserSettings["@DataPack"];
}


const GetDatapack = {
	Images: () => {
		let data = GetDatapackData();
		if (!data) {return []};
	
		let HTMLCode = ''
		for (imgCode of data.sequence) {
			HTMLCode += `
				<img src="${imgCode}">
			`
		}; return HTMLCode
		
	},
	ImagesNum: () => {
		let data = GetDatapackData();
		if (!data) {return 0;} else {return data.sequence.length}
	},
	SoundsNum: () => {
		let data = GetDatapackData();
		if (!data) {return 0;} else {return data.sounds.length}
	},
	AnimationLen: () => {
		let data = GetDatapackData();
		if (!data) {return 0;} else {return data.animLength}
	},
	FirstImage: () => {
		let data = GetDatapackData();
		return data.sequence[0]
	}
};




(async() => {
	UserSettings = await Settings.getAll();

	window.GenerateSettingsCode = async () => {
		function GetSwitch(settingName) {
			const isEnabled = UserSettings[settingName];
			return `
			<label class="toggle-switch">
				<input SettingName="${settingName}" type="checkbox" ${isEnabled ? 'checked' : ''}/>
				<span class="slider"></span>
			</label>
			<h2 data-i18n="${settingName}"></h2>
			`
		}
		return `
			<div class="SettingSection General Chosen">
				<div class="TypeRoulette">
					<option type=functions data-i18n="roulette.type.functions"></option> 
					<option type=theme data-i18n="roulette.type.theme"></option> 
					<option type=other data-i18n="roulette.type.other"></option> 
				</div>
						
				
				
				
				<div type=functions class="TypeSelector">
					<div class="SettingLine">
						${GetSwitch('ShowTeacherPreview')} 
						<p data-i18n="ShowTeacherPreview.Desc"></p>
					</div>
					<div class="SettingLine">
						${GetSwitch('DoSessionUpdate')} 
						<p data-i18n="DoSessionUpdate.Desc"></p>
					</div>
				</div>
				
				
				
				<div type=theme class="TypeSelector">
					<div class="SettingLine">
						${GetSwitch('DarkTheme')} 
						<p data-i18n="DarkTheme.Desc"></p>
					</div>
					<div class="SettingLine">
						${GetSwitch('FullScreenHomeworkCard')} 
						<p data-i18n="FullScreenHomeworkCard.Desc"></p>
					</div>
					<div class="SettingLine">
						${GetSwitch('LoadingIndicatorFix')} 
						<p data-i18n="LoadingIndicatorFix.Desc"></p>
					</div>
				</div>
				
				
				
				<div type=other class="TypeSelector">
					
				</div>
			</div>
			
			
			
			
			<div class="SettingSection ServerChoose">
				<div class="UploadPack DataPack SettingLine">
				
				</div>
			</div>
			
			
			<div class="SettingSection CacheControl">
				<h3 data-i18n="CacheControl" class="CacheControl"></h3>
				
				<div class="MemoryUsageStats">
					<span class="UsageLine">
						<h1 id="Usage"></h1>
						<span data-i18n="MegaBytes_Took"></span>
					</span>
						
				
					<div class="Line">
						<span id="Took"></span>
					</div>
				</div>
				
				<button id="resetCache"> reset cache <button>
			</div>
			
			
			
			<div class="SettingSection AiSettingDiv">
				<div class="SettingLine">
					${GetSwitch('LoyalAI')} 
					<p data-i18n="LoyalAI.Desc"></p>
				</div>
				
				<div class="SettingLine">
					${GetSwitch('AiLearning')} 
					<p data-i18n="AiLearning.Desc"></p>
				</div>
				
			</div>
			
			<div class="SettingSection AuthorsTab">
				<h2 class="AuthorsTab" data-i18n="AboutProject"></h2> 
				
				<div class="AuthorList">
					<span data-i18n="AboutThisProject_P1" class="AboutThisProject"></span>					
					<span data-i18n="AboutThisProject_P2" class="AboutThisProject"></span>					
				</div>
				
				
				<div class="flex github">
					<img src="icons/github.svg">
					<span data-i18n="ProjectOnGitHub"></span>
				</div>
				<div class="flex github tg">
					<img src="../icons/telegram.svg">
					<span data-i18n="ContactDev"></span>
				</div>
			</div>
			
			<div class="SettingSection OtherTab">
				
				
				<span class="madeWith"></span>
			</div>
				
				
			
			
			
			
			
			<div class="SettingSection changeLog">
				${LastChangeLogs}
			</div>
			
		
		`
	}
	
	document.runSettingBing();
})()


const UpdateSizeCounters = (kb) => {
	let H1Usage = find('div.CacheControl div.MemoryUsageStats span.UsageLine h1#Usage');
	let UsageBar = find('div.CacheControl div.MemoryUsageStats div.Line');
	
	
	let maxSize = UserSettings.MaxCacheSize ? UserSettings.MaxCacheSize : 30; // MB
	let barWidth = ((kb/1024)/maxSize) * 100;
	
	H1Usage.textContent = (kb/1024).toFixed(2)
	UsageBar.find('#Took').style.width = `${barWidth}%`
	UsageBar.classList.add("hidden");
	
	
	if (kb > 512 && barWidth > 2) {
		UsageBar.classList.remove("hidden");
	}
}


const UpdateTypes = (newType) => {
	findAll('div.SettingSection.General > div.TypeSelector').forEach(SettingLine => {
		if (newType && SettingLine.getAttribute('type') !== newType) {
			SettingLine.classList.add('typeIncompatible')
		} else {
			SettingLine.classList.remove('typeIncompatible')
		}
	})
	findAll('div.SettingSection.General > div.TypeRoulette option').forEach(opt => {
		opt.classList.remove('active')
	})
	
	
	if (newType) {
		find(`div.SettingSection.General > div.TypeRoulette option[type="${newType}"]`).classList.add('active')
	}
}

const TypesRegister = () => {
	findAll('div.TypeRoulette option').forEach(option => {
		option.addEventListener('click', () => {
			UpdateTypes(option.getAttribute('type'));
		})
	})
}

const onSettingsChanged = async () => {
	let AllowContextMenu_Record = await Settings.get('AllowContextMenu.Record');
	RemoveStyle('AllowContextMenu_Record')
	if (!AllowContextMenu_Record) {
		CreateStyle('AllowContextMenu_Record', `
			.SettingLine.ExportAsSetting {display: none}
		`)
	}
}
onSettingsChanged();


const MadeWithController = {
	runNextTimeout: 3500,
	display: undefined,
	varinats: [
		"for people", "with the soul", "with love", "with faith in the best", "by an 18 y.o. human", "while listening to Bi-2"
	],
	current: -1,
	
	get: () => {
		return MadeWithController.varinats[MadeWithController.current];
	},
	
	getPrev: () => {
		return MadeWithController.varinats[MadeWithController.current-1];
	},
	
	getNext: () => {
		return MadeWithController.varinats[MadeWithController.current+1];
	},
	
	init: () => {
		MadeWithController.display = find("span.madeWith");
		MadeWithController.display.innerHTML = `
			Made
			<div class="flex">
				<span class="prev">${MadeWithController.getPrev()}</span>
				<span class="displaying">${MadeWithController.get()}</span>
				<span class="next">${MadeWithController.getNext()}</span>
			</div>
		
		`
		if (isFirefox) {MadeWithController.display.classList.add("FF");}
		MadeWithController.showNext();
		setInterval(MadeWithController.showNext, MadeWithController.runNextTimeout);
	},
	
	showNext: () => {
		if (window.StopRoulette) {return}
		
		let display = MadeWithController.display;
		MadeWithController.current++;
		
		const DISPLAYING = "displaying"; const PREV = "prev";  const NEXT = "next"; 
		
		let previous = display.find(`.${PREV}`);
		let displaying = display.find(`.${DISPLAYING}`);
		let next = display.find(`.${NEXT}`);
		
		if (previous) { previous.remove(); previous = displaying; displaying.classList.add(PREV); displaying.classList.remove(DISPLAYING); }
		displaying = next;
		displaying.classList.add(DISPLAYING); displaying.classList.remove(NEXT); 
		
		
		next = document.createElement('span');
		next.classList.add(NEXT);
		next.textContent = MadeWithController.getNext();
		
		
		let div = display.find('div');
		div.appendChild(next);		
		display.style.paddingLeft = "20px";
		div.style.width = (displaying.realWidth + 20) +"px";
		
		
		if (MadeWithController.current >= MadeWithController.varinats.length-2) {
			MadeWithController.current = -2;			
		}
	}
	
}


const runDataPackGeneration = function() { //data-i18n
	return `
						<div class="removeSavedDataPack">
							<img src="icons/delete.svg">
							<span data-i18n="delete">${TranslateAssistant.translate.get('delete')}</span>
						</div>
						<div class="AvailableDataPack" packname="@DataPack">
							<div class="FullWidthpreview">
								<img src="${GetDatapack.FirstImage()}"</img>
							</div>
							<div class="PreviewData">
								<span class="packName"> Data Pack </span>
								<div class="ImagePreview"> ${GetDatapack.Images()} </div>
								
								
							</div>
							
							<div class="PreviewData TextType">
								<span data-i18n="howmanysounds"> Sounds: <span>${GetDatapack.SoundsNum()} | </span> <span data-i18n="howmanyimages"> Images: <span>${GetDatapack.ImagesNum()}</span> </span> </span>
								<span data-i18n="howlong"> Length: <span>${GetDatapack.AnimationLen()}ms</span></span>
							</div>
							
						</div>
						`	
}



