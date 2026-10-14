const Listeners = {
	Homework: Homework_DOMChange
}


function onDomChange() {
	let loc = location.href;
	
	
	InjectSettingsButton();
	if (loc.endsWith("/homeWork")) {
		Listeners.Homework();
	}
	
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