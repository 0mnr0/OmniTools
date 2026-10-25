import { getMedia } from "./lib/media.js";
import { toTransferable } from "./lib/transfer.js";
import IDBSettings from "./DBStore.js";

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const BrowserContext = isFirefox ? browser : chrome;
const ExtensionVersion = BrowserContext.runtime.getManifest().version;
const log = console.log;
IDBSettings.registerBridge();

const handlers = {
	async getMedia({ url, opts }) {
		return toTransferable(await getMedia(url, opts));
	}
};

BrowserContext.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	const handler = handlers[msg?.type];
	if (!handler) return false;

	handler(msg)
		.then(sendResponse)
		.catch((e) => sendResponse({ ok: false, error: String(e) }));

	return true;
});




const DOMAIN = "omni.top-academy.ru";
const COOKIE_NAME = "city_id";

function phpUnserialize(str) {
    let match = str.match(/\{i:0;s:\d+:"([^"]+)";i:1;i:(\d+);}/);
    return match ? { [match[1]]: parseInt(match[2]) } : null;
}

function getCityID(callback) {
    chrome.cookies.get({ url: `https://${DOMAIN}`, name: COOKIE_NAME }, (cookie) => {
        if (!cookie) {
            console.log("Куки не найдены");
            callback(null);
            return;
        }

        let parsedData = phpUnserialize(decodeURIComponent(cookie.value));
        let cityID = parsedData?.city_id || null;
        console.log("CityID:", cityID);
        callback(cityID);
    });
}


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


let UserSettings = {};

const DefaultValues = {
	MaxCacheSize: 200,
	DarkTheme: true,
	ImproveSiteStyle: true,
	LoadingIndicatorFix: true,
	AiLearning: true
};





async function SetupDefault () {
	UserSettings = await Settings.getAll();
	
	const DefaultValuesKeys = Object.keys(DefaultValues);
	for (let i = 0; i < DefaultValuesKeys.length; i++) {
		const key = DefaultValuesKeys[i]
		if (await Settings.isKeyExists(key) === false) {
			await Settings.set(key, DefaultValues[key])
		}
	}
	
}
SetupDefault();





BrowserContext.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type === "OmniTools.events.SettingsChange") {
		console.log("Settings changed!");
	    (async () => {
			const tabs = await BrowserContext.tabs.query({url: "*://omni.top-academy.ru/*"});
			await SetupDefault();

			for (const tab of tabs) {
				try {
					await BrowserContext.tabs.sendMessage(tab.id, {
						type: "OmniTools.events.SettingsChange"
					});
				} catch (e) {
					log(e);
				}
			}
			UserSettings = await Settings.getAll()
		})();
		sendResponse({ ok: true });
		return false;
	}
	
	if (msg.type === "getCityID") {
        getCityID((cityID) => sendResponse({ cityID }));
        return true; 
    }
	
    if (msg.type === 'OPEN_POPUP') {
		chrome.action.openPopup().catch(console.error);
    }	
	
	if (msg.type === "VersionBumper") {
        sendResponse({ status: BrowserContext.runtime.getManifest() });
		return false;
    }

	if (msg.type === "DownloadFile") {
		chrome.downloads.download(
			{ url: msg.url, filename: msg.filename, conflictAction: "uniquify" },
			(id) => {
				if (chrome.runtime.lastError) {
					sendResponse({ ok: false, error: chrome.runtime.lastError.message });
				} else {
					sendResponse({ ok: true, id });
				}
			}
		);
		return true;
	}
  
	return false;
});