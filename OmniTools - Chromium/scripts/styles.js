let styles = document.createElement('style');
styles.textContent = `


.input-file {
	position: relative;
	display: inline-block;
}
.input-file span {
	position: relative;
	display: inline-block;
	cursor: pointer;
	outline: none;
	text-decoration: none;
	font-size: 14px;
	vertical-align: middle;
	text-align: center;
	border-radius: 4px;
	color: #22aa90;
	line-height: 22px;
	height: 32px;
	box-sizing: border-box;
	border: none;
	margin: 0;
	transition: all 0.2s;
}
.input-file input[type=file] {
	position: absolute;
	z-index: -1;
	opacity: 0;
	display: block;
	width: 0;
	height: 0;
}
 
.input-file input[type=file]:focus + span {
	box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}
 
.input-file:hover span {
	/* background-color: #b1632bbd; */
}
.input-file:active span {
	/* background-color: #ab4f0dbd; */
}
.input-file.filled span {
	color: white;
	background-color: #22aa90;
}
 
.input-file input[type=file]:disabled + span {
	background-color: #eee;
}






button.customBtn.mini {
	width: fit-content;
	padding: 8px 20px;
	border-radius: 6px;
}

button.homeworkModal {
	position: absolute;
	right: 40px;
	top: 8px;
}

.absoluteCenter {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

div.CustomHWDiv, div.CustomHWDiv * {
	position: relative;
	width: auto
}

div.CustomHWDiv {
	position: fixed;
	z-index: 1001;
	width: 80%;
	height: auto;
	max-height: 90%;
	overflow: hidden;
	padding: 12px;
	border-radius: 16px;
	background: white;
	display: flex;
	flex-direction: column;
	transition: all .2s;
}

div.CustomHWDiv.fullscreen {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0px;
    margin-bottom: 0px;
	padding: 4px;
    padding-bottom: 0px;
	
	div.topPanel {
		margin-bottom: 0px
	}
}

div.CustomHWDiv.fullscreen .topLine select#reviewTypes {
	top: 2px
}

div.CustomHWDiv div.topPanel div.backGuestures { transition: all .3s }

div.CustomHWDiv.fullscreen div.topPanel div.backGuestures {
	top: 8px;
}

html.no-scrollbar {
	overflow: hidden !important;
}

div.CustomHWDiv m3loader {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	width: 100%;
	height: 100%;
	max-height: 120px;
	z-index: -1;
	padding: 8px 10px
}


div.CustomHWDiv m3loader svg {
	width: auto;
	height: 100%;
	aspect-ratio: 1/1;
}

div.CustomHWDiv div.topPanel {
	transition: all .2s;
	interpolate-size: allow-keywords;
	margin-bottom: 6px;
}

div.CustomHWDiv div.topPanel h4 {
	font-size: x-large;
	color: #6d6d6d;
	font-weight: 500;
	padding: 6px 2px;
}


div.CustomHWDiv div.topPanel div.backGuestures {
    display: flex;
    position: absolute;
    top: 2px;
    right: 0px;
    height: 26px;
    gap: 5px;
}

div.CustomHWDiv div.topPanel div.backGuestures img {
	cursor: pointer;
	transition: all .2s;
	background: transparent;
	padding: 3px;
	filter: invert(1);
	border-radius: 5px
}

div.CustomHWDiv div.topPanel div.backGuestures img:hover,
div.CustomHWDiv div.topPanel div.backGuestures img#filter.open {
	background: #80808040;
}

div.CustomHWDiv div.topPanel div.backGuestures img#filter {
	border: solid 2px transparent;
	padding: 0px
}
div.CustomHWDiv div.topPanel div.backGuestures img#filter.active {
    border: solid 2px #22aa90;
}

div.CustomHWDiv div.topPanel div.backGuestures img#filter.open:hover {
	background: #535353;
}

div.CustomHWDiv div.topPanel img#close {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 150%;
	cursor: pointer;
}


div.CustomHWDiv div.topPanel img#back {
	aspect-ratio: 1/1;
	width: 30px;
	padding: 2px;
	filter: invert(1);
	cursor: pointer;
	border-radius: 6px;
	transition: all .2s;
}

div.CustomHWDiv div.topPanel img#back:hover {
	background: #71717160;
}


div.CustomHWDiv div.content {
	border-top: 1px solid gray;
	padding-top: 10px;
	padding-right: 10px;
	width: 100%;
	transition: all .5s;
	interpolate-size: allow-keywords;
	overflow: auto
}

div.CustomHWDiv div.content div.hwBlock {
    padding: 6px 0px;
    width: 100%;
    margin-bottom: 20px;
    padding-top: 0px;
    padding-bottom: 10px;
    border-bottom: solid 1px #80808096;
    display: flex;
    gap: 10px;
    height: auto;
    min-height: 500px;
    interpolate-size: allow-keywords;
    transition: all .5s cubic-bezier(0.22, 0.61, 0.36, 1);
}


div.CustomHWDiv div.content div.hwBlock.ApplyOrDeny div.Comment,
div.CustomHWDiv div.content div.hwBlock.ApplyOrDeny div.SetMark {
	display: none
}

div.CustomHWDiv div.content div.hwBlock.closed {
	overflow: hidden;
	pointer-events: none;
	min-height: 0px;
	height: 0px;
	padding: 0px;
	margin: 0px;
	border: none;
	margin-top: -1px;
	opacity: 0
}

div.CustomHWDiv div.content div.hwBlock.busy div.hwPreview {
	opacity: 0.75;
}

div.CustomHWDiv div.content div.hwBlock.busy {
    pointer-events: none;
    filter: grayscale(1);
    animation: 2.6s BusyAnimation infinite;
}

@keyframes BusyAnimation {
  0% {
    opacity: 0.75
  }
  50% {
    opacity: 0.4
  }
  100% {
    opacity: 0.75
  }
}


@keyframes conicAiGen {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

div.CustomHWDiv div.content div.hwBlock div.info {
    display: flex;
    width: 100%;
    flex-direction: column;
}

div.CustomHWDiv div.content div.hwBlock div.info > block1, div.CustomHWDiv div.content div.hwBlock div.info > block2 {
	width: 50%;
}

div.CustomHWDiv div.content div.hwPreview span.loaderStatus {
	position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
	text-align: center;
    justify-content: center;
    flex-direction: column-reverse;
    font-size: 120%;
    font-weight: 500;
}

div.CustomHWDiv div.content div.hwPreview.notLoaded span.loaderStatus span.icon {
	display: block;
}


div.CustomHWDiv div.content div.hwPreview span.loaderStatus span.icon {
    display: none;
    font-size: 500%;
    width: auto;
    color: #ff0000a8;
}


div.CustomHWDiv div.content div.hwBlock div.info span { width: 100%; display: inline-block; margin-bottom: 1px; padding: 3px 0px }
div.CustomHWDiv div.content div.hwBlock div.info span#commentCharCounter {
    position: absolute;
    width: fit-content;
    right: 0px;
    top: 0px;
    font-size: 75%;
    padding: 0px;
    padding-right: 2px;
    opacity: 0.75;
}

div.CustomHWDiv div.content div.hwBlock div.info span b { font-weight: bold }
div.CustomHWDiv div.content div.hwBlock div.info span b[500], div.CustomHWDiv div.content div.hwBlock div.info span b.500 { font-weight: 500 }
div.CustomHWDiv div.content div.hwBlock div.info span.fioStud {
	font-size: 135%;
	color: black;
	font-weight: bold;
	padding-bottom: 2px;
	display: flex;
}

div.CustomHWDiv div.content span.nothingToShow {
    padding: 120px 40px;
    width: 100%;
    display: block;
    text-align: center;
    font-size: 300%;
}


div.CustomHWDiv div.content div.hwBlock div.info span.group {
    font-size: large;
    font-weight: 500;
    padding-top: 4px;
    padding-bottom: 11px;
}

div.CustomHWDiv div.content div.hwBlock div.info div.BadgeList {
    display: flex;
    gap: 5px;
    margin-bottom: 16px;
}

div.CustomHWDiv div.content div.hwBlock div.info span.badge {
    display: flex;
    width: fit-content;
    gap: 8px;
	cursor: help;
    align-items: center;
    padding: 0px 8px;
	padding-right: 10px
}

div.CustomHWDiv div.content div.hwBlock div.info span.badge img[badgeicon] {
    max-height: 24px;
	aspect-ratio: 1/1;
}

div.CustomHWDiv div.content div.hwBlock div.info span.badge[devBadge] {
    background: #956815;
}

div.CustomHWDiv div.content div.hwBlock div.info span.badge[birthdayBadge] {
    background: linear-gradient(152deg, #ff0000d9 4%, #00b8ffd9 50%, #cc00ffd9 82%);
}

div.CustomHWDiv .topLine select#reviewTypes {
    width: fit-content;
    padding: 8px;
    border-radius: 10px;
}
div.CustomHWDiv.fullscreen .topLine{
	margin-bottom: 5px
}

div.CustomHWDiv.fullscreen.tellMeAboutThis div.WindowHelper {
	margin: 0px;
	margin-bottom: 3px;
	border-radius: 6px
}

div.CustomHWDiv div.content div.hwBlock div.info .b500 {
    font-weight: 500
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions {
    display: flex;
    flex-direction: column;
    margin: 16px 0px;
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions > div {
    display: flex;
    justify-content: space-between;
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions .StudentResponse {
	word-break: break-word;
    padding: 10px;
    border: solid 1px black;
    border-radius: 10px;
    margin-top: 8px;
	display: none;
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions .StudentResponse.visible {
	display: block;
}

div.CustomHWDiv div.content div.hwBlock div.info span[second] {
    text-align: end;
	top: 5px;
}


div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span[ico] {
	cursor: pointer;
	color: black;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span[ico].FileRestored {
    cursor: help;
	font-weight: 400;
	font-style: italic
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico].FileRestored::before {
	cursor: pointer
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span.FileStud[disabled] {
	pointer-events: none;
	filter: grayscale(1);
	
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span[second] b {
	font-weight: 500
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico].FileTeach::before {
	filter: hue-rotate(170deg);
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico].FileStud::before {
	filter: hue-rotate(295deg);
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico]::before {
    content: "";
    position: relative;
    width: 18px;
    height: auto;
    aspect-ratio: 1/1;
    background: red;
    display: inline-block;
    top: -1px;
    background: url('/img/home-work/down-arrow.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico] span#FileExt {
	display: none;
    background: #22aa9094;
    width: fit-content;
    padding: 3px;
    border-radius: 6px;
	height: fit-content;
    font-size: 80%;
    order: 10;
    margin-left: 2px;
}

div.CustomHWDiv div.content div.hwBlock div.info span[ico] span#FileExt.defined {display: inline}

div.CustomHWDiv div.content div.SetMark, div.CustomHWDiv div.content div.Comment {
    padding-top: 16px;
}

div.CustomHWDiv div.content div.SetMark h4, div.CustomHWDiv div.content div.Comment h4 {
    font-weight: 600;
	color: black
}

div.CustomHWDiv div.content div.SetMark div.list {
    display: flex;
	gap: 3px;
	margin-top: 5px;
	width: fit-content;
	top: 0px;
	transition: all .2s;
}

div.CustomHWDiv div.content div.hwBlock div.SetMark {
	transition: all .2s;
}

div.CustomHWDiv div.content div.hwBlock.DenialActive div.SetMark {
	opacity: 0.66;
}


body.ShiftW div.CustomHWDiv div.content div.hwBlock:not(.DenialActive) div.SetMark div.list {
	top: 5px;
}

div.CustomHWDiv div.content div.Comment {
    margin-top: 36px;
    margin-bottom: 40px;
    padding-top: 0px;
}

div.CustomHWDiv div.content div.Comment textarea {
    width: 100%;
	min-height: 100px;
	margin: 6px 0px;
	border-radius: 12px 12px 0px 0px;
	padding: 6px
}

div.CustomHWDiv div.content div.hwBlock div.info div.SetMark > div.list span {
    width: auto;
    height: 38px;
	transition: all .2s;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0px;
    font-size: 125%;
    border: solid 1px gray;
    font-weight: 300;
    border-radius: 10px;
    cursor: pointer;
    padding: 4px;
}

div.CustomHWDiv div.content div.hwBlock div.info span b {
	color: black;
}

.noselect {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

div.CustomHWDiv div.content div.hwBlock div.info div.SetMark > div.list span.active {
    background: #22aa90;
    border: none;
    color: white;
    font-weight: 400;
}
div.CustomHWDiv div.content div.hwBlock div.info div.SetMark > div.list span[oub] {
	opacity: 0.5;
}
div.CustomHWDiv div.content div.hwBlock div.info div.SetMark > div.list span[oub].active {
	opacity: 1;
}

div.CustomHWDiv div.content div.hwBlock div.info div.SetMark > div.list span:hover:not(.active) {
	border-color: #22aa90
}

body.ShiftW div.CustomHWDiv div.content div.hwBlock:not(.DenialActive) div.info div.SetMark > div.list span {
	animation: MarkShaking .45s infinite;
}
body.ShiftW div.CustomHWDiv div.content div.hwBlock:not(.DenialActive) div.info div.SetMark > div.list span:hover {
	border-top: solid 3px #22aa90;
}

@keyframes MarkShaking {
	0% {
		transform: translateY(0px);
	}
	
	50% {
		transform: translateY(3px);
	}
	
	100% {
		transform: translateY(0px);
	}
}

div.CustomHWDiv div.content div.hwBlock div.Tools {
    display: flex;
	width: 100%;
    justify-content: space-between;
	align-self: flex-end;
	margin-top: auto;
}

div.CustomHWDiv div.content div.hwBlock button.HWSend {
    right: 0px;
    background: #22aa90;
    color: white;
    top: 0px;
    border: none;
    border-radius: 6px;
	min-width: 33%;
	transition: all .15s
}

div.CustomHWDiv div.content div.hwBlock button.HWSend.homeworkModal.customBtn.mini.deny {
    background: #9f3f20;
}

div.CustomHWDiv div.content div.hwBlock button.HWSend.denial {
    background: #c33d3d;
}

div.CustomHWDiv div.content div.hwBlock div.denialDivide span.denialText {
	width: fit-content;
}
div.CustomHWDiv div.content div.hwBlock div.denialDivide {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
	transition: all .2s;
	cursor: pointer
}

div.CustomHWDiv div.hwPreview.hideBlock {
    width: 0%;
    padding: 0px !important;
    border: none !important;
}

div.CustomHWDiv div.hwPreview {
    padding: 0px 10px;
    width: 100%;
    transition: all .5s ease-out;
    interpolate-size: allow-keywords;
	border: solid 1px #808080b0;
	border-radius: 12px;
    overflow: hidden;
    max-width: 33%;
}

div.CustomHWDiv div.hwPreview.teacherPreview {
	padding-right: 0px;	
	padding-left: 3px;	
}

div.CustomHWDiv div.hwPreview.studentPreview.asClient {
    padding: 0px 8px
}

div.CustomHWDiv div.hwPreviewStat {
	opacity: 0.75;
	color: white;
    display: flex;
    position: absolute;
    gap: 4px;
    border-radius: 7px;
    z-index: 10;
    right: -1px;
    bottom: -1px;
    font-size: 70%;
    transition: all .2s;
}

div.CustomHWDiv div.hwPreviewStat span {
    min-height: 19px;
    display: flex;
    align-items: center;
}

div.CustomHWDiv div.hwPreviewStat span#FileType {
    padding: 4px;
	display: none;
    border-radius: 6px;
    font-weight: 700;
}

div.CustomHWDiv div.hwPreviewStat span#FileType.defined {
	display: inline-flex;
}

div.CustomHWDiv div.hwPreviewStat.studentSide {
    background: #004f00;
}

div.CustomHWDiv div.hwPreviewStat.teacherSide {
    background: #691d00;
}

div.CustomHWDiv div.hwPreview:hover div.hwPreviewStat {
	bottom: -30px
}

div.CustomHWDiv div.hwPreview.asClient {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    border: none;
    width: 100%;
    padding: 20px;
    padding-left: 10px;
}

div.CustomHWDiv div.hwPreview.studentPreview {
	padding-left: 0px;
	padding-right: 0px
}

div.CustomHWDiv div.hwPreview.asClient img#IMAGEContent, div.CustomHWDiv div.hwPreview.asClient video#VIDEOContent {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
	border-radius: 6px;
	margin: 10px
}

div.CustomHWDiv div.hwPreview m3loader span {
	top: 130%;
	colotr: #1c8974
}

.presents .table thead th.number {border-start-start-radius: 16px}
.presents .table thead th:last-child {border-start-end-radius: 16px}

div.CustomHWDiv div.hwPreview iframe.HTMLContent {
	width: 100%; 
	height: 100%;
	border-radius: 12px;
	padding: 6px
}

div.CustomHWDiv div.hwPreview.teacherPreview {
    border-right: solid 3px orangered;
}
div.CustomHWDiv div.hwPreview.studentPreview {
	border-left: solid 3px green;
}

div.CustomHWDiv div.content div.Comment div.fileInput {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    border: solid 1px gray;
    padding: 6px 8px;
    border-radius: 0px 0px 12px 12px;
    margin-top: -4px;
}

div.CustomHWDiv div.content div.Comment div.fileInput .input-file span {
    padding: 5px 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    width: fit-content;
    max-height: 100%;
    overflow: hidden;
    word-wrap: anywhere;
}

div.CustomHWDiv div.WindowHelper {
	--basic-outline-color: black;
    display: flex;
    flex-direction: column;
	color: black;
    gap: 10px;
	interpolate-size: allow-keywords;
	height: 0px;
	overflow: hidden;
	transition: all .5s, z-index 0s;
	margin: 0px;
	padding: 0px 15px;
	opacity: 0;
	height: 0px;
	background: transparent;
	position: absolute;
	top: -10px;
	margin: 0px;
	left: 0px;
	width: 100%;
	color: transparent;
	z-index: 10;
	outline: solid 0px transparent;
}

div.CustomHWDiv.tellMeAboutThis {
	div.WindowHelper {
		height: calc(100% - 10px);
		width: calc(100% - 10px);
		opacity: 1;
		color: var(--accent-text);
		background: var(--accent-2);
		z-index: 16;
		margin: 5px;
		top: 0px;
		border-radius: 10px;
		padding: 15px 15px;
		outline: solid 5px var(--basic-outline-color) !IMPORTANT;
		position: absolute;
	}
	
	div.content, div.topPanel {
		filter: blur(10px);
	}
}

div.CustomHWDiv div.WindowHelper {
	h1 {font-size: 200%}
	h2 {font-size: 180%}
	h3 {font-size: 160%}
	h4 {font-size: 140%}
	h5 {font-size: 120%}
}

div.CustomHWDiv div.WindowHelper button.HelperGoBack {
    position: absolute;
    top: 10px;
    right: 15px;
    background: gray;
    border: none;
    padding: 10px;
    border-radius: 6px;
}

div.CustomHWDiv div.WindowHelper div.Shortcuts h4[title] {
    margin-bottom: 15px;
}

div.CustomHWDiv div.WindowHelper div.ShortcutInfo {
    margin: 15px 0px;
	display: flex;
	align-items: center;
}


div.CustomHWDiv div.WindowHelper div.SCPreview {
    display: flex;
    height: fit-content;
	margin: 0px 10px;
	font-size: 140%;
    gap: 10px;
}

div.CustomHWDiv div.WindowHelper div.SCPreview span {
	display: flex; align-items: center; justify-content: center;
}
div.CustomHWDiv div.WindowHelper div.SCPreview span.SCDemoKey {
	background: #0000008a;
	padding: 10px;
	border-radius: 10px;
	
}

div.CustomHWDiv span[type=divider] {
    width: 100%;
    height: 1px;
    background: #808080ad;
}

div.CustomHWDiv div.content div.Comment div.fileInput .input-file span::before {
    position: relative;
    background: var(--attach-file-icon-url);
    background-size: 100%;
    background-position: center;
    overflow: visible;
    scale: 1.75;
    rotate: 30deg;
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: -10px;
    margin-right: 5px;
}

div.CustomHWDiv div.content div.Comment h4#tellMeWhyyy[describingdenial="true"] {
    text-decoration: underline
}

div.CustomHWDiv div.content div.Comment div.fileInput span.fileUploaderReset {
    text-align: end;
    width: fit-content;
    display: flex;
    align-items: center;
	cursor: pointer;
}


div.CustomHWDiv div.content div.Comment div.fileInput input {
	cursor: pointer;
}



.flex {
	display: flex;
}
.flex.h, .flex.horizontal {
	display: flex;
	flex-direction: column
}

div.CustomHWDiv .topLine {
    display: flex;
    gap: 10px;
    margin-top: -4px;
	height: auto;
	interpolate-size: allow-keywords;
    margin-bottom: 4px;
    align-items: center;
}

div.CustomHWDiv .previewProgress {
    display: flex;
    flex-direction: column;
    width: calc(100% + 31px);
    height: 20px;
	opacity: 0.5;
    border-radius: 10px 0px;
    overflow: hidden;
    margin: 0px 10px;
    background: #80808085;
    position: absolute;
	transition: all .25s;
    top: -23px;
    left: -24px;
}

div.CustomHWDiv .previewProgress.done {
	top: -28px;
	opacity: 0;
}

.previewProgress span {
    height: 100%;
    width: 0px;
    max-width: 100%;
    --w: 8px;
    top: 0px;
    position: absolute;
    transition: all .2s ease-out;
}

.previewProgress span#taskPreview {
	background: orangered;
}

.previewProgress span#hwPreview {
	background: green;
}

div.CustomHWDiv .topLine select {
	cursor: pointer;
}

div.CustomHWDiv .topLine.filters select, div.CustomHWDiv .topLine.filters input#searchName {
    border-radius: 12px;
    padding: 8px 12px;
    height: 100%;
}

div.CustomHWDiv .topLine.filters select#dateSelector {
	margin-left: auto;
	align-self: flex-end;
}


div.CustomHWDiv .topLine.filters {
    max-height: 0px;
    display: flex;
	flex-direction: column;
    opacity: 0.1;
    gap: 10px;
	margin-bottom: 4px;
    overflow: hidden;
    transition: all .25s;
    interpolate-size: allow-keywords;
}

div.CustomHWDiv .topLine.filters.visible {
    max-height: fit-content;
    padding-top: 7px;
    opacity: 1;
    border-top: dashed 1px #80808078;
    margin-top: 7px;
}

div.CustomHWDiv .topLine.filters div.line {
	width: 100%;
	display: flex;
	gap: 10px;
}

div.CustomHWDiv .topLine.filters div.line {
	width: 100%;
	display: flex;
}

div.CustomHWDiv div.moreActions button {
	transition: all .25s;
    padding: 10px 0px;
    border: none;
	color: white;
    background: #22aa90;
    border-radius: 12px;
}

div.moreActions {
    position: absolute;
    bottom: -8px;
    right: -8px;
    padding: 0px 5px;
    z-index: 10;
    display: flex;
    gap: 0px;
    min-width: 43px;
    transition: all .6s;
    interpolate-size: allow-keywords;
    width: fit-content;
    border-radius: 12px;
    justify-content: flex-end;
    background: var(--accent-1);
}

div.moreActions .bottomOverlay {
    position: absolute;
    bottom: -10px;
    right: -10px;
    height: 120%;
    width: 100%;
    z-index: -1;
}

div.moreActions:hover {
	width: auto;
	opacity: 1;
	padding: 5px;
    bottom: 6px;
    right: 6px;
	
	[expandable] {
		width: auto;
		margin-left: 0px;
		margin-right: 10px;
		filter: none;
		opacity: 1;
		
		button.showMoreBtn {
			scale: 1 !important;
		}
	}
}


div.CustomHWDiv div.moreActions:hover button {
	padding: 10px 12px;
}

div.CustomHWDiv div.moreActions button.SendAllMarked[len="0"],
div.CustomHWDiv div.moreActions button.SendAllMarked[disabled] {
	filter: grayscale(1);
	pointer-events: none;
	cursor: default;
}

div.moreActions [expandable] {
    transition: all .4s;
    interpolate-size: allow-keywords;
    width: 0px;
    display: flex;
	opacity: 0;
	padding: 0px;
    white-space: nowrap;
    gap: 4px;
	filter: blur(4px);
	border-radius: 10px;
    overflow: hidden;
}


div.moreActions span[divider] {
	min-width: 1px;
	background: gray;
}

div.CustomHWDiv div.moreActions div.showMore button {
	scale: 0.75;
	transition: all .4s;
	border-radius: 10px;
}

div.moreActions img[more-icon] {
    margin: 0px 4px;
}

div.inMenuButton.Injected {
    width: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
	color: #63d3bd;
    position: absolute;
    bottom: 10px;
	cursor: pointer;
	transition: all .2s;
	font-weight: 300
}

div.inMenuButton.Injected:hover {
	color: white
}

div.inMenuButton.Injected:hover img {
	transform: rotate(90deg)
}

div.inMenuButton.Injected img {
    height: 32px;
    aspect-ratio: 1/1;
    width: auto;
	transition: all .2s;
    margin: 0px 6px;
}


.table-wrapper.wrapper-students table td.name p.timeMissUp {
	top: -14px;
	position: relative
}
	
.table-wrapper.wrapper-students span.timeMiss {
    width: auto;
    position: absolute;
    padding: 4px 8px;
    display: inline-block;
    max-width: 100%;
    word-break: break-all;
    color: white;
    font-weight: 500;
    border-radius: 10px;
    font-size: 14px;
    left: 5px;
    bottom: 5px;
}
	
div.review-card, div.review-card section.review-editor {
	position: relative;
}
	
.table-wrapper.wrapper-students span.timeMiss.miss15 {
	background: #a38800;
}
.table-wrapper.wrapper-students span.timeMiss.miss30 {
	background: #af6900;
}
.table-wrapper.wrapper-students span.timeMiss.missunk {
	background: #b54300;
}
.table-wrapper.wrapper-students span.timeMiss.colorUnknown {
	background: #595959;
}

.presents .number .user-photo__presents:hover span img {display: none}
.presents .number .user-photo__presents {z-index: 3; transition: all .6s; background-position: center; position: relative; top: 0px ; left: 0px}
.presents .number .user-photo__presents:hover { scale: 2.25; z-index: 10; border-radius: 10px }
.customAvatar { object-fit: cover; border-radius: 200px; }
.presents .number video.customAvatar {width: 80px; height: 80px; aspect-ratio: 1/1;position: relative; border-radius: 40px; left: 0px; top: 0px; transition: all .6s ease; cursor: pointer}
.presents .number video.customAvatar:hover {scale: 2.25; z-index: 10; border-radius: 10px}
.presents .number video.customAvatar:active {scale: 7.5; position: relative; z-index: 100; left: 350px; border-radius: 5px !important}
.presents .number .user-photo__presents:active {scale: 7.5; position: relative; z-index: 100; left: 350px; border-radius: 5px !important}
	md-backdrop.md-opaque {height: 100%}
	
.presents .number__presents {display: flex; top: 20px; left: 20px; top: 0px}
.presents .number .user-photo__presents {margin-top: 0px; top: 0px; position: relative; left: 0px}
.presents .number__presents span {align-content: center; position: absolute; top: 50%; transform: translateY(-50%)}
	
.students .card .card-image video {width: 75px; aspect-ratio: 1/1; height: 75px; object-fit: cover}
.student-info .mobile_profile .profileImg video.customAvatar {width: 100%; max-height: 160px; object-fit: cover}
.student-info .reviews-wrap .reviews-wrap__left .profileImg video.customAvatar {width: 116px; height: 116px; transition: all .6s; object-fit: cover;}
@media (max-width: 1600px) and (min-width: 768px) {
	.student-info .reviews-wrap .reviews-wrap__left .profileImg video.customAvatar {width: 86px; height: 86px;}
}
.student-info .reviews-wrap .student_card .profileImg, .mobile_profile .student_card .profileImg, .students .card .card-image {position: relative;}
img.birthdayBadge, .students .card .card-image img.birthdayBadge { 
	width: 30px !important;
	height: 30px !important;
	top: 0px;
	right: 0px;
	position: absolute;
	z-index: 1;
	filter: drop-shadow(0px 0px 2px black);
}
img.birthdayBadge:hover, .students .card .card-image img.birthdayBadge:hover, .student-info .reviews-wrap .reviews-wrap__left .profileImg img.birthdayBadge:hover {
	scale: 1.6;
}
.presents .table td i.user-photo span img.birthdayBadge {
	transition: all .3s;
	display: block !important;
	left: 10px
}

@media (max-width: 1300px) {
	.wrapper-students table.table tr.presents_stud .number .user-photo span img.birthdayBadge {
		position: relative !important;
		top: 15px;
		left: -5px;
	}
	div.wrapper-students table.table tr.presents_stud .number .user-photo span {
		transform: none;
		left: 0px;
		position: relative;
	}
	
	.wrapper-students table.table tr.presents_stud .number .user-photo__presents {pointer-events: none}
	
	div.wrapper-students table.table tr.presents_stud .number {
		left: 0px
	}
}

div.inMenuButton.Injected span {left: 2px; position: relative}


.presents .number__presents span { left: -32px }

@media (max-width: 1300px) {
	.presents .table th.selector_students {border-start-start-radius: 16px; border-start-end-radius: 16px}
	.presents .table th.diamonds {border-end-start-radius: 16px; border-end-end-radius: 16px}
	.wrapper-students table.table tr.presents_stud {
		border-radius: 12px;
		-webkit-border-radius: 12px
	}
	.wrapper-students table.table tr {margin-bottom: 0px; margin-right: 0px}
	.wrapper-students table.table tbody {gap: 15px; justify-content: center; padding: 15px}
	
	.presents .number video.customAvatar {margin-right: 8px}
	.table-wrapper.wrapper-students span.timeMiss {
		position: relative; left: 0px; bottom: 0px
	}
	
	.table-wrapper.wrapper-students table td.name p.timeMissUp {top: 0px}
}


section.review-card-panel section.review-editor {position: relative}
section.review-card-panel section.review-editor button#AIGenButton {
    position: absolute;
    display: flex;
    z-index: 2;
    gap: 6px;
	background: transparent;
    padding: 10px;
    border: none;
	overflow: hidden;
	transition: all .3s, left .3s, top .85s;
    border-radius: 30px;
    top: -55px;
    right: 78px;
    align-items: center;
	
	span {
		interpolate-size: allow-keywords;
		width: auto;
		color: black;
		overflow: hidden;
		white-space: nowrap;
		transition: all .5s ease-out;
	}
}

section.review-card-panel section.review-editor button#AIGenButton:after {
    content: "";
    display: block;
    width: 100%;
    height: auto;
	aspect-ratio: 1/1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    transform-origin: center;
    filter: brightness(0.7);
    transition: all 1s;
	animation: conicAiGen 16s infinite linear;
    background: conic-gradient(red, orange, yellow, green, cyan, blue, violet, red);
}

section.review-card-panel section.review-editor button#AIGenButton:before {
    content: "";
    display: flex;
    width: 30px;
    height: 30px;
    position: relative;
    transition: all .4s;
    transition-delay: 0.1s;
    background: var(--ai-icon-url);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

section.review-card-panel section.review-editor button#AIGenButton.mini {
	gap: 0px;
    background: #22aa90;
	right: 15px;
	top: 2px;
	
	span {
		width: 0px;
		opacity: 0.25;
	}
	
	&:after {
		transition-delay: 0.15s;
		opacity: 0;
		width: 200px;
	}
}

section.review-card-panel section.review-editor button#AIGenButton.end.workingOnIt {
	background: transparent;
	padding: 5px 20px;
	top: -50px;
	
	span {
		opacity: 1;
		width: auto;
	}
	
	&:before {
		width: 0px;
		height: 30px;
		opacity: 0
	}
	
	&:after {
		animation: conicAiGen 16s infinite linear;
		opacity: 0.5;
	}
}
section.review-card-panel section.review-editor button#AIGenButton.end.somethingIsWrong {
	background: transparent;
	span {
		opacity: 1;
		width: auto;
	}
	
	&:before {
		width: 0px;
		height: 30px;
		opacity: 0
	}
	
	&:after {
		animation: conicAiGen 16s infinite linear;
		opacity: 0.75;
		background: repeating-conic-gradient(black 0deg 25%, red 0deg 50%);
	}
}


section.review-card-panel section.review-editor button#AIGenButton.end {
    transition: all 0s, top .3s, padding .3s;
	
	&:after {
		animation: none;
	}
}

section.review-card-panel section.review-editor button#AIGenButton.animEnd {
	&:after {
		animation: none;
	}
}

section.review-card-panel section.review-editor .review-send-button {
    transition: all .35s; top: 0px
}

section.review-card-panel section.review-editor.moveSendButton .review-send-button {
    top: 25px;
}

`; document.body.after(styles);


