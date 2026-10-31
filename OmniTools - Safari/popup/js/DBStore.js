// Content-Script side

const DBStore = new Proxy({}, {
	get(_target, method) {
		return (...args) => {
			return new Promise((resolve, reject) => {
				BrowserContext.runtime.sendMessage(
					{ __idbBridge: true, method, args },
					(response) => {
						if (BrowserContext.runtime.lastError) {
							reject(new Error(BrowserContext.runtime.lastError.message));
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