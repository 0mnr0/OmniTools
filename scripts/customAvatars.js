
let AvatarsData = {};
function LoadCustomAvatars(){
		AvatarsData = {};
		fetcher('https://omni.top-academy.ru/students/get-students', 'POST', {group: null}).then(res => {
			let ProcessedList = [];
			for (let i=0; i < res.length; i++) {
				let Student = res[i];
				ProcessedList.push(`${CityID}_${Student.id_stud}_${Student.fio_stud.replaceAll(" ","")}`)
			}
			fetcher(ServerURL+'/teacherTools/v2/get-student-list', 'POST', {studentList: ProcessedList}).then(uires => {
				let result = uires.value;
				for (let i = 0; i < result.length; i++) {
					let UIStudent = result[i];
					let StudentData = res[i];
					if (UIStudent.photo !== null) {
						let isBirthday = false;
						if (typeof UIStudent.birthday === 'string' && UIStudent.birthday.indexOf(currentDate) >= 0) {
							isBirthday = true;
						}
						AvatarsData[StudentData.photo_pas] = baseURL+'/Data/JournalData/'+ProcessedList[i]+'/'+UIStudent.photo + ( isBirthday ? "?isBirthday=true" : "" );
					}
				}
			})
		})
}

LoadCustomAvatars();


function ReplaceAnyAvatars() {
	function CreateBirthDayBadge(element, isBirthDay) {
		if (isBirthDay && element.parentElement && element.parentElement.querySelector('img.birthdayBadge') === null) {
			let birthdayBadge = document.createElement('img');
			birthdayBadge.className = 'birthdayBadge';
			birthdayBadge.title='По нашим данным у ученика сегодня день рождения';
			birthdayBadge.src = 'https://github.com/0mnr0/WallpaperInJournal/blob/main/UIData/badges_images/birthday.png?raw=true';
			element.parentElement.appendChild(birthdayBadge);
		}
	}
	
	
	for (let i = 0; i < Object.keys(AvatarsData).length; i++) {
		let KeyName = Object.keys(AvatarsData)[i];
		let RightAvatar = AvatarsData[KeyName];
		const isBirthDay = RightAvatar.indexOf('?isBirthday=true') > 0;
		if (isBirthDay) { RightAvatar = RightAvatar.replaceAll('?isBirthday=true', '') }

		if (document.querySelector("span.reviews-container") === null) { 
			if (!isVideoFile(RightAvatar)) {
				document.querySelectorAll(`:not(.reviews-modal-comments .reviews-container) img[src="${KeyName}"]`).forEach(wrongAvatar => {
					wrongAvatar.style.display = '';
					CreateBirthDayBadge(wrongAvatar, isBirthDay);
					if (wrongAvatar.src !== RightAvatar) {
						wrongAvatar.src = RightAvatar;
					}
				})
				document.querySelectorAll(`:not(.reviews-modal-comments .reviews-container) i.user-photo.user-photo__presents[style="background-image: url('${KeyName}')"]`).forEach(wrongAvatar => {
					wrongAvatar.style.display='';
					CreateBirthDayBadge(wrongAvatar, isBirthDay);
					if (wrongAvatar.style !== `background-image: url('${RightAvatar.replaceAll("\\", "/")}')`) {
						wrongAvatar.style = `background-image: url('${RightAvatar.replaceAll("\\", "/")}')`;
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
				CreateBirthDayBadge(VideoAvatar, isBirthDay);
			}
		}
	}
	//
}
setInterval(ReplaceAnyAvatars, 1200);
setInterval(() => {
	currentDate = getFormattedDate();
}, 20000)
document.ReplaceAnyAvatars = ReplaceAnyAvatars;