const darkThemeCssContent = `
	:root {
		--accent-0: #1c1c1c;
		--accent-1: #181818;
		--accent-2: #252525;
		--accent-text: #fff5ec;
		--accent-red: #ff8080;
		--accent-input-bg: #232323;
		--accent-toolbar-1: #438f72;
		--accent-toolbar-2: #2e7359;
	}
	
	body.main main.content toolbar {
		background: var(--accent-toolbar-1)
	}
	body.main main.content md-sidenav {
		background: var(--accent-toolbar-2)
	}
	
	#cover, html, body.main, body.main main.content,
	.dossier.row .dossier__graph .dossier__subjects .subjects__list .list__item,
	.table-video-reports, .content__author
	{
		background: var(--accent-0);
		color: var(--accent-text);
	}
	
	.lead-form-card, #myDialog.home_work_modal md-dialog,
	.hw-md_delete .md-dialog-content, body div.CustomHWDiv,
	div.CustomHWDiv .topLine.filters select#groupSelector,
	div.CustomHWDiv .topLine.filters input#searchName,
	.lead-form-card__title, .lead-form-field select, .lead-form-field input,
	div.CustomHWDiv .topLine select#reviewTypes,
	div.CustomHWDiv div.content div.Comment textarea {
		background: var(--accent-2);
		color: var(--accent-text);
	}
	
	.md-open-menu-container md-menu-content, 
	.dossier.row, .dossier.row .header,
	.dossier.row .dossier__rating .rating__item,
	.dossier.row .dossier__graph .graph__item,
	.dossier.row .dossier__graph .dossier__subjects {
		background: var(--accent-0);
	}
	
	.modal-teaching-notifications#signal-layout {
		background: var(--accent-1);
	}
	.presents .table>thead>tr>th {
		background: var(--accent-2) !important;
	}
	.internal-wrap-global md-select {
		background: var(--accent-1);
		color: var(--accent-text);
	}
	
	md-select.md-default-theme[disabled] .md-select-value.md-select-placeholder, md-select[disabled] .md-select-value.md-select-placeholder {
		color: #ffffff90;
		opacity: 0.75;
	}
	.internal-wrap-global md-select:not([disabled]):focus .md-select-value {
		color: gray;
	}
	
	body md-select .md-select-value.md-select-placeholder {
		color: #ffffff90;
	}
	
	
	.tabs-global ul li a {
		background: var(--accent-toolbar-2) !important;	
		box-shadow: none !important
	}
	.tabs-global ul li a:after {
		display: none		
	}
	
	md-dialog#dialog_students_traffic.layout-padding._md,
	md-dialog#dialog_students_traffic.layout-padding._md .texarea_stud {
		background: var(--accent-1);
		color: white;
	}
	
	.dossier.row .dossier__rating .rating__item p,
	.dossier.row .dossier__graph .graph__item {
		filter: brightness(1.4);
	}
	
	.modal-teaching-notifications .notifications-list * {
		color: var(--accent-text) !important;
		opacity: 0.95;
	}
	
	.hw-md_delete .md-dialog-content *,
	body div.CustomHWDiv div.topPanel h4,
	body div.CustomHWDiv div.content div.SetMark h4,
	body div.CustomHWDiv div.content div.Comment h4,
	body div.CustomHWDiv div.content div.hwBlock div.info span.fioStud
		{color: var(--accent-text)}
	
	.dossier.row .dossier__graph .graph__item .chart.ng-isolate-scope,
    #myDialog.home_work_modal .hw-md__close	{
		filter: invert(1);
	}
	
	.hw-md_single__select-mark md-radio-button .md-label button {
		border-color: gray
	}
	
	#myDialog.home_work_modal .hw-md_theme, #myDialog.home_work_modal .hw-md_stud__group, #myDialog.home_work_modal .color-grey,
	#myDialog.home_work_modal .hw-md_stud-work__date, #myDialog.home_work_modal .hw-md_stud-work__date-pair,
	#myDialog.home_work_modal .hw-md__tabs_modal ul a{
		color: #ffffff80;
	}
	#myDialog.home_work_modal .hw-md_single_teacher__comment.custom-style textarea,
	#myDialog.home_work_modal .hw-md_single_teacher__comment.custom-style {
		color: #ffffffac
	}

	
	.schedule td div:before, .schedule td, .schedule tr>td:last-child>div:after {
		background: var(--accent-2);
	}
	
	.schedule tr {
		border-color: var(--accent-toolbar-2) !important;
	}
	
	.schedule td {
		border-left: solid 1px var(--accent-toolbar-2);
	}
	
	.dossier.row .header, .dossier.row .dossier__rating .rating__item,
    md-dialog#dialog_students_traffic.layout-padding._md {
		border-radius: 10px
	}
	
	
	.md-open-menu-container md-menu-content button, .dossier.row .header,
	#myDialog.home_work_modal .hw-md_single_stud-work__answer-text,
    .schedule th.angle {
		color: white
	}
	
	
	.px-3 {
		border-color: var(--accent-red) !important
	}
	
	input.form-control {
		background: var(--accent-input-bg) !important;
		color: var(--accent-text);
	}
	
	input.form-control:active {
		filter: brightness(1.3);
	}
	
	.px-3 form a[class="ng-binding"] {
		color: var(--accent-text) !important;
	}
	
	.btn-group.mt-5.pt-3 button {
		background: var(--accent-input-bg) !important;
		color: var(--accent-text);
		border: none
	}
	
	.btn-group.mt-5.pt-3 button.active {
		filter: brightness(1.5);
	}


	.schedule th .blue_bg {
		background: var(--accent-toolbar-1);
	}
	.schedule .internal_wrap, .internal-wrap-global:not(.not-internal-wrap),
	.presents .interna-wrap {
		box-shadow: 0px 0px 8px 1px #4d4d4d
	}
	
	main.content .presents input {
		background: var(--accent-1);
	}
	
	.students .card .card-fio span {
		color: var(--accent-text);
	}
	
	.student-info .table_vizit_info>table>tbody>tr td.col_1:after {
		background: var(--accent-2);
	}
	
	.student-info .all_comments .studentComment-wrapper textarea, .students .input-field-stud.stud_search input[type="search"] {
		background: var(--accent-2);
		color: var(--accent-text);
	}
	
	.groups .visits_wrap .marks div span {
		color: black
	}
	
	.internal-wrap-global md-input-container .md-placeholder, .internal-wrap-global md-input-container label:not(.md-no-float):not(.md-container-ignore) {
		color: gray
	}
	
	.report #report .table-wrapper.schedule td div:before {
		left: 0px;
		width: 100%;
		background: var(--accent-2);
	}
	
	div.CustomHWDiv .topLine select#reviewTypes {
		
	}
	
	.content__author .content-inner input {
		color: gray;
	}
	
	.dossier__students_who_need_help.ng-scope {margin-top: 40px; color: var(--accent-text)}
	.table-video-reports thead tr td, .table-video-reports thead tr, .table-video-reports tbody tr td {border: solid 1px #438f72}
	.table-video-reports tbody tr td {background: var(--accent-2);}
	.table-video-reports thead, .table-video-reports tbody {color: var(--accent-text)}
	
	.home_work-table .hw_buttons.hw_checked, .works div.tested-w:before { background: #589361; border-color: #589361 }
	.home_work-table .hw_buttons.hw_not-loaded, .works div.blocked-w:before { background: #a95776; border-color: #a95776 }
	.home_work-table .hw_buttons.hw_overdue.automark { background: #3b3b3b; border-color: #a95776 }
	
	body div.CustomHWDiv div.content div.hwBlock div.info div.HwActions .StudentResponse.visible {
		border-color: white
	}
`

const IFrameDarkCssPatch = `
	* {color: white}
	::-webkit-scrollbar-track {
		background: #333333;
		width: 6px;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		background: #7f7f7f !important;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover {
	  background: #9b9b9b;
	}
`


const CSSImprove = `
	.hw-md_single__select-mark md-radio-button .md-label button span { top: -1px; position: relative } /* Fixes mark pos in hw check */
	.students .card .card-internal {border-radius: 8px} /* Students Tab */
	.groups .presents table {
		border-radius: 10px;
		overflow: hidden;
	}
	
	.internal-wrap-global md-input-container .md-placeholder, .internal-wrap-global md-input-container label {transition: all .2s}
	
	
`