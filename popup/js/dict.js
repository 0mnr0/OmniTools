const DICT = {
	'en': {
		
	},
	'ru': {
		'GeneralSettings': "Настройки",
		'ServerChoise': "Сервера",
		'OtherTab': 'Другое',
		
		'ShowTeacherPreview': 'Предпросмотр ДЗ учителя',
		'ShowTeacherPreview.Desc': 'Расширение попробует показать содержание задания, выданное преподавателем',
		'DarkTheme': 'Темная тема',
		'DarkTheme.Desc': 'Расширение перепишет нес-ко стилей, создав темную тему. Функция ещё тестируется, пожалуйста напишите мне если возникли проблемы',
		'LoadingIndicatorFix': 'Скрыть загрузчик',
		'LoadingIndicatorFix.Desc': 'Индикатор загрузки потеряет хитбокс, вам не нужно будет ждать пока загрузиться страница чтобы перейти на другую',
		'AiLearning': 'Обучение ИИ 🙏',
		'AiLearning.Desc': 'Помогите мне обучить классификатор. Оценивайте описание выполненной работы ученика, и в будущем, возможно появится автоматическая проверка дз. Это один большой эксперимент, появление функции не гарантируется',
		'DoSessionUpdate': 'Обновлять сессию',
		'DoSessionUpdate.Desc': 'Чтобы вас не выкидывало из аккаунта, можно каждые 20 минут обновлять сессию. Работает не у всех, если вы испытваете проблемы при работе на сайте - отключите.',
		'FullScreenHomeworkCard': 'Большие карточки ДЗ',
		'FullScreenHomeworkCard.Desc': 'Карточка с домашним заданием будет занимать всю высоту допустимого окна. Только в полноэкранном режиме',
		
		'delete': `Удалить`,
		'ProjectOnGitHub': `Проект на GitHub`,
		
		'roulette.type.functions': 'Функции',
		'roulette.type.theme': 'Оформление',
		'roulette.type.other': 'Другое',
		
		'SettingsWasReloaded': 'Параметры применены!'
	},
	"ru-RU": "ru"
}



const lang = navigator.language;
const LoadLanguage =
    TranslateAssistant.isLangIncluded(DICT, lang) ? lang : 'en';
	
TranslateAssistant.init(LoadLanguage, DICT);
