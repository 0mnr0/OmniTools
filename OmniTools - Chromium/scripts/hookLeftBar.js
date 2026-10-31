
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
	inMenuButton.onclick = () => {
		let overlay = document.createElement('div')
		overlay.style=`
			width: 100%;
			height: 100%;
			top: 0px;
			transition: all .2s;
			position: fixed;
			left: 0px;
			z-index: 99999999999999;
		`
		document.body.after(overlay);
		setTimeout(() => {overlay.style.background = "#11111190"}, 10)
		setTimeout(() => {overlay.style.background = ""}, 1500)
		setTimeout(() => {overlay.remove()}, 1800)
		
		BrowserContext.runtime.sendMessage({ type: 'OPEN_POPUP' });
	}
	
	placement.appendChild(inMenuButton);
}

