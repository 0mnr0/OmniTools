const sleep = ms => new Promise(res => setTimeout(res, ms));
(async () => {
	let SettingsClickLine = null;
	let leftMenuItems = document.querySelectorAll("body.main main.content md-sidenav md-content ul.main-menu li");
	while (leftMenuItems.length === 0) {
		await sleep(100);
	}
	let spawnPosition = leftMenuItems[leftMenuItems.length-1]
	SettingsClickLine = document.createElement('div');
	SettingsClickLine.innerHTML = `
		<li class="bold">
            <a class="waves-effect waves-light icon-content-author">
                <span class="side-text ng-binding ng-scope"  style="">Настройки расширения</span>
            </a>
        </li>
	`; 
	spawnPosition.after(SettingsClickLine);
	
	 




















})();