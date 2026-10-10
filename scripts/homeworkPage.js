let HomeworkDialog = null;
let Marks = [];
let PreviewFrames = [];

let lastData = {
	InjectedPanel: null,
	Win: null,
	M3: null
}

let PAGE_SIZE = 30;
let HWEntries = [];
let HWFilter = { group: "", name: "" };
let ActiveReview = {
	
}

function MatchesFilter(hw) {
	if (HWFilter.group && hw.group !== HWFilter.group) return false;
	if (HWFilter.name &&
		!String(hw.fio_stud).toLowerCase().includes(HWFilter.name.toLowerCase())) return false;
	return true;
}

function Homework_DOMChange() {
	let newDialog = find('.md-dialog-container.ng-scope > div.home_work_modal');
	if (newDialog === null) { // Здесь будет уничтожено кастомное окно
		HomeworkDialog = null;
		PreviewFrames = [];
		
		if (typeof lastData.Win === "object" && lastData.Win !== null) {
			lastData.Win.destroy();
			lastData.Win = undefined;
		}
		
		HWEntries = [];
		HWFilter = { group: "", name: "" };
		lastData = {}
		ActiveReview = {};
		return
	}
	if (HomeworkDialog != null) return
	
	PreviewFrames = [];
	HomeworkDialog = newDialog;
	InjectIntoHomeworkDialog();
}


function InjectIntoHomeworkDialog() {
	let topPanel = HomeworkDialog.find('md-dialog.hw-md');
	lastData.InjectedPanel = HomeworkDialog;
	 
	let transitionToNewHomework = document.createElement('button');
	transitionToNewHomework.className = 'homeworkModal customBtn mini';
	transitionToNewHomework.textContent = 'В новый раздел';
	topPanel.prepend(transitionToNewHomework);
	
	transitionToNewHomework.onclick = () => {
		HomeworkDialog.style='display: none';
		OpenCustomHomeworkWindow();
	}
}


function OpenCustomHomeworkWindow() {
	let Win = document.createElement('div');
	Win.className = "CustomHWDiv absoluteCenter";
	let code = `
		<div class="topPanel">
			<div class="topLine">
				<h4 class="ng-binding">Задания на проверку</h4>
				<div class="previewProgress">
					<span id="taskPreview"></span>
					<span id="hwPreview" class="diagMask"></span>
				</div>
				<select id="reviewTypes" disabled style="display: none"> Секунду... </select>
				
				<div class="backGuestures">
					<span id="back"> Вернуться </span>			
					<img id="fullscreen" src="${getIcon('/icons/fullscreen.svg')}">
					<img id="close" src="${getIcon('/icons/cancel.svg')}">
				</div>
			</div>
			
			<div class="topLine filters">
				<select id="groupSelector">
					<option value="" selected>Все группы</option>
				</select>
				
				<input id="searchName" placeholder="ФИО Ученика"></input>
			</div>
			
		</div>
		<div class="content"></div>
		<m3loader></m3loader>
	`;
	
	Win.innerHTML = code
	document.body.appendChild(Win);
	lastData.Win = Win;
	
	let closeBtn = Win.find('div.topPanel div img#close')
	closeBtn.onclick = () => {
		Win.destroy();
		lastData = {};
	}
	
	let fullscreenBtn = Win.find('div.topPanel div img#fullscreen')
	fullscreenBtn.onclick = () => {
		if (Win.classList.contains("fullscreen")) {
			Win.classList.remove("fullscreen");
			document.head.parentElement.classList.remove("no-scrollbar");
			fullscreenBtn.src = getIcon("/icons/fullscreen.svg");
		} else {
			Win.classList.add("fullscreen");
			document.head.parentElement.classList.add("no-scrollbar");
			fullscreenBtn.src = getIcon("/icons/fullscreen_close.svg");
		}
	}
	
	let backBtn = Win.find('div.topPanel div span#back')
	backBtn.onclick = () => {
		console.log("lastData.InjectedPanel:", lastData.InjectedPanel);
		lastData.InjectedPanel.style.display='';
		Win.destroy();
		lastData.Win = null
	}
	
	let reviewTypes = Win.find('div.topPanel select#reviewTypes');
	reviewTypes.onchange = () => {
		SwitchReviewType(reviewTypes.value, groupList, studentNameFilter);
	}
	
	let groupList = Win.find('div.topLine.filters select#groupSelector');
	let studentNameFilter = Win.find('div.topLine.filters input#searchName');
	
	let nameDebounce = null;
	groupList.onchange = () => {
		HWFilter.group = groupList.value;
		RefreshHomeworkView();
	};
	studentNameFilter.oninput = () => {
		clearTimeout(nameDebounce);
		nameDebounce = setTimeout(() => {
			HWFilter.name = studentNameFilter.value;
			RefreshHomeworkView();
		}, 250);
	};
	
	let m3 = new MaterialLoader(Win.find('m3loader'), {doSetSize: false, fill: "#22aa90"});
	lastData.M3 = m3;
	
	
	
	Marks = [];
	HWEntries = [];
	HWFilter = { group: "", name: "" };
	Parse("https://omni.top-academy.ru/auth/get-marks-selects", "POST", null).then(markRes => {
		Marks = markRes;
		Parse("https://omni.top-academy.ru/homework/get-new-homeworks", "POST", null).then(res => {
			if (ReviewIsEmpty(res)) {
				NothingToCheck(Win);
				return
			}
			ActiveReview.data = res;
			LoadReviewTypes(res, reviewTypes);
			ActiveReview.type = GetStartReviewType(res);
			
			LoadFilterGroups(res, groupList);
			LoadHomeworkList(res[ActiveReview.type]);
		})
	})
}

function NothingToCheck(Win) {
	Win.find("div.content").innerHTML = `
		<span class="nothingToShow"> Работ нет, нечего показывать </span>
	`
}

function ReviewIsEmpty(res) {
	function IsEmptyList(list) {
		return list === null || list === undefined || list.length === 0;
	}

	return IsEmptyList(res.homework)
        && IsEmptyList(res.lab_work)
        && IsEmptyList(res.requests);
}

function GetStartReviewType(res) {
	if (res.homework !== null && res.homework !== undefined && res.homework.length > 0) {
		return "homework";
	}
	if (res.lab_work !== null && res.lab_work !== undefined && res.lab_work.length > 0) {
		return "lab_work";
	}
	if (res.requests !== null && res.requests !== undefined && res.requests.length > 0) {
		return "requests";
	}
	return null;
}

function SwitchReviewType(type, groupList, nameInput) {
	if (!ActiveReview.data || type === ActiveReview.type) return;
	ActiveReview.type = type;

	HWFilter = { group: "", name: "" };
	nameInput.value = "";

	ClearHomeworkView();
	LoadFilterGroups(ActiveReview.data, groupList);
	LoadHomeworkList(ActiveReview.data[type]);
}

function ClearHomeworkView() {
	PreviewFrames = [];
	HWEntries.forEach(e => e.card?.block.remove());
	HWEntries = [];
}

function LoadReviewTypes(res, reviewSelector) {
	reviewSelector.style.display = "";
	reviewSelector.disabled = false;
	
	let reviews = ``;
	if (res.homework !== null && res.homework !== undefined && res.homework.length > 0) {
		reviews += `
			<option value="homework"> Домашка (${res.homework.length}) </option>
		`
	}
	if (res.lab_work !== null && res.lab_work !== undefined && res.lab_work.length > 0) {
		reviews += `
			<option value="lab_work"> Лабараторные работы (${res.lab_work.length}) </option>
		`
	}
	if (res.requests !== null && res.requests !== undefined && res.requests.length > 0) {
		reviews += `
			<option value="requests"> Пересдача (${res.requests.length}) </option>
		`
	}
	reviewSelector.innerHTML = reviews
}

let groupDisplayFilter = null;
function UpdateGroupFilter(groupValue, nameValue) {
	if (groupDisplayFilter === null) {
		groupDisplayFilter = document.createElement('style');
		groupDisplayFilter.textContent = ``
		document.body.appendChild(groupDisplayFilter);
	}
	
	
	let groupFilter = groupValue !== null && groupValue !== undefined && groupValue.length !== 0;
	let nameFilter = nameValue !== null && nameValue !== undefined && nameValue.length !== 0;
	UpdateNameFilter(nameFilter, nameValue);
	
	let filter = "";
	
	if (groupFilter) {
		filter += `:not([hw_group="${groupValue}"])`
	}
	
	// this additional check bumps priority of CSS rule
	groupDisplayFilter.textContent = `${filter.length === 0 ? "" : "div.CustomHWDiv"} div.content div.hwBlock${filter} {display: none}`; // technically have lower priority
}

function UpdateNameFilter(state, filterName) {
	findAll('div.CustomHWDiv div.content div.hwBlock').forEach(block => {
		let shouldShowUser = block.getAttribute("hw_creds").toLowerCase().includes(filterName.toLowerCase());
		if (filterName.length === 0) {shouldShowUser = true}
		
		if (!state || shouldShowUser) {
			block.style.display = '';
		} else {
			block.style.display = 'none';
		}
	})
}

function GenMarks() {
	var data = {code: ""}
	for (let i = 0; i < Marks.length; i++) {
		data.code += `
			<span mark=${i+1}> ${i+1} </span>
		`
	}
	
	return data;
}

const PreviewContent = `
	<span class="loaderStatus"> <span text></span> <span class="material-icons icon">report_problem</span></span>
	<img id="IMAGEContent" alt="Image content" style="display: none">
	<video id="VIDEOContent" alt="Video content" style="display: none"></video>
	<iframe class="HTMLContent" sandbox="allow-scripts"></iframe>
`

const TrashCan = 'img/home-work/trash.svg';
const CloseIco = '/img/home-work/close.png';


function LoadHomeworkList(list) {
	HWEntries = list.map(hw => ({ hw, card: null }));
	RefreshHomeworkView();
	lastData.M3.setUnreachable(true);
}

function RefreshHomeworkView() {
	if (!lastData.Win) return;
	const contentList = lastData.Win.find('div.content');
	const created = [];
	let shown = 0;


	lastData.M3.setUnreachable(false);
	HWEntries.forEach((entry, i) => {
		const show = shown < PAGE_SIZE && MatchesFilter(entry.hw);
		if (show) shown++;

		if (!entry.card) {
			if (!show) return;
			entry.card = CreateHomeworkCard(entry.hw);

			const next = HWEntries.slice(i + 1).find(e => e.card);
			contentList.insertBefore(entry.card.block, next ? next.card.block : null);
			created.push(entry.card);
		}
		entry.card.block.style.display = show ? '' : 'none';
	});
	lastData.M3.setUnreachable(true);

	if (created.length) RunHomeworkPreview(created, lastData.Win);
}

function LoadNextCards(count) {
	if (!lastData.Win) return;
	let contentList = lastData.Win.find('div.content');

	let batch = PendingHW.splice(0, count);
	if (batch.length === 0) return;

	let PreviewList = batch.map(hw => CreateHomeworkCard(hw, contentList));
	RunHomeworkPreview(PreviewList, lastData.Win);
}

function CreateHomeworkCard(hw, contentList) {
		let ApplyOrDeny = (ActiveReview.type === "requests") && hw.bad_dz === "0";
		
		let marksData = GenMarks();
		let unableToDownload = hw.st_filename === null;
		let block = `
				<json technical style="display: none" title="This block was especially created for another enthusiasts">${JSON.stringify(hw)}</json>
				
				<div class="hwPreview teacherPreview">
					${PreviewContent}
				</div>
				
				<div class="info">
					<span class="fioStud"> ${hw.fio_stud}</span>
					<span class="group"> (${hw.group}) </span>
					<span class="theme"> <b 500>Тема:</b> ${hw.theme} </span>
					
					<div class="HwActions">
						<div>
							<span class="FileTeach b500" ico url="${hw.file_teach}"> Задание преподавателя </span>
							<span class="Given" second> <b 500> Дата выдачи: </b> ${toNormalDateS(hw.teach_date)} </span>
						</div>
						<div ${unableToDownload ? `title="Ученик не проложил файлы"` : ''}>
							<span class="FileStud b500" ico url="${hw.st_filename}" ${unableToDownload ? `disabled` : ""}> Работа студента </span>
							<span second> <b class="500"> Дата загрузки: </b> ${toNormalDateS(hw.stud_date)} </span>
						</div>
						
						<div class="StudentResponse ${unableToDownload ? "visible" : ""}">
							${hw.answer_text}
						</div>
					</div>
					
					<div class="SetMark">
						<h4> Оставить оценку: </h4>
						<div class="list">
							${marksData.code}
						</div>
					</div>
					
					<div class="Comment">
						<h4> Добавить комментарий: </h4>
						
						<textarea id="cmnt"></textarea>
						
						<div class="fileInput">
							<form method="post" enctype="multipart/form-data">
								<label class="input-file">
									<input type="file" id="fileUploader">		
									<span>Выберите файл</span>
								</label>
							</form>
						
							<span class="fileUploaderReset"> Сбросить </span>
						</div>
					</div>
					
					<div class="Tools">
						${
							ApplyOrDeny ? `
								<button class="HWSend homeworkModal customBtn mini deny"> Отклонить </button>
								<button class="HWSend homeworkModal customBtn mini apply"> Принять </button>`
							
							:`<div class="denialDivide noselect">
									<img src="${TrashCan}" class="Delete" alt="Удалить работу">
									<span class="denialText"> Удалить работу </span>
								</div>
								<button class="HWSend homeworkModal customBtn mini"> Сохранить </button>`
		
						}
					
						
					</div>
				</div>
				
				<div class="hwPreview studentPreview">
					${PreviewContent}
				</div>
		`
		
		let Homework = document.createElement('div');
		Homework.className = "hwBlock"
		Homework.setAttribute("id", hw.id);
		Homework.setAttribute("id_domzad", hw.id_domzad);
		Homework.setAttribute("id_stud", hw.id_stud);
		Homework.setAttribute("hw_group", hw.group);
		Homework.setAttribute("hw_creds", hw.fio_stud);
		if (ApplyOrDeny) {
			Homework.classList.add("ApplyOrDeny");
		}
		Homework.innerHTML = block
		let Preview = Homework.find("div.preview");
		let SendAction = Homework.find("div.Tools button.HWSend");
		let ResetActionImage = Homework.find("div.Tools div.denialDivide img");             // null if ApplyOrDeny=true
		let ResetActionTitle = Homework.find("div.Tools div.denialDivide span.denialText"); // null if ApplyOrDeny=true
		let HomeworkDeny = Homework.find("div.Tools button.HWSend.deny");                   // null if ApplyOrDeny=false
		let HomeworkApply = Homework.find("div.Tools button.HWSend.apply");    				// null if ApplyOrDeny=false
		let textArea = Homework.find("div.Comment textarea#cmnt");
		let fileInput = Homework.find("div.fileInput form input#fileUploader");
		let fileInputTitle = Homework.find("div.fileInput form label.input-file span");
		let ResetFileUploader = Homework.find("div.fileInput span.fileUploaderReset");
		
		
		Homework.find('div.HwActions span.FileTeach').onclick = () => {
			lastData.M3.setUnreachable(false);
			downloadFile(hw.file_teach);
			setTimeout(() => {
				lastData.M3.setUnreachable(true);
			}, 500);
		}
		
		Homework.find('div.HwActions span.FileStud').onclick = () => {
			lastData.M3.setUnreachable(false);
			downloadFile(hw.st_filename);
			setTimeout(() => {
				lastData.M3.setUnreachable(true);
			}, 500);
		}
		
		ResetFileUploader.style.display = 'none';
		ResetFileUploader.onclick = () => {
			fileInput.value='';
			fileInputTitle.textContent='Выберите файл';
			ResetFileUploader.style.display = 'none';
			fileInput.parentElement.classList.remove('filled');
		}
		
		fileInput.onchange = async () => {
			const file = event.target.files[0];

			if (!file) {
				fileInputTitle.textContent='Выберите файл';
				ResetFileUploader.style.display = 'none';
				fileInput.parentElement.classList.remove('filled');
				return;
			}
			fileInput.parentElement.classList.add('filled');
			fileInputTitle.textContent=file.name;
			ResetFileUploader.style.display = '';
		}
		
		
		let workDenial = false;
		if (!ApplyOrDeny) {
			ResetActionTitle.parentElement.onclick = () => {
				workDenial = !workDenial;
				if (workDenial) {
					SendAction.classList.add('denial');
					SendAction.textContent = "Удалить работу";
					ResetActionTitle.textContent = "Отмена";
					ResetActionImage.src = CloseIco;
				} else {
					SendAction.classList.remove('denial');
					SendAction.textContent = "Сохранить";
					ResetActionTitle.textContent = "Удалить работу";
					ResetActionImage.src = TrashCan;
				}
			}
		
			SendAction.onclick = async () => {
				try {
					const mark = GetMark(Homework);
					
					SetCardStatus(Homework, BUSY);
					let uploadId = null;
					if (fileInput && fileInput.files && fileInput.files.length > 0) {
						const res = await UploadFile(hw, fileInput);
						console.log("res result:"+res);
						uploadId = res[0].link;
					}
						
					if (workDenial) { // DENY
						let result = await SendWorkDenial(hw.id, textArea.value, uploadId);
						if (result.ok && result.body === "true") {
							RemoveCard(Homework);
						}
						return;
						
					} else { // SAVE
						if (mark === null || mark === undefined) {
							throw "mark is null";
							return
						}
					
						let result = await SendWorkApply(hw, mark, textArea.value, uploadId);
						console.log(result);
						if (result.ok && result.status === 200) {
							RemoveCard(Homework);
						}
					}
				} catch(e) {
					console.warn(e)
					Toast.create("Произошла ошибка при выполнении действия!", 3500, {});
				} finally {
					SetCardStatus(Homework, FREE);
				}
			}
			
			
		// IF WE ARE WORKING ON DENY/APPLY HOMEWORK
		} else {
			HomeworkDeny.onclick = () => {
				fetcher('https://omni.top-academy.ru/homework/approve-request', 'POST', {
					id: `${hw.id}`,
					type: 0
				}).then(res => {
					onAppealResult(res, true);
				}).catch(err => {
					onAppealResult(res, false);
				})
			}
			HomeworkApply.onclick = () => {
				fetcher('https://omni.top-academy.ru/homework/approve-request', 'POST', {
					id: `${hw.id}`,
					type: 1
				}).then(res => {
					onAppealResult(res, true);
				}).catch(err => {
					onAppealResult(res, false);
				})
			}
		}
			
		function onAppealResult(res, isSucsess) {
			if (res.ok) {
				RemoveCard(Homework);
			}
			if (res.body) {
				Toast.create(res.body.success, 3500, {});
			} else if (!isSucsess) {
				Toast.create("Что-то пошло не так :(", 3500, {});
			}			
		}
			
		
		
		let MarkElements = Homework.findAll("div.SetMark > div.list > span[mark]")
		MarkElements.forEach(mark => {
			mark.onclick = () => {
				MarkElements.forEach(m => m.classList.remove('active'))
				mark.classList.add('active')
			}
		})
		
		return {url: hw.st_filename, teach_url: hw.file_teach, block: Homework}
	
	// RunHomeworkPreview(PreviewList, lastData.Win);
	// lastData.M3.setUnreachable(true);
}	

function RemoveCard(Card) {
	HWEntries = HWEntries.filter(e => !e.card || e.card.block !== Card);

	Card.classList.add('closed');
	setTimeout(() => {
		Card.remove();
		RefreshHomeworkView();
	}, 1000);
}

function GetMark(card) {
	let mark = card.find('div.info > div.SetMark > div.list > span.active');
	if (!mark) return null;
	
	return mark.getAttribute("mark");
}


const BUSY = "BUSY";
const FREE = "FREE";
function SetCardStatus(Card, Status) {
	if (Status === BUSY) {
		Card.classList.add('busy');
	} else {
		Card.classList.remove('busy');
	}
}

function LoadFilterGroups(res, list) { // TODO
	let groupData = {}
	let groups = [];
	
	let WorkSection = res[ActiveReview.type];
	console.log(res, ActiveReview.type, WorkSection);
	list.innerHTML = `<option value="" selected>Все группы (${WorkSection.length})</option>`;
	for (let i = 0; i < WorkSection.length; i++) {
		let hwObject = WorkSection[i];
		console.log(hwObject);
		let group = hwObject.group;
		if (group === null) continue
		
		if (!Object.keys(groupData).includes(group)) {
			groupData[group] = 0
		}
		groupData[group] += 1;
		if (groups.includes(group)) {continue}
		
		groups.push(group);
	}
	
	for (let i = 0; i < groups.length; i++) {
		let group = groups[i];
		
		let option = document.createElement('option');
		option.value = group;
		option.textContent = group + ` (${groupData[group]})`;
		list.appendChild(option);
	}
}

function UploadFile(hw, fileInput) {
	return FetchFileToken()
		.then(res => {
			if (!res.ok) {
				Toast.create("Что-то пошло не так:(", 3500, {})
				return "false";
			}
			let payload = res.data;
			
			let newFileId = payload.dir.homeworkCommentAttachDirId.src;
			const formData = new FormData();
			
			customHeaders = {
				"Authorization": "Bearer "+payload.token
			}

			formData.append("directory", newFileId);
			formData.append("files[]", fileInput.files[0]);

			return fetch("https://fs.top-academy.ru/api/v1/files", {
				method: "POST",
				headers: customHeaders,
				body: formData
			});
		})
		.then(async response => {
			const contentType = response.headers.get("content-type") || "";

			if (contentType.includes("application/json")) {
				return await response.json();
			}

			return await response.text();
		});
}



function SendWorkDenial(id, comment, comment_attach) {
	
	return fetcher("https://omni.top-academy.ru/homework/delete-stud-dz", "POST",
		{"id_domzad": id, "comment": comment, "comment_attach": comment_attach},
		true
	);
	
	
	// https://omni.top-academy.ru/homework/delete-stud-dz
	// POST
	// {"id_domzad":"156845","comment":"Deny", comment_attach: string?}
	
	// Response:
	// true / false (as text)
}


function SendWorkApply(studDz, mark, comment, comment_attach) {
	
	// Код ниже был скопирован из оригинального контроллера домашних работ. Зачем это нужно - я не знаю, но я не хочу ничего ломать
	if (!studDz.id_domzad && studDz.id_domzad_teach) {
		studDz.id_domzad = studDz.id_domzad_teach;
	}
	if (!studDz.id_stud && studDz.stud_stud) {
		studDz.id_stud = studDz.stud_stud;
	}
	if (comment_attach !== null) {
		studDz.comment_attach = comment_attach;
		studDz.file_attach = null;
	}
	
	// А теперь внимание, этот кусок кода я тоже вырезал почти не трогая, вот как присваивается оценка:
	let date = new Date();
    let keyMark = '' + date.getSeconds() + date.getMilliseconds();
	let DzMarks = {};
    DzMarks[keyMark] = {
        id: studDz.id_domzad,
        mark: mark,
        ospr: studDz.ospr,
        stud: studDz.id_stud,
    };
    studDz.marks = DzMarks;
	// Браво господа! Хуже я ничего не видел
	// P.S. ниже уже мой код
	
	
	studDz.mark = mark;
	if (typeof comment === "string" && comment.length > 0 && comment.length <= 1000) {
		studDz.comment = comment;
	}
	
	const SendingPayload = { HomeworkForm: studDz }
	return fetcher("https://omni.top-academy.ru/homework/save-homework", "POST", SendingPayload);
}



// TODO:
// - Проверка длины comment (до 1000 символов)
// - Менять "Добавить комментарий" на "Почему отклоняете?" когда отклоняем