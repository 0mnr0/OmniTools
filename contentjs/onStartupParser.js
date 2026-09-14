let cityId = null;

fetchJournal('https://omni.top-academy.ru/auth/get-start-info', 'POST', null).then(res => {
	cityId = res.branch.id_city;
	console.log("Parsed cityId:"+cityId);
})