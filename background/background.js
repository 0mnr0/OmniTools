const DOMAIN = "omni.top-academy.ru";
const COOKIE_NAME = "city_id";

// Функция десериализации PHP-данных
function phpUnserialize(str) {
    let match = str.match(/\{i:0;s:\d+:"([^"]+)";i:1;i:(\d+);}/);
    return match ? { [match[1]]: parseInt(match[2]) } : null;
}

// Функция получения значения куки
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

// Обработчик сообщений от content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getCityID") {
        getCityID((cityID) => sendResponse({ cityID }));
        return true; 
    }
});


















let Radarlaunched = false;


chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://msapi.top-academy.ru/*"] },
  ["requestHeaders"]
);




function DownRadar() {
	if (Radarlaunched === true) {return} 
	Radarlaunched = true;
	const IgnoreURL = [];
	const AcceptedStatuses = [200, 204, 201, 205]
	let FailedFetches = [];

	function downReports(fetchData) {
		let CopiedFailedFetches = FailedFetches;
		FailedFetches = [];
		if (CopiedFailedFetches.length > 0){ 
			fetch('https://raw.githubusercontent.com/0mnr0/WallpaperInJournal/main/JournalConfigurations/serverInformation.json').then(response => response.json())
			.then(res => {
				BasicUrl = res.serverUrl;
				fetch(BasicUrl+'/downReport', {
				  method: 'POST',
				  headers: {
						'Content-Type': 'application/json',
				  },
				  mode: 'no-cors',
				  body: JSON.stringify(CopiedFailedFetches),
				  })
			})
		}
	}
	
	function CheckAndAppendReport(report) {
		if (AcceptedStatuses.indexOf(report.statusCode) == -1 && IgnoreURL.indexOf(report.url) == -1) {
			
			if (report.url.indexOf('journal') != -1) { console.log("Getting info for this bro:", report) }
			if (report.url == "https://msapi.top-academy.ru/api/v2/auth/login" && report.statusCode === 401) {return}
			if (report.url.indexOf("https://journal.top-academy.ru/") > -1 && report.statusCode === 403) {return} //VPN Errors
			if (report.url.indexOf("https://msapi.top-academy.ru/") > -1 && report.statusCode === 403) {return} //VPN Errors
			if (report.url.indexOf("https://msapi.top-academy.ru/api/v2/homework/evaluation/operations/get") > -1 && report.statusCode === 404) {return} //Journal Basic Error
			if (report.url == ("https://journal.top-academy.ru/undefined")) {return} //Journal Basic Error
			if (report.url == ("https://msapi.top-academy.ru/api/v2/auth/login") && report.statusCode === 429) {return} //Incorrect password error
			if (report.url == ("https://msapi.top-academy.ru/api/v2/auth/login") && report.statusCode === 400) {return} //Incorrect data sended
			if (report.url == ("https://msapi.top-academy.ru/api/v2/auth/login") && report.statusCode === 401) {return} //UI Bug that sometimes happening
			
			
			let time = new Date()
			let ClientTime = time.getDay()+"."+(time.getMonth()+1)+"."+time.getFullYear()
			
			FailedFetches.push({
				statusCode: report.statusCode,
				url: report.url
			})
			
		}
	}
	


	let MinutesToPush = 5; //5
	chrome.webRequest.onCompleted.addListener(
	  (details) => { CheckAndAppendReport(details); },
	  { urls: ["https://*.top-academy.ru/*", "https://journal.top-academy.ru/*"] }
	); setInterval(downReports, 60*MinutesToPush*1000)
}


DownRadar()
chrome.runtime.onInstalled.addListener(() => {
	  setTimeout(DownRadar, 10000)
});



chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url.includes("omni.top-academy.ru")) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        url: details.url,
                        requestBody: details.requestBody
                    });
                }
            });
        }
    },
    { urls: ["*://omni.top-academy.ru/*"] },
    ["requestBody"]
);
