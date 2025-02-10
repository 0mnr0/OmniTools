let CityID = null;
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
    console.log("Полученный CityID:", event.detail.cityID);
	CityID = event.detail.cityID;
});
window.navigation.addEventListener("navigate", (event) => {
    RefreshCityId();
	ReplaceAnyAvatars();
	//setTimeout(DynamicThings, 100);
})
RefreshCityId();



function ReplaceAnyAvatars() {
	for (let i = 0; i < Object.keys(AvatarsData).length; i++) {
		let KeyName = Object.keys(AvatarsData)[i];
		let RightAvatar = AvatarsData[KeyName];
		let VideoAvatar = document.createElement('video');
		VideoAvatar.className = 'customAvatar';
		VideoAvatar.muted = true;
		VideoAvatar.autoplay = true;
		VideoAvatar.loop = true;
		VideoAvatar.src = RightAvatar;
		
		
		if (!isVideoFile(RightAvatar)) {
			document.querySelectorAll(`img[src="${KeyName}"]`).forEach(wrongAvatar => {
				wrongAvatar.style.display = '';
				wrongAvatar.src = RightAvatar;
			})
			console.log(`i.user-photo.user-photo__presents[style="background-image: url('${KeyName}')"]`);
			document.querySelectorAll(`i.user-photo.user-photo__presents[style="background-image: url('${KeyName}')"]`).forEach(wrongAvatar => {
				wrongAvatar.style.display='';
				wrongAvatar.style = `background-image: url('${RightAvatar}')`;
			})
		} else {
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
	//
}
setInterval(ReplaceAnyAvatars, 1000)

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
	console.log(url.indexOf("/students/list"), '>= 0: ', url.indexOf("/students/list") >= 0, CityID ,'!== null:',CityID !== null )
	if (url.indexOf("/students/list") >= 0 && CityID !== null && document.querySelectorAll('.students .cards .cart-header > div').length > 0) { // List of students
		return
	} else {setTimeout(DynamicThings, 1000);}
}

