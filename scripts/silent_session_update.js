function gaussian(mean, stdDev, min, max) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return Math.min(max, Math.max(min, mean + z * stdDev));
}


const MEAN_S = 7.5 * 60;
const SD_S   = 1.5 * 60;
const MIN_S  = 3 * 60;
const MAX_S  = 14 * 60;

function nextDelayMs() {
  return gaussian(MEAN_S, SD_S, MIN_S, MAX_S) * 1000;
}

function scheduleNext() {
  const delay = nextDelayMs();
  console.debug(`Следующее обновление сессии через ${(delay / 60000).toFixed(1)} мин`);
  setTimeout(() => sessionUpdate(0), delay);
}



async function sessionUpdate(attempt = 0) {
  if (typeof CurrentSettings === "object" && !CurrentSettings.DoSessionUpdate) {
    scheduleNext();
    return;
  }

  console.debug("Running Session Update!");

  try {
    const res = await fetcher('https://omni.top-academy.ru/auth/get-start-info', 'POST');
    const cityId = res?.data?.branch?.id_city;
    if (!cityId) throw new Error("no city id");
	
	if (lastCityId !== cityId) {
		lastCityId = cityId;
		LoadCustomAvatars();
	}

    await fetcher(`https://omni.top-academy.ru/auth/change-city?city=${cityId}`, 'GET');
    scheduleNext();
  } catch (e) {
    if (attempt >= 2) {
      Toast.create("Не удалось обновить сессию :(", 5000, {});
      scheduleNext();
      return;
    }
	
    const retryMs = gaussian(40, 10, 20, 60) * 1000;
    setTimeout(() => sessionUpdate(attempt + 1), retryMs);
  }
}

setTimeout(() => sessionUpdate(0), 1200);