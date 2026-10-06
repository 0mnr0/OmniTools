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
    padding-bottom: 0px;
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
	top: 0px;
    right: 0px;
	height: 22px;
	gap: 10px;
}

div.CustomHWDiv div.topPanel div.backGuestures img {
	cursor: pointer;
	transition: all .2s;
	background: transparent;
	scale: 1.1;
	padding: 2px;
	border-radius: 5px
}

div.CustomHWDiv div.topPanel div.backGuestures img:hover {
	background: #80808040;
}

div.CustomHWDiv div.topPanel img#close {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 150%;
	cursor: pointer;
	scale: 1.1;
}


div.CustomHWDiv div.content {
	border-top: 1px solid gray;
	padding-top: 10px;
	padding-right: 10px;
	width: 100%;
	overflow: auto
}

div.CustomHWDiv div.content div.hwBlock {
    padding: 6px 0px;
    width: 100%;
    margin-bottom: 20px;
    padding-bottom: 7px;
    border-bottom: solid 1px #80808096;
    display: flex;
	gap: 10px;
    height: auto;
    interpolate-size: allow-keywords;
    transition: all .5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

div.CustomHWDiv div.content div.hwBlock.closed {
	overflow: hidden;
	pointer-events: none;
	height: 0px;
	padding: 0px;
	margin: 0px;
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

div.CustomHWDiv div.content div.hwBlock div.info {
	width: 100%;
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


div.CustomHWDiv .topLine select#reviewTypes {
    width: fit-content;
    padding: 8px;
    border-radius: 10px;
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
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span.FileStud[disabled] {
	pointer-events: none;
	filter: grayscale(1);
	
}

div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span[second] b {
	font-weight: 500
}


div.CustomHWDiv div.content div.hwBlock div.info span[ico]::before {
    content: "";
	position: relative;
	width: 18px;
	height: auto;
	aspect-ratio: 1/1;
	background: red;
	display: inline-block;
	top: 3px;
	background: url('/img/home-work/down-arrow.png');
	background-size: contain;
}

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
	width: fit-content
}

div.CustomHWDiv div.content div.Comment {
    margin-top: 16px;
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

div.CustomHWDiv div.content div.hwBlock div.info span b,
div.CustomHWDiv div.content div.hwBlock div.info div.HwActions span[ico] {
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

div.CustomHWDiv div.content div.hwBlock div.Tools {
	margin-top: 16px;
	margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
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
    padding-right: 0px;
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
	padding-left: 0px
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
    align-items: center;
}

div.CustomHWDiv .previewProgress {
    display: flex;
    flex-direction: column;
    width: 160px;
    height: 20px;
    border-radius: 6px;
    overflow: hidden;
    margin: 0px 10px;
	background: #80808085;
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

div.CustomHWDiv .topLine.filters select#groupSelector, div.CustomHWDiv .topLine.filters input#searchName {
    border-radius: 12px;
    padding: 8px 12px;
    height: 100%;
}

div.CustomHWDiv .topLine.filters {
    display: flex;
	gap: 10px
}

`

document.body.after(styles);