function iAmLateFeature() {
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


let timeMissBlocks = [];
let lastTimeMissPos = null;
let lastSelectedGroup = null;
let missPresentsLoaded = false;
let lastParsedPresents = null;
let isTimeMissLoaded = false;
function RunPresentsCode() {
	if (lastCityId === null) return; // Not Loaded Yet
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
		fetcher('https://omni.top-academy.ru/presents/get-presents', 'POST',
			{
				date: today,
				lenta: currentPos
			}
		).then(res => {
			if (!res.ok) {return}
			const payload = res.data;
			missPresentsLoaded = true;
			let groupId = payload.cur_group;
			lastSelectedGroup = groupId;
			lastParsedPresents = payload;
			LoadMissedTable(Number(groupId), payload);
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
	fetcher(ServerURL+`/api/late/get`, 'POST', {
		cityId: lastCityId, // cityId
		groupId: groupId   // groupId
	}).then(res => {
		if (!res.ok) return;
		const payload = res.data;
		
		let studentDisplayedList = findAll(".table-wrapper.wrapper-students tbody tr.presents_stud")
		
		for (let i = 0; i < studentDisplayedList.length; i++) {
			let parsedStudent = presentsRes.students[i];
			let displayedStudent = studentDisplayedList[i];
			
			let displayedStudentName = displayedStudent.querySelector('td.name p');
			if (displayedStudentName === undefined) return; // Empty lesson
			if (parsedStudent.fio_stud === displayedStudentName.textContent) {
				let IamLate = GetInfoForStud(payload, Number(parsedStudent.id_stud), Number(groupId))
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
	if (StudInfo.late === "?") StudInfo.late = "unk"; // client-side patch
	lateMark.className = "timeMiss miss"+StudInfo.late
	
	let vals = {
		"15": [
			"Приду в течении 15 минут",
			"Буду через 15 минут"
		],
		"30": [
			"Опаздываю. Буду примерно через полчаса",
			"Опаздываю. Буду в течении 30 минут"
		],
		"unk": [
			"Постараюсь придти как можно быстрее"
		],
	}
	let txtVariants = vals[StudInfo.late]
	if (txtVariants === undefined) {
		txtVariants = [`Приду в течении ${StudInfo.late} мин.`];
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