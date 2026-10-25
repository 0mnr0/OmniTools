// Content-Script side

const DBStore = new Proxy({}, {
	get(_target, method) {
		return (...args) => {
			return new Promise((resolve, reject) => {
				chrome.runtime.sendMessage(
					{ __idbBridge: true, method, args },
					(response) => {
						if (chrome.runtime.lastError) {
							reject(new Error(chrome.runtime.lastError.message));
							return;
						}
						if (!response) {
							reject(new Error("No response from background (is registerBridge() called?)"));
							return;
						}
						if (!response.ok) {
							reject(new Error(response.error));
							return;
						}
						resolve(response.result);
					}
				);
			});
		};
	},
});



// await DBSTore.get("UID", "uniqueID");
// await DBSTore.getAll("UID");