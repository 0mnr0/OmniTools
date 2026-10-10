// https://omni.top-academy.ru/auth/change-city?city='


const SESSION_UPDATE_INTERVAL = 7.5 * 60; // MINUTES
function sessionUpdate(attempt=0) {
	if (typeof CurrentSettings === "object" && !CurrentSettings.DoSessionUpdate) {
		return;
	}
	console.debug("Running Session Update!");
	
	if (attempt >= 3) {
		Toast.create("Не удалось обновить сессию :(", 5000, {});
		return
	}
	
	fetcher('https://omni.top-academy.ru/auth/get-start-info', 'POST').then(res => {
		let payload = res.data;
		let cityId = payload?.branch?.id_city;
		
		if (!cityId) {
			sessionUpdate(attempt+1);
			return;
		} else {
			fetcher(`https://omni.top-academy.ru/auth/change-city?city=${cityId}`, 'GET')
		}
	})
}


setInterval(() => {
	sessionUpdate(0);
}, SESSION_UPDATE_INTERVAL*1000);

setTimeout(() => {
	sessionUpdate(0);
}, 1000)