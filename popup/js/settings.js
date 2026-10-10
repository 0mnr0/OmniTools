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
						${GetSwitch('AiLearning')} 
						<p data-i18n="AiLearning.Desc"></p>
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
					<div class="SettingLine">
						${GetSwitch('EnableSuperFeatures')} 
						<p data-i18n="EnableSuperFeatures.Desc"></p>
					</div>
					
					<div class="SettingLine">
						${GetSwitch('MakeAnnouncements.Ext')} 
						<p data-i18n="MakeAnnouncements.Ext.Desc"></p>
					</div>
					
					<div class="SettingLine ExportAsSetting">
						<span> ${TranslateAssistant.translate.get('ExportAsOption')} </span>
						<div class="flex">
							<div class="ExportAs" value=gif> GIF </div>
							<div class="ExportAs" value=webm> WEBM </div>
						</div>
					</div>
				</div>
			</div>
			
			
			
			
			<div class="SettingSection ServerChoose">
				<div class="UploadPack DataPack SettingLine">
				
				</div>
			</div>
			
			
			<div class="SettingSection BlockList">
				<button id="resetCache"> reset cache <button>
			</div>
			
			
			<div class="SettingSection AuthorsTab">
				<h2 class="AuthorsTab" data-i18n="AuthorsTab"></h2> 
				
				<div class="AuthorList">
					
					<div class="Author">
						<div class="AvatarAndName">
							<img src="https://avatars.githubusercontent.com/u/99125366">
							<a href="https://github.com/0mnr0" target="_blank"> dsvl0 </a>
						</div>
						<span class="ContributorDesc" data-i18n="dsvl0Desc"></span>
					</div>
				</div>
				<div class="flex github">
					<img src="icons/github.svg">
					<span data-i18n="ProjectOnGitHub"></span>
				</div>
			</div>
			
			
			<div class="SettingSection OtherTab">
				<div class="SettingLine">
					${GetSwitch('Other')} 
					<p data-i18n="Other.Desc"></p>
				</div>
				
				<span class="madeWith"></span>
			</div>
				
				
			
			
			
			
			
			<div class="SettingSection changeLog">
				${LastChangeLogs}
			</div>
			
		
		`
	}
	
	document.runSettingBing();
})()


const runPatSound = async function() {
	let SoundPlace = 'etc/'+LoadedPack.PackPlace+'/'+LoadedPack.sounds[0];
	if (IsDataPack) {
		SoundPlace = LoadedPack.sounds[0]
	}
	
	if (IsDataPack) {
		playBase64Audio(SoundPlace)
	} else {
		let audio = new Audio(BrowserContext.runtime.getURL(SoundPlace));
		audio.volume = getVolume();
		audio.play();
	}
}


async function playBase64Audio(base64String, {volume = 1.0, muted = false} = {}) {
	const isMuted = !UserSettings.AllowSound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const base64Data = base64String.split(';base64,')[1] || base64String;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    try {
        const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        const gainNode = audioContext.createGain();
        gainNode.gain.value = isMuted ? 0 : getVolume();
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        return { audioContext, source, gainNode };
    } catch (e) {
        console.error("Failed to decode audio:", e);
    }
}

const GetIgnoreSitesList = () => {
	let val = UserSettings.IgnoreSites;
	if (val === undefined || val === null) {
		return [];
	} else { return val }
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

const AddIntoIgnoreList = (main, domainName) => {
	let domainDiv = createElementWith('div', {});
	domainDiv.className = 'domainDiv';
	
	domainDiv.innerHTML = `
		<img class="preview" src="https://www.google.com/s2/favicons?sz=128&domain=${domainName}">
		<span class="domainName">${domainName}</span>
		<img class="delete" src="icons/delete.svg">
	`;
	main.appendChild(domainDiv);
	
	
	domainDiv.find('img.delete').onclick = async () => {
		let newIgnoreList = GetIgnoreSitesList().filter(item => item !== domainName)		
		await Settings.set('IgnoreSites', newIgnoreList);
		UserSettings.IgnoreSites = newIgnoreList;
		domainDiv.remove();
		Toast.create(
			TranslateAssistant.translate.get('BlockList.ReloadPageToApply'),
			3000
		);
	}
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
		"for fun", "for people", "for pating cats", "for pating anything", "for memes", "with the soul", "with love", "with love, by humans"
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



