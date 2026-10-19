// AvatarsData: { "<оригинальный URL аватарки>": { photo: "<новый URL>", birthday: "<строка|null>" } }
let AvatarsData = {};
let currentDateForBirths = "";
let avatarsLoadToken = 0; // защита от устаревших ответов (смена аккаунта/города)

function onAccountReset() {
	avatarsLoadToken++;
	AvatarsData = {};
	lastCityId = null;
}

function LoadCustomAvatars() {
	const token = ++avatarsLoadToken;

	if (lastCityId === null) {
		AvatarsData = {};
		return;
	}

	fetcher('https://omni.top-academy.ru/students/get-students', 'POST', { group: null }).then(res => {
		if (token !== avatarsLoadToken || !res || !res.data) return;

		const keyToOriginal = {};
		const studentList = [];

		for (const student of res.data) {
			const key = `${lastCityId}_${student.id_stud}_${student.fio_stud.replaceAll(" ", "")}`;
			keyToOriginal[key] = student.photo_pas;
			studentList.push(key);
		}

		fetcher(ServerURL + '/teacherTools/v2/get-student-list', 'POST', { studentList }).then(uires => {
			if (token !== avatarsLoadToken || !uires || !uires.ok || !uires.data) return;

			const result = {};
			for (const [key, userData] of Object.entries(uires.data)) {
				const original = keyToOriginal[key];
				if (!original || !userData || !userData.photo) continue;

				result[original] = {
					photo: `${ServerURL}/Data/JournalData/${key}/${userData.photo}`,
					birthday: typeof userData.birthday === 'string' ? userData.birthday : null
				};
			}
			AvatarsData = result;
		});
	});
}

function getFormattedDate() {
	const date = new Date();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы с 0 по 11
	const day = String(date.getDate()).padStart(2, "0");
	return `-${month}-${day}`;
}
currentDateForBirths = getFormattedDate();

function isVideoFile(str) {
	return /\.(mp4|mov)$/i.test(str);
}

function CreateBirthDayBadge(element, isBirthday) {
	log(element.parentElement, element.parentElement.find(':scope > img.birthdayBadge') === null)
	if (isBirthday && element.parentElement && element.parentElement.find(':scope > img.birthdayBadge') === null) {
		let birthdayBadge = document.createElement('img');
		birthdayBadge.className = 'birthdayBadge';
		birthdayBadge.title = 'По нашим данным у ученика сегодня день рождения';
		birthdayBadge.src = getIcon('/icons/birthday.png');
		element.parentElement.appendChild(birthdayBadge);
		console.log(birthdayBadge)
	}
}

function escapeAttr(value) {
	return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function CreateVideoAvatar(src) {
	const video = document.createElement('video');
	video.className = 'customAvatar';
	video.muted = true;
	video.autoplay = true;
	video.loop = true;
	video.src = src;
	return video;
}

function ReplaceAnyAvatars() {
	const entries = Object.entries(AvatarsData);
	if (entries.length === 0) return;
	if (document.querySelector("span.reviews-container") !== null) return;

	for (const [originalAvatar, customUser] of entries) {
		const isBirthday = !!customUser.birthday && customUser.birthday.includes(currentDateForBirths);
		const newAvatar = customUser.photo.replaceAll("\\", "/");
		const original = escapeAttr(originalAvatar);

		const imgSelector = `:not(.reviews-modal-comments .reviews-container) img[src="${original}"]`;
		const bgSelector = `:not(.reviews-modal-comments .reviews-container) i.user-photo.user-photo__presents[style="background-image: url('${original}')"]`;

		if (!isVideoFile(newAvatar)) {
			document.querySelectorAll(imgSelector).forEach(el => {
				el.style.display = '';
				CreateBirthDayBadge(el, isBirthday);
				el.src = newAvatar; // после этого элемент перестанет подходить под селектор
			});
			document.querySelectorAll(bgSelector).forEach(el => {
				el.style.display = '';
				CreateBirthDayBadge(el, isBirthday);
				el.style.backgroundImage = `url('${newAvatar}')`;
			});
		} else {
			const replaceWithVideo = el => {
				if (el.nextElementSibling && el.nextElementSibling.classList.contains('customAvatar')) return;
				const video = CreateVideoAvatar(newAvatar); // отдельный <video> на каждый элемент
				el.style.display = 'none';
				el.after(video);
				console.log(isBirthday);
				CreateBirthDayBadge(video, isBirthday);
			};
			document.querySelectorAll(`img[src="${original}"]`).forEach(replaceWithVideo);
			document.querySelectorAll(`i.user-photo.user-photo__presents[style="background-image: url('${original}')"]`).forEach(replaceWithVideo);
		}
	}
}
setInterval(ReplaceAnyAvatars, 1200);

setInterval(() => {
	currentDateForBirths = getFormattedDate();
}, 60 * 1000);