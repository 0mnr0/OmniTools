let aiReviewAnimationWasShown = false;
let AINameList = ["Auto (Recommended)", "Google Gemma (Recommended)", "DeepSeek", "Qwen3"];
let AIProvidesList = ["JournalUI: Server", "google/gemma-3-27b-it:free", "deepseek/deepseek-chat-v3-0324:free", "qwen/qwen3-coder:free"];

function setGenAi() {
	placeAiGenButton();
}


// section.review-card-panel section.review-editor
function placeAiGenButton() {
	if (document.getElementById("AIGenButton")) return	
	
	let placement = document.querySelector('div.review-workspace div.review-card section.review-editor');
	if (placement === null) return;
	
	
	let AIGenButton = document.createElement('button');
	AIGenButton.id="AIGenButton";
	AIGenButton.style=`--ai-icon-url: url('${getIcon('/icons/wand.svg')}')`;
	AIGenButton.innerHTML="<span> Сгенерировать отзыв </span>";
	
	if (aiReviewAnimationWasShown) {
		AIGenButton.classList.add('end');
		AIGenButton.classList.add('mini');
		placement.classList.add('moveSendButton');
	} else {
		setTimeout(() => {
			AIGenButton.classList.add('mini');
			placement.classList.add('moveSendButton');
			setTimeout(() => {AIGenButton.classList.add('end');}, 1000)
		}, 5000);
	}
	
	placement.prepend(AIGenButton);
	const AIGenText = AIGenButton.find('span');
	AIGenButton.onclick = () => {
		GenerateAiCallback(AIGenButton, AIGenText);
	}
}

const BlockDefinitionNames = {
	0: "прошедшее кол-во уроков: ",
	1: "посещаемость: ",
	2: "средняя оценка за работу в классе: ",
	3: "средняя оценка за контрольные работы: ",
	4: "средняя оценка за практические работы: ",
	5: "средняя оценка за домашние задания: ",
	6: "средняя оценка за лабораторные работы: ",
	7: "средняя оценка за прошедшие экзамены: ",
}

function setTextWithAnim(target, text) {
	target.textContent = text;
	target.style.width = `${target.scrollWidth}px`
}
function setTextWithWidth(target, text, width) {
	target.textContent = text;
	target.style.width = `${width}px`
}
function clearTextWithWidth(target) {
	target.style.width = '';
}

function GenerateAiCallback(fromButton, AIGenText) {
	fromButton.disabled = true;
	fromButton.classList.add("workingOnIt");
	setTextWithAnim(AIGenText, "Работаем...");
	
	function ExportAiInfo(blockList, index) {
		let targetBlock = blockList[index];
		let objects = targetBlock.querySelectorAll('span, strong');
		if (objects === null || objects.length !== 2) {return "";}
		
		let appendThisText = objects.length === 2 && objects[1].textContent !== "—";
		if (!appendThisText) {
			return "";
		}
		let value = objects[1].textContent;
		
		console.log(BlockDefinitionNames[index] + value)
		return BlockDefinitionNames[index] + value
	}
	
	let placementStudent = document.querySelector('div.review-workspace header .review-student-main');
	let placementInfo = document.querySelectorAll('div.review-workspace section.review-card-section div.review-metrics div.review-metric');
	let placementArea = document.querySelector('.review-workspace .review-editor md-input-container textarea.md-input');
	if (placementStudent === null || placementInfo === null || placementArea === null) return;
	
	let studentName = placementStudent.querySelector('h2').textContent;
	let subjectName = placementStudent.querySelectorAll('div.review-student-tags > span')[1];
	
	let subInfo = [];
	let subInfoText = "";
	for (let i = 0; i < placementInfo.length; i++) {
		let newInfo = ExportAiInfo(placementInfo, i);
		if (newInfo.length !== 0) {
			subInfo.push(newInfo);
		}
	}
	subInfoText = subInfo.join(', ');
	
	if (subInfoText.length > 0) {
		subInfoText[0] = subInfoText[0].toUpperCase()
		subInfoText += "."
	}
	
	let LoyalAI = CurrentSettings.LoyalAI;
	
	log("LoyalAI: ", LoyalAI)
	let Prompt = `
		Привет!
		Я преподаватель в колледже и мне нужно составить простой и краткий отзыв для ученика (около 3х предложений).
		Прошу тебя помочь с написанием отзыва, заранее большое спасибо. Напиши отзыв от имени учителя, без приветствий, начальных вступлений и без конечного вывода, не растягивая отзыв.
		Пиши просто: короткие фразы, без усложнений но в "деловой" форме. Данные могут быть вычислены неполностью, и зачастую, реальные показания выше.
		${LoyalAI ? "Пожалуйста, не оценивай строго, учебная нагрузка сейчас достаточно большая. Если оценки или посещаемость низкие - постарайся не говорить об этом прямо" : ''}
		Не парься про идеальную грамматику: можно без заглавных, без сложных конструкций. Избегай часто используемых общих слов и фраз! :) Желательно написать отзыв лояльно, простым текстом, если надо - привести проценты. Вот некоторая информация о нем:
		Ученика зовут - "${studentName}". Предмет - ${subjectName}.
		${subInfoText}
	`
	Prompt = Prompt.replaceAll('\t', '');
	
	
	
	function parseFail() {
		fromButton.classList.add("somethingIsWrong");
		setTextWithAnim(AIGenText, "Что-то пошло не так :(");
		setTimeout(() => {
			fromButton.disabled = false;
			fromButton.classList.remove("somethingIsWrong");
			fromButton.classList.remove("workingOnIt");
			fromButton.classList.remove("ready");
			
			setTextWithWidth(AIGenText, "Сгенерировать отзыв", 0);
			setTimeout(() => {
					fromButton.disabled = false;
					clearTextWithWidth(AIGenText);
				}, 1000);
		}, 3000)
	}
	
	fetcher(ServerURL+"/teacherTools/ai.generateText", "POST", { prompt: Prompt }).then((res) => {
		if (res.ok) {
			placementArea.value = res.data.text;
			placementArea.dispatchEvent(new Event('input', { bubbles: true }));
			fromButton.classList.add("ready");
			setTextWithAnim(AIGenText, "Готово!");
			
			setTimeout(() => {
				fromButton.classList.remove("ready");
				fromButton.classList.remove("workingOnIt");
				setTextWithWidth(AIGenText, "Сгенерировать отзыв", 0);
				
				setTimeout(() => {
					clearTextWithWidth(AIGenText);
					fromButton.disabled = false;
				}, 1000);
			}, 2000)
		} else {
			parseFail();
		}
		
	}).catch((err) => {
		console.warn(err);
		parseFail();
	});
	
}