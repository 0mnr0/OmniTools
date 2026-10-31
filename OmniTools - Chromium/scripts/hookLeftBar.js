
let inMenuButton = null;
function InjectSettingsButton() {
	if (inMenuButton) {return}
	createInMenuButton();
}


function createInMenuButton() {
	let placement = find('body.main main.content md-sidenav')
	if (placement === null) {return}
	
	inMenuButton = document.createElement('div');
	inMenuButton.classList = "inMenuButton Injected";
	inMenuButton.innerHTML = `
		<img src="${getIcon("/icons/settings.svg")}">
		<span> Настройки расширения </span>
	`
	inMenuButton.onclick = async () => {
		try {
			const response = await BrowserContext.runtime.sendMessage({ type: 'OPEN_SETTINGS_TAB' });
			if (!response?.ok) {
				throw new Error(response?.error || "Не удалось открыть настройки расширения");
			}
		} catch (error) {
			console.error(error);
			Toast.create("Не удалось открыть настройки расширения", 2500, {});
		}
	}
	
	placement.appendChild(inMenuButton);
}

