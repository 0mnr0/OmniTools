const Listeners = {
	Homework: Homework_DOMChange
}

let warningAlertShown = false;
function onDomChange() {
	let loc = location.href;
	
	
	InjectSettingsButton();
	if (loc.includes("/login/")) {
		lastCityId = null;
		onAccountReset(); // in customAvatars
	} else if (!warningAlertShown) {
		warningAlertShown = true;
		Toast.create(
			"Для этого обновления расширение было переведено на независмые popup окна. Если вы испытываете проблемы - пожалуйста, напишите мне в <a href='https://dsvl0.t.me' target='_blank'>Telegram</a>",
			-1, {closeText: "Закрыть"}
		);
	}
		
	
	if (loc.endsWith("/homeWork")) {
		Listeners.Homework();
	}
	
	iAmLateFeature();
	if (loc.includes("students/comment")) {
		setGenAi();
		aiReviewAnimationWasShown = true;
	} else {
		aiReviewAnimationWasShown = false;
	}	
}

function onPageChange() {
	
}



let timeout;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(onDomChange, 200);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});



function interceptHistory() {
    const changeState = (type) => {
        const original = history[type];
        return function () {
            const result = original.apply(this, arguments);
            const event = new CustomEvent(type.toLowerCase(), { detail: { arguments } });
            window.dispatchEvent(event);
            return result;
        };
    };

    history.pushState = changeState('pushState');
    history.replaceState = changeState('replaceState');
}
interceptHistory();

window.addEventListener('pushstate', () => {
    onPageChange();
});

window.addEventListener('replacestate', () => {
    onPageChange();
});



function Parse(url, method, data = null) {
    const options = {
        method: method
    };

    if (data !== null && method.toUpperCase() === "POST") {
        options.headers = {
            "Content-Type": "application/json"
        };
        options.body = JSON.stringify(data);
    }

    return fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            return res.json();
        });
}

function toNormalDate(dateString) {
  const [yyyy, mm, dd] = dateString.split('-'); // Разбиваем строку на части
  return `${dd}-${mm}-${yyyy}`; // Собираем в новом порядке
}

function toNormalDateS(dateString) {
	const date = new Date(dateString);

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}