const IDBSettings = {
	DB_NAME: "HWCacheDB",
	DB_VERSION: 1,
	STORE_NAME: "kv",

	_dbPromise: null,

	_openDB() {
		if (this._dbPromise) return this._dbPromise;

		this._dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(this.STORE_NAME)) {
					db.createObjectStore(this.STORE_NAME, { keyPath: "key" });
				}
			};

			request.onsuccess = (event) => resolve(event.target.result);
			request.onerror = (event) => reject(event.target.error);
			request.onblocked = () => reject(new Error("IndexedDB open blocked"));
		});

		return this._dbPromise;
	},

	async _tx(mode) {
		const db = await this._openDB();
		const tx = db.transaction(this.STORE_NAME, mode);
		return { tx, store: tx.objectStore(this.STORE_NAME) };
	},

	async get(key, defValue) {
		const { store } = await this._tx("readonly");
		return new Promise((resolve, reject) => {
			const req = store.get(key);
			req.onsuccess = () => {
				resolve(req.result === undefined ? defValue : req.result.value);
			};
			req.onerror = () => reject(req.error);
		});
	},

	async set(key, value) {
		const { tx, store } = await this._tx("readwrite");
		return new Promise((resolve, reject) => {
			store.put({ key, value });
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	},

	async delete(key) {
		const { tx, store } = await this._tx("readwrite");
		return new Promise((resolve, reject) => {
			store.delete(key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	},

	async clear() {
		const { tx, store } = await this._tx("readwrite");
		return new Promise((resolve, reject) => {
			store.clear();
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	},

	async isKeyExists(key) {
		const { store } = await this._tx("readonly");
		return new Promise((resolve, reject) => {
			const req = store.getKey(key);
			req.onsuccess = () => resolve(req.result !== undefined);
			req.onerror = () => reject(req.error);
		});
	},

	async getAll() {
		const { store } = await this._tx("readonly");
		return new Promise((resolve, reject) => {
			const req = store.getAll();
			req.onsuccess = () => {
				const result = {};
				for (const row of req.result) result[row.key] = row.value;
				resolve(result);
			};
			req.onerror = () => reject(req.error);
		});
	},


	async ensureUID(uid) {
		const existing = await this.get(uid);
		if (existing) return existing;
		const fresh = { data: {} };
		await this.set(uid, fresh);
		return fresh;
	},

	async setUIDData(uid, data) {
		const entry = await this.ensureUID(uid);
		entry.data = { ...entry.data, ...data };
		await this.set(uid, entry);
		return entry;
	},

	// --- HWID-кэш ---
	// Раньше все URL одного uid ("HWC") хранились ВЛОЖЕННО в один общий
	// документ (entry.HWS[hwidName]), и setHWID делал read-modify-write
	// всего документа. При параллельной обработке нескольких ДЗ
	// (teacher/student разных заданий одновременно) это давало классическую
	// гонку: два setHWID читали один и тот же документ, и кто записывал
	// вторым - затирал изменения первого (в частности, часто пропадал кэш
	// именно для teach_url).
	//
	// Теперь каждая пара (uid, hwidName) - это отдельная запись в
	// IndexedDB под составным ключом, так что записи разных URL друг друга
	// не перезатирают.
	_hwidKey(uid, hwidName) {
		return `${uid}::HW::${hwidName}`;
	},

	async setHWID(uid, hwidName, { displayAs = "text", content = "" } = {}) {
		const value = { displayAs, content };
		await this.set(this._hwidKey(uid, hwidName), value);
		return value;
	},

	async getHWID(uid, hwidName) {
		return await this.get(this._hwidKey(uid, hwidName), undefined);
	},

	async deleteHWID(uid, hwidName) {
		await this.delete(this._hwidKey(uid, hwidName));
	},

	async getAllHWS(uid) {
		const all = await this.getAll();
		const prefix = `${uid}::HW::`;
		const result = {};
		for (const key of Object.keys(all)) {
			if (key.startsWith(prefix)) {
				result[key.slice(prefix.length)] = all[key];
			}
		}
		return result;
	},

	async deleteUID(uid) {
		await this.delete(uid);
		// заодно чистим все HWID-записи, привязанные к этому uid
		const hws = await this.getAllHWS(uid);
		for (const hwidName of Object.keys(hws)) {
			await this.deleteHWID(uid, hwidName);
		}
	},



	registerBridge() {
		if (this._bridgeRegistered) return;
		this._bridgeRegistered = true;
		console.log("[bridge] registerBridge() called");

		const ALLOWED_METHODS = new Set([
			"get", "set", "delete", "clear", "isKeyExists", "getAll",
			"ensureUID", "setUIDData", "setHWID", "getHWID",
			"deleteHWID", "getAllHWS", "deleteUID",
		]);

		chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			if (!msg || msg.__idbBridge !== true) {
				return false;
			}

			const { method, args = [] } = msg;

			if (!ALLOWED_METHODS.has(method) || typeof this[method] !== "function") {
				sendResponse({ ok: false, error: `Unknown IDBSettings method: ${method}` });
				return false;
			}

			console.log("[bridge] calling method:", method, "with args:", args);
			this[method](...args)
				.then((result) => {
					console.log("[bridge] resolved:", result);
					sendResponse({ ok: true, result });
				})
				.catch((err) => {
					console.log("[bridge] rejected:", err);
					sendResponse({ ok: false, error: String(err?.message ?? err) });
				});

			return true;
		});
	},
};

export default IDBSettings;