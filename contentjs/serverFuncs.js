let CityID = null;
baseURL = "https:\\\\journalui.ru";
if (typeof DebugServer !== 'undefined' && DebugServer) {baseURL = "http:\\\\127.0.0.1:4890"}
let AvatarsData = {};




const fetchJournal = async function(URL, method, object,  overrideStringify) {
    if (object === undefined) {
        object = null;
    }
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (object !== null && overrideStringify !== true) {
            options.body = JSON.stringify(object);
        } else if (object !== null && overrideStringify === true){
			options.body = object
		}

        let response = null;
		try{
			response = await fetch(URL, options)
		} catch(e){
			reject(response)
		}
        if (!response.ok) {
            throw response;
        }

        let data = {};
		try{
			data.returnCode = await response.status
			data = await response.json();
		} catch (e) {}
        return data;
    } catch (error) {
		error.status = error.status || 0;
        throw (error);
    }
}

const fetchData = async (URL, method, object) => {
		const controller = new AbortController(); // Создаем AbortController
		const signal = controller.signal;

		// Запускаем тайм-аут на прерывание запроса (например, 5 минут)
		const timeout = setTimeout(() => controller.abort(), 300000); 



        if (object == undefined) { object = null; }

        try {
            let data = null;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                signal
            };

            if (object !== null) {
                options.body = JSON.stringify(object);
            }

            const response = await fetch(baseURL + URL, options);
            
            clearTimeout(timeout);

            if (!response.ok) {
                const error = new Error(`HTTP error! status: ${response.status}`);
                error.status = response.status;
                throw error;
            }

            data = await response.json();
            data.returnCode = response.status;
            return data;
        } catch (error) {
            clearTimeout(timeout); // Убираем тайм-аут при ошибке
            error.status = error.status || 0;
            throw error;
        }
};

 



function RefreshCityId() {
	document.dispatchEvent(new CustomEvent("CityIDRequest"));
}

function requestCityID() {
    chrome.runtime.sendMessage({ type: "getCityID" }, (response) => {
        const cityID = response?.cityID || null;

        document.dispatchEvent(new CustomEvent("CityIDResponse", {
            detail: { cityID }
        }));
    });
}

function isVideoFile(str) {
    return /\.(mp4|mov)$/i.test(str);
}

document.addEventListener("CityIDRequest", requestCityID);
document.addEventListener("CityIDResponse", (event) => {
	CityID = event.detail.cityID;
});
window.navigation.addEventListener("navigate", (event) => {
    RefreshCityId();
	ReplaceAnyAvatars();
	setTimeout(DynamicThings, 100);
})
RefreshCityId();



function ReplaceAnyAvatars() {
	for (let i = 0; i < Object.keys(AvatarsData).length; i++) {
		let KeyName = Object.keys(AvatarsData)[i];
		let RightAvatar = AvatarsData[KeyName];

		if (document.querySelector("span.reviews-container") === null) { 
			if (!isVideoFile(RightAvatar)) {
				document.querySelectorAll(`:not(.reviews-modal-comments .reviews-container) img[src="${KeyName}"]`).forEach(wrongAvatar => {
					wrongAvatar.style.display = '';
					if (wrongAvatar.src !== RightAvatar) {
						wrongAvatar.src = RightAvatar;
					}
				})
				document.querySelectorAll(`:not(.reviews-modal-comments .reviews-container) i.user-photo.user-photo__presents[style="background-image: url('${KeyName}')"]`).forEach(wrongAvatar => {
					wrongAvatar.style.display='';
					if (wrongAvatar.style !== `background-image: url('${RightAvatar}')`) {
						wrongAvatar.style = `background-image: url('${RightAvatar}')`;
					}
				})
			} else {
				
				let VideoAvatar = document.createElement('video');
				VideoAvatar.className = 'customAvatar';
				VideoAvatar.muted = true;
				VideoAvatar.autoplay = true;
				VideoAvatar.loop = true;
				VideoAvatar.src = RightAvatar;

				document.querySelectorAll(`img[src="${KeyName}"]`).forEach(wrongAvatar => {
					if (wrongAvatar.nextElementSibling && wrongAvatar.nextElementSibling.classList.contains('customAvatar')) {return}
					wrongAvatar.style.display='none';
					wrongAvatar.after(VideoAvatar);
				})
				document.querySelectorAll(`i.user-photo.user-photo__presents[style="background-image: url('${KeyName}')"]`).forEach(wrongAvatar => {
					if (wrongAvatar.nextElementSibling && wrongAvatar.nextElementSibling.classList.contains('customAvatar')) {return}
					wrongAvatar.style.display='none';
					wrongAvatar.after(VideoAvatar);
				})
			}
		}
	}
	//
}
setInterval(ReplaceAnyAvatars, 1200);
document.ReplaceAnyAvatars = ReplaceAnyAvatars;

function LoadCustomAvatars(){
		AvatarsData = {};
		fetchJournal('https://omni.top-academy.ru/students/get-students', 'POST', {group: null}).then(res => {
			let ProcessedList = [];
			for (let i=0; i < res.length; i++) {
				let Student = res[i];
				ProcessedList.push(`${CityID}_${Student.id_stud}_${Student.fio_stud.replaceAll(" ","")}`)
			}
			fetchData('/teacherTools/get-student-list', 'POST', {studentList: ProcessedList}).then(uires => {
				let result = uires.value;
				for (let i = 0; i < result.length; i++) {
					let UIStudent = result[i];
					let StudentData = res[i];
					if (UIStudent.photo !== null) {
						AvatarsData[StudentData.photo_pas] = baseURL+'/Data/JournalData/'+ProcessedList[i]+'/'+UIStudent.photo;
					}
				}
			})
		})
}

LoadCustomAvatars();
 

function DynamicThings() {
	let url = window.location.href;
	if (url.indexOf("/login/index") >= 0) { // List of students
		filesDatabase.clear()
	}
}
DynamicThings()



//Iternal chars:
//document.querySelector("body > main > toolbar > div:nth-child(3) > span.teaching-notifications.ng-hide").click()

function CheckForConnection() {
	function BuildAMessageForShed(listOfCities) {
		if (listOfCities.length === 0) {
			alert("Пустые данные списка ID Городов :(");
			return;
		}
		
		let MessageToBot = `{"useOmni": true, "cities": ${JSON.stringify(listOfCities)}}`;
		console.log("MessageToBot:", MessageToBot);
		
		let Info = document.createElement("div")
		Info.id="ShedBotDescription"
		Info.style = `
			position: absolute; font-size: larger; font-family: system-ui; font-weight: 550; padding: 10px; border: solid 1px #63d3bd;
			z-index: 90;
			top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 20px;
		`
		Info.innerHTML = `
			<h2 style="font-size: xx-large; font-weight: bold"> Начните использовать бота! </h2>
			<span> Теперь вы можете привязать многофункционального <a href="https://t.me/JournalSheduleBot" target="_blank"> бота</a>.</span>
			<br><br>
			<span> После нажатия кнопки <b>Старт</b> (или написали /start) отправьте боту это: </span><br>
			<span style="background: black; display: block; width: 100%; padding: 0px 8px 5px; border-radius: 10px; font-weight: 650; color: #e5b356"> /ImTeacher ${MessageToBot} </span>
			<button onclick="this.parentElement.remove(); document.querySelector('body.main md-backdrop.md-menu-backdrop').remove();"> Закрыть </button>
		`
		document.body.after(Info)
	}
	
	if (window.location.href.indexOf("/#/profile") !== -1)
    if (!document.getElementById("ExtractCitiesFor") && document.querySelector('.internal-wrap-global:not(.not-internal-wrap)')) {
        let ext = document.createElement("button");
		ext.id="ExtractCitiesFor";
		ext.textContent = 'Подключиться к боту с расписанием';
		ext.addEventListener("click", function(){
			let citiesButton = document.querySelector(".changeUser button");
			let Modal = null;
			let Cities=[];
			if (citiesButton) {
				citiesButton.click();
				setTimeout(function(){
					Modal = document.querySelector("md-menu-content#cityes");
					if (!Modal) {alert("Не удаётся получить список нужных данных :("); return}
					Modal.querySelectorAll("md-menu-item button").forEach(btn => {
						Cities.push(btn.getAttribute("ng-click").replaceAll("changeCity","").replaceAll("(","").replaceAll(")",""))
					});
					
					
					BuildAMessageForShed(Cities);
					Modal.parentElement.remove()
				}, 1000)
			} else {
				if (CityID !== null) {
					Cities = [CityID];
					BuildAMessageForShed(Cities)
				} else {
					alert("Не удалось определить данные. Cookie и querySelector дали пустые данные")
				}
			}
		})
		document.querySelector('.internal-wrap-global:not(.not-internal-wrap)').prepend(ext)
    }
}