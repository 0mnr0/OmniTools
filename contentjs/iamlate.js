function onDomChange() {
	let loc = location.hash.replace('#', '');
	
	if (loc.startsWith("/presents")) {
		RunPresentsCode();
	} else {
		lastSelectedGroup = null;
		lastTimeMissPos = null;
		isTimeMissLoaded = false;
		missPresentsLoaded = false;
		lastParsedPresents = null;
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


let timeMissBlocks = [];
let lastTimeMissPos = null;
let lastSelectedGroup = null;
let missPresentsLoaded = false;
let lastParsedPresents = null;
let isTimeMissLoaded = false;
function RunPresentsCode() {
	if (cityId === null) return; // Not Loaded Yet
	let groupName = document.querySelector('.presents .group span.groupName.ng-binding');
	let tabList = document.querySelectorAll('.presents .pars li');
	let activeTab = document.querySelector('.presents .pars li.active');
	let today = new Date().toLocaleDateString('en-CA')

	if (activeTab === null || groupName === null) return; // Not Loaded Yet.
	
	let currentPos = -1;
	for (let tab of tabList) {
		if (tab === activeTab) {break}
		currentPos += 1;
	}
	currentPos += 1;
	if (currentPos === -1) return; // Not Loaded Yet.
	if (currentPos !== lastTimeMissPos) {
		lastTimeMissPos = currentPos;
		missPresentsLoaded = false;
		isTimeMissLoaded = false;
		lastSelectedGroup = null;
		lastParsedPresents = null;
	} else {
		return
	}
	
	
	if (!missPresentsLoaded || lastSelectedGroup === null || lastParsedPresents === null) {
		fetchJournal('https://omni.top-academy.ru/presents/get-presents', 'POST',
			{
				date: today,
				lenta: currentPos
			}
		).then(res => {
			missPresentsLoaded = true;
			let groupId = res.cur_group;
			lastSelectedGroup = groupId;
			lastParsedPresents = res;
			LoadMissedTable(Number(groupId), res);
		})
		.catch((error) => {
			missPresentsLoaded = false;
			console.error("An error occurred:", error.message);
		});
	} else {
		if (lastSelectedGroup === null || lastParsedPresents === null) {
			return
		}
		LoadMissedTable(lastSelectedGroup, lastParsedPresents);
	}
}

function LoadMissedTable(groupId, presentsRes) {
	fetchData(`/api/late/get`, 'POST', {
		cityId: cityId, // cityId
		groupId: groupId   // groupId
	}).then(res => {
		if (!res.success) return;
		
		let studentDisplayedList = document.querySelectorAll(".table-wrapper.wrapper-students tbody tr.presents_stud")
		
		for (let i = 0; i < studentDisplayedList.length; i++) {
			let parsedStudent = presentsRes.students[i];
			let displayedStudent = studentDisplayedList[i];
			
			let displayedStudentName = displayedStudent.querySelector('td.name p');
			if (displayedStudentName === undefined) return; // Empty lesson
			if (parsedStudent.fio_stud === displayedStudentName.textContent) {
				let IamLate = GetInfoForStud(res, Number(parsedStudent.id_stud), Number(groupId))
				if (IamLate === null) {continue}
				
				let lateMark = GenerateLateMark(IamLate);
				displayedStudentName.after(lateMark);
				displayedStudentName.classList.add("timeMissUp");
				displayedStudentName.parentElement.parentElement.classList.add("timeMissBlock");
			}
		}
		isTimeMissLoaded = true;
	})
}

function GenerateLateMark(StudInfo) {
	let lateMark = document.createElement('span');
	lateMark.className = "timeMiss miss"+StudInfo.late
	
	let vals = {
		"15": [
			"Постараюсь явиться через 15 минут",
			"Приду в течении 15 минут",
			"Буду скоро. Дайте пожалуйста 15 минут",
			"Уже на подходе, приду менее чем через 15 минут",
			"Лечу, буду через 15 минут",
			"Спешу изо всех сил, подождите пожалуйста минут 15"
		],
		"30": [
			"Задерживаюсь. Буду примерно через полчаса",
			"Задерживаюсь приблизительно на полчаса",
			"Задерживаюсь. Постараюсь явиться в течении 30 минут",
			"Задерживаюсь. Прилечу в течении 30 минут",
			"Задержался, буду через полчаса"
		],
		"unk": [
			"Опоздаю. Приду, но не могу точно сказать когда",
			"Опоздаю. Приду, но не скажу как быстро",
			"Опоздаю, но приду (но не как быстро)",
			"Опоздаю. Постараюсь явиться в течении пары"
		],
	}
	let txtVariants = vals[StudInfo.late]
	if (txtVariants === undefined) {
		txtVariants = [`Постараюсь явиться в течении ${StudInfo.late} мин.`];
		lateMark.classList.add("colorUnknown");
	}
	let randomText = txtVariants[Math.floor(Math.random() * txtVariants.length)];
	
	lateMark.textContent = randomText;
	lateMark.title = `Информация от ученика получена в: ${StudInfo.userTime}. Отображено с помощью Omni Tools`;
	return lateMark;
}

function GetInfoForStud(ApiLateRes, stud_id, group_id) {
	
	for (let stud of ApiLateRes.values) {
		if (stud.studentId === stud_id && stud.groupId === group_id)
			{ return stud }
	}
	
	return null;
}
