const DICT = {
	'en': {
		'Omni': "Omni",
		'GlobalServerState': "All Servers",
		'GeneralSettings': "Settings",
		'JustASecond': "Second",
		'ServerChoise': "Servers",
		'OtherTab': 'Other',
		
		'ShowTeacherPreview': 'Preview of teacher task',
		'ShowTeacherPreview.Desc': 'The expansion will attempt to show the content of the assignment provided by the instructor.',
		'DarkTheme': 'Dark Theme',
		'DarkTheme.Desc': 'The extension will rewrite several styles, creating a dark theme. The function is still under testing; please write to me if you encounter any issues.',
		'LoadingIndicatorFix': 'Transparent loader',
		'LoadingIndicatorFix.Desc': 'The loading indicator will lose its hitbox; you won’t need to wait for the page to load in order to switch to another one. In short, clicks will pass through it.',
		'AiLearning': 'AI Learning 🙏',
		'AiLearning.Desc': 'I want to create an automated homework check, but I need a large dataset and, accordingly, your help. When the data is available, you will see a request: “Based on this homework description, assign a rating from 1 to 10.” All of this is one big experiment; the appearance of the feature is not guaranteed.',
		'AiLearning.Desc2': 'Data collection and surveys will be done later. I’ll do it when I have time.',
		'DoSessionUpdate': 'Update the session',
		'DoSessionUpdate.Desc': 'To prevent being logged out of your account, you can refresh the session every 20 minutes. This doesn’t work for everyone; if you experience problems while working on the site, disable it.',
		'DoSessionUpdate.Desc2': 'Their website is based on a randomly functioning API. The function may not produce results due to the unpredictable behavior of the server.',
		'FullScreenHomeworkCard': 'Big Homework cards',
		'FullScreenHomeworkCard.Desc': 'The homework card will occupy the entire height of the allowed window. Only in full‑screen mode.',
		'ImproveSiteStyle': 'A bunch of minor corrections',
		'ImproveSiteStyle.Desc': 'The option will fix all sorts of minor CSS issues. If something isn’t working the way it used to, disable the option.',
		'AiSettings': 'AI Behavior',
		'LoyalAI': 'Increased loyalty',
		'LoyalAI.Desc': 'Ask the AI to be gentle and respond in a more relaxed manner. This applies to both feedback and auto‑checking of homework.',
		
		'CacheControl': 'Cache control',
		'MemoryControl': 'Cache',
		'MB': 'MB',
		'MegaBytes_Took': 'mb. took',
		'MaxCacheSize': 'Maximum cache size',
		'ResetOldCache': 'Clear the outdated cache',
		'ResetAllCache': 'Clear the entire cache',
		'ResetAllCacheConfirm': 'Delete all cache? This will affect the speed of opening some works',
		'recommended': 'Recommended',
		
		'delete': `Delete`,
		'ProjectOnGitHub': `Project on GitHub`,
		
		'roulette.type.functions': 'Functions',
		'roulette.type.theme': 'Decoration',
		'roulette.type.hotkeys': 'Hot Keys',
		'roulette.type.other': 'Other',
		
		
		'HotKey_OneClickSend': 'SHIFT + W',
		'HotKey.OneClickSend.Desc': 'Allow sending a mark with a single tap',
		
		'HotKey_HoldToSetMark': 'SHIFT + F',
		'HotKey.HoldToSetMark.Desc': 'Allow automatic selection of the highest mark',
		
		'SettingsWasReloaded': 'The parameters have been applied!',
		'AboutProject': 'About project',
		'Done': 'Done',
		'DoneAndCleared': 'Done! Objects deleted: ',
		'DoneAndNotCleared': 'There’s nothing to clean :(',
		'NowInFireFox': 'Now in Firefox',
		'AboutThisProject_P1': `This project was created NOT by a teacher, but by a student using a teacher’s account. I cannot provide full code testing under conditions where someone else is working on it.`,
		'AboutThisProject_P2': `If you notice that something isn’t working in the extension, you can message me on Telegram, but in some cases, I’ll need your login credentials to fix the error. Alternatively, if you have Web development skills, Pull Requests in the GitHub repository are welcome :)`,
		'ContactDev': 'Contact the developer'
	},
	
	
	
	// // // // // // // // // // // // // // 
	
	
	'ru': {
		'Omni': "Omni",
		'GlobalServerState': "Все сервера",
		'JustASecond': "Секунду",
		'GeneralSettings': "Настройки",
		'ServerChoise': "Сервера",
		'OtherTab': 'Другое',
		
		'ShowTeacherPreview': 'Предпросмотр ДЗ учителя',
		'ShowTeacherPreview.Desc': 'Расширение попробует показать содержание задания, выданное преподавателем',
		'DarkTheme': 'Темная тема',
		'DarkTheme.Desc': 'Расширение перепишет нес-ко стилей, создав темную тему. Функция ещё тестируется, пожалуйста напишите мне если возникли проблемы',
		'LoadingIndicatorFix': 'Прозрачный загрузчик',
		'LoadingIndicatorFix.Desc': 'Индикатор загрузки потеряет хитбокс, вам не нужно будет ждать пока загрузиться страница чтобы перейти на другую. Кратко говоря нажатия будут проходить сквозь него',
		'AiLearning': 'Обучение ИИ 🙏',
		'AiLearning.Desc': 'Я хочу сделать авто-проверку ДЗ, но мне нужен большой датасет и соответственно, ваша помощь. Когда появятся данные, вы увидите просьбу: "Основываясь на этом описании домашней работы, поставьте оценку от 1 до 10". Всё это - один большой эксперимент, появление фишки не гарантируется',
		'AiLearning.Desc2': 'Сбор данных и опросы будут позже. Сделаю как будет время',
		'DoSessionUpdate': 'Обновлять сессию',
		'DoSessionUpdate.Desc': 'Чтобы вас не выкидывало из аккаунта, можно каждые 20 минут обновлять сессию. Работает не у всех, если вы испытваете проблемы при работе на сайте - отключите.',
		'DoSessionUpdate.Desc2': 'Их сайт основывается на хаотично работающем API. Функция может не приность результат из-за непредсказемого поведения сервера',
		'FullScreenHomeworkCard': 'Большие карточки ДЗ',
		'FullScreenHomeworkCard.Desc': 'Карточка с домашним заданием будет занимать всю высоту допустимого окна. Только в полноэкранном режиме',
		'ImproveSiteStyle': 'Куча мелких исправлений',
		'ImproveSiteStyle.Desc': 'Опция исправит всякие мелкие CSS недостатки. Если что-то работает не так как работало - отключите опцию',
		'AiSettings': 'Поведение ИИ',
		'LoyalAI': 'Повышенная лояльность',
		'LoyalAI.Desc': 'Просить ИИ быть мягким и отвечать в более легкой форме. Применяется и к отзывам и к автопроверке дз',
		
		'CacheControl': 'Контроль кэша',
		'MemoryControl': 'Кэш',
		'MB': 'МБ',
		'MegaBytes_Took': 'мб. занято',
		'MaxCacheSize': 'Максимальный размер кэша',
		'ResetOldCache': 'Почистить неактуальный кэш',
		'ResetAllCache': 'Почистить весь кэш',
		'ResetAllCacheConfirm': 'Удалить весь кэш? Это повлияет на скорость открытия нек-ых дз',
		'recommended': 'Рекомендуется',
		
		'delete': `Удалить`,
		'ProjectOnGitHub': `Проект на GitHub`,
		
		'roulette.type.functions': 'Функции',
		'roulette.type.theme': 'Оформление',
		'roulette.type.hotkeys': 'Комбинации',
		'roulette.type.other': 'Другое',
		
		'HotKey_OneClickSend': 'SHIFT + W',
		'HotKey.OneClickSend.Desc': 'Разрешить отправку оценки одним нажатием',
		
		'HotKey_HoldToSetMark': 'SHIFT + F',
		'HotKey.HoldToSetMark.Desc': 'Разрешить автоматический выбор наивысшей оценки',
		
		
		
		'SettingsWasReloaded': 'Параметры применены!',
		'AboutProject': 'О проекте',
		'Done': 'Готово',
		'DoneAndCleared': 'Готово! Объектов удалено: ',
		'DoneAndNotCleared': 'Нечего очищать :(',
		'NowInFireFox': 'OmniTools в FireFox',
		'AboutThisProject_P1': `Этот проект был создан НЕ преподавателем, а учеником с помощью учительского аккаунта. Я не могу обеспечивать полноценное тестирование кода в условиях работы от чужого лица.`,
		'AboutThisProject_P2': `Если вы видите что в расширении что-то не работает вы можете написать мне в Telegram, но в нек-ых случаях для исправления ошибки мне потребуются авторизационные данные. Либо, если вы обладаете навыками Web разработки, приветствуются Pull Request в GitHub репозиторий :)`,
		'ContactDev': 'Написать разработчику'
	},
	"ru-RU": "ru"
}



const lang = navigator.language;
const LoadLanguage =
    TranslateAssistant.isLangIncluded(DICT, lang) ? lang : 'en';
	
TranslateAssistant.init(LoadLanguage, DICT);
