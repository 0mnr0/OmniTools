let manifest = {}


function VersionExtractor(response) {
	let CurrentManifest = response.status
	document.getElementById('version').textContent = CurrentManifest.version
	manifest = CurrentManifest
	
	
	let ExtensionImage = document.createElement('img')
	ExtensionImage.id = "CurrentUIImage"
	ExtensionImage.src = "chrome-extension://" + chrome.runtime.id + GetIconName()
	document.getElementById("ExtensionImageDiv").appendChild(ExtensionImage)
	document.getElementById("changesCurrentVersion").textContent = 'OmniTools '+CurrentManifest.version
	
	ExtensionImage.onload  = function () {ExtensionImage.classList.add('LoadedImage')}
	
	if (document.querySelector('img.backgroundImage')) {
		document.querySelector('img.backgroundImage').src = "chrome-extension://" + chrome.runtime.id + GetIconName()
	}
	
	
}


function requestVersion(){
	chrome.runtime.sendMessage({ type: 'VersionBumper' }, (response) => {
		  VersionExtractor(response);
	});
}


function GetIconName(){
    return "/OmniTools.png"
}


window.onload = function() {
	requestVersion()
	
	
	let changelogVisible = false;
	document.querySelector('div#LastChanges span').innerHTML = Changes;
	document.querySelector('button.whatHasChanged').addEventListener('click', function(){
		if (!changelogVisible){
			document.body.style='height: '+height;
			document.querySelector('div#LastChanges').style.opacity=1
			document.querySelector('button.whatHasChanged').textContent = 'Изменения ▲'
		} else {
			document.body.style=''
			document.querySelector('div#LastChanges').style.opacity=0
			document.querySelector('button.whatHasChanged').textContent = 'Изменения ▼'
		};
		
		
		
		changelogVisible = !changelogVisible
	})
}

const height = "400px";

const Changes = `
<h2 id="changesCurrentVersion"><b> Omni Tools </b></h2>
<span style="font-size: 10px; margin-top: 0px"> 1.4 -> 1.5 </span>
<br><br><br>

<span class="New">
<b> Новое: </b><br>
+ Запоминание и кастомизация промптов <br>
</span><br>

<span class="Changed">
<b> Изменено / исправлено: </b><br>
~ Исправлено отображение кастомных аватарок в нек-ых случаях<br>
</span><br>


<span class="Removed None">
<b> Удалено: </b><br>
- <span>  </span><br>
</span>


`
