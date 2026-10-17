// const HWPreviewColors = ["#c5a577", "#c57777", "#c577bd", "#9477c5", "#7786c5", "#77bec5", "#77bec5", "#77c57d", "#c5bf77"]

class TimeoutError extends Error {
	constructor(label, ms) {
		super(`${label || 'operation'} timed out after ${ms}ms`);
		this.name = 'TimeoutError';
		this.label = label;
		this.ms = ms;
	}
}

function withTimeout(promise, ms, label) {
	let timerId;
	const timeout = new Promise((_, reject) => {
		timerId = setTimeout(() => reject(new TimeoutError(label, ms)), ms);
	});
	return Promise.race([promise, timeout]).finally(() => clearTimeout(timerId));
}

async function RunHomeworkPreview(HWList, modalWindow) {
	let previewProgress = modalWindow.find('div.previewProgress');
	let taskProgress = previewProgress.find('span#taskPreview');
	let hwProgress = previewProgress.find('span#hwPreview');


	let progressData = {
		task: 0,
		homework: 0,
		totalTasks: HWList.length * 2, // teacher + student на каждое ДЗ
		total: HWList.length
	}
	
	function updateProgressTitle() {
		let taskProgress = (progressData.task / progressData.totalTasks) * 100;
		let hwProgress = (progressData.homework / progressData.total) * 100;
		if (taskProgress >= 99 && hwProgress >= 99) {
			previewProgress.classList.add("done")
		} else {
			previewProgress.classList.remove("done")
		}
		previewProgress.setAttribute("title", `Загрузка предпросмотра учеников: ${Math.round(hwProgress)}%\nЗагрузка предпросмотра преподавателей: ${Math.round(taskProgress)}%`);
	}

	function bumpTaskCounter() {
		progressData.task++;
		let newTaskProgress = (progressData.task / progressData.totalTasks) * 100;
		taskProgress.style.width = newTaskProgress+"%";
		updateProgressTitle();
	}

	function bumpHwCounter() {
		progressData.homework++;
		let newHwProgress = (progressData.homework / progressData.total) * 100;
		hwProgress.style.width = newHwProgress+"%";
		updateProgressTitle();
		
	}

	async function processPreview(HW, Preview, studentView) {
		
		let CodeContent = Preview.find('div.CodeContent');
		let IMAGEContent = Preview.find('img#IMAGEContent');
		let VIDEOContent = Preview.find('video#VIDEOContent');
		let IFrame = Preview.find('iframe.HTMLContent');
		let Loader = Preview.find('span.loaderStatus');
		let FileDefinition = Preview.find('div.hwPreviewStat span#FileType');
		
		if (!CurrentSettings.ShowTeacherPreview && !studentView) {
			bumpTaskCounter();
			FailedToPreview(Preview, true);
			return
		}
		
		Loader.find('span[text]').textContent = "Открытие на клиенте...";

		let URLContent = studentView ? HW.url : HW.teach_url;
		
		function setFileType(type) {
			if (type) {FileDefinition.textContent = type; FileDefinition.classList.add('defined')}
		}

		function setLocalContent(LocalContent, isImage, URL) {
			if (LocalContent.type.startsWith("image")) {
				IMAGEContent.src = URL;
				IMAGEContent.style.display = '';
			} else {
				VIDEOContent.src = URL;
				VIDEOContent.style.display = '';
			}

			Preview.classList.add('asClient');
			IFrame.style.display = 'none';
		}

		function setHtmlContent(content) {
			const blob = new Blob([IFrameMetaPatch + IFrameThemeBridgePatch + content + IFrameCSSPatch], {
				type: "text/html"
			});
			const url = URL.createObjectURL(blob);
			IFrame.src = url;
			
			IFrame.addEventListener('load', () => {
				UpdateIFrameDarkTheme(IFrame, CurrentSettings.DarkTheme);
			}, { once: true });
			
			PreviewFrames.push(IFrame);
		}
		
		function DestroyLoader() {
			Loader.remove();
		}

		try {
			if (!URLContent) {
				FailedToPreview(Preview);
				return;
			}

			let readContent = await DBStore.getHWID("HWC", URLContent);
			
			if (readContent !== undefined) {
				if (readContent.displayAs === "image" || readContent.displayAs === "video") {
					setLocalContent({ type: readContent.displayAs }, readContent.displayAs.startsWith("image"), URLContent);
					setFileType('media');
					DestroyLoader();
					return;
				}

				if (readContent.displayAs === "html") {					
					setHtmlContent(readContent.content);
					setFileType(readContent.type);
					DestroyLoader();
					return;
				}

				if (readContent.displayAs === "none" && readContent.content === null) {
					FailedToPreview(Preview);
					return;
				}
			}


			let LocalContent = await getMedia(URLContent);
			if (LocalContent.isContent) {
				let isImage = LocalContent.type.startsWith("image");
				setLocalContent(LocalContent, isImage, URLContent);
				const fileType = isImage ? "image" : "video";
				await DBStore.setHWID("HWC", URLContent, { displayAs: fileType, content: URLContent, type: fileType });
				setFileType("media");
				return;

			} else {
				Loader.find('span[text]').textContent = "Открытие с помощью сервера...";

				let fetchRes;
				try {
					const fetchSuffix = studentView ? "" : "?useCache=no";
					fetchRes = await withTimeout(
						Parse(`${ServerURL}/teacherTools/v2/hwPreviewTool${fetchSuffix}`, "POST", { url: URLContent }),
						15000,
						'hwPreviewTool'
					);
				} catch (err) {
					FailedToPreview(Preview);
					if (err instanceof TimeoutError) {
						return
					} else {
						console.error('[HWPreview] Непредсказанная ошибка парсера:', URLContent, err);
					}

					await DBStore.setHWID("HWC", URLContent, { displayAs: "none", content: null });
					return;
				}
				
				if (fetchRes.success && fetchRes.displayAs === "html") {
					let fetchedHTML = fetchRes.content;
					const fileType = fetchRes.originalType;
					if (fileType === "txt") {
						fetchedHTML = fetchedHTML.replaceAll("\n", "\n<br>");
					}
					
					setHtmlContent(fetchedHTML);
					DestroyLoader();
					await DBStore.setHWID("HWC", URLContent, { displayAs: "html", content: fetchedHTML, type: fileType });
					setFileType(fileType);
					return;
				}
				else if (!fetchRes.success) {
					await DBStore.setHWID("HWC", URLContent, { displayAs: "none", content: null });
					FailedToPreview(Preview);
					return;
				}
			}

			FailedToPreview(Preview);

		} catch (e) {
			console.error(e);
			FailedToPreview(Preview);
		} finally {
			bumpTaskCounter();
		}
	}

	let l = [];
	for (let HW of HWList) {
		let BlockElement = HW.block;
		if (HW.url !== null) {
			l.push(HW.url);
		}
		if (HW.teach_url !== null) {
			l.push(HW.teach_url);
		}
	}

	for (let HW of HWList) {
		let BlockElement = HW.block;
		let TeacherPreview = BlockElement.find('div.hwPreview.teacherPreview');
		let StudentPreview = BlockElement.find('div.hwPreview.studentPreview');

		Promise.allSettled([
			processPreview(HW, TeacherPreview, false),
			processPreview(HW, StudentPreview, true)
		]).then(() => bumpHwCounter());
	}
}


function FailedToPreview(block, instant=false) {
	if (instant) {
		block.remove();
		return
	}
	block.classList.add('notLoaded');

	setTimeout(() => {
		block.classList.add('hideBlock');
		setTimeout(() => { block.remove(); }, 1000);
	}, 10000);

	block.find('span.loaderStatus span[text]').textContent = "Предпросмотр не доступен :(";
}


async function getMedia(url) {
	return new Promise((resolve) => {
		let finished = false;

		const done = (result) => {
			if (finished)
				return;

			finished = true;

			img.src = "";
			video.src = "";

			resolve(result);
		};

		const img = new Image();

		img.onload = () => {
			done({
				isContent: true,
				type: "image",
				media: img
			});
		};

		img.onerror = () => {
			imgFailed = true;

			if (videoFailed)
				done({ isContent: false });
		};

		const video = document.createElement("video");

		video.onloadeddata = () => {
			done({
				isContent: true,
				type: "video",
				media: video
			});
		};

		video.onerror = () => {
			videoFailed = true;

			if (imgFailed)
				done({ isContent: false });
		};

		let imgFailed = false;
		let videoFailed = false;

		img.src = url;
		video.src = url;

		video.load();
	});
}


function UpdateIFrameDarkTheme(frame, state, origin="*") {
	if (frame === null || frame.contentWindow === null) return
	
	frame.contentWindow.postMessage({
        type: 'UPDATE_SINGLE_STYLE',
        styleId: "THEME_MANAGE",
        cssContent: state ? IFrameDarkCssPatch : ""
    }, origin);
}

function AutoUpdateIFrameDarkTheme(state) {
	PreviewFrames.forEach(frame => {
		UpdateIFrameDarkTheme(frame, state);
	})
}