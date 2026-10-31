// THIS File running in background script
const BrowserContext = typeof chrome !== "undefined" ? chrome : browser;


const IDBSettings = {
	DB_NAME: "HWCacheDB",
	DB_VERSION: 2,
	STORE_NAME: "kv2",
	OLD_STORE_NAME: "kv",

	_dbPromise: null,

	_openDB() {
		if (this._dbPromise) return this._dbPromise;

		this._dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				const tx = event.target.transaction;

				if (!db.objectStoreNames.contains(this.STORE_NAME)) {
					db.createObjectStore(this.STORE_NAME);
				}


				if (db.objectStoreNames.contains(this.OLD_STORE_NAME)) {
					const oldStore = tx.objectStore(this.OLD_STORE_NAME);
					const newStore = tx.objectStore(this.STORE_NAME);
					oldStore.openCursor().onsuccess = (e) => {
						const cursor = e.target.result;
						if (cursor) {
							newStore.put(cursor.value.value, cursor.value.key);
							cursor.continue();
						} else {
							db.deleteObjectStore(this.OLD_STORE_NAME);
						}
					};
				}
			};

			request.onsuccess = (event) => {
				const db = event.target.result;
				db.onversionchange = () => db.close();
				resolve(db);
			};
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
			req.onsuccess = () => resolve(req.result === undefined ? defValue : req.result);
			req.onerror = () => reject(req.error);
		});
	},
	
	async _getMaxBytes() {
		const BC = BrowserContext;
		const res = await new Promise(r => BC.storage.local.get("MaxCacheSize", r));
		const mb = Number(res.MaxCacheSize);
		return Number.isFinite(mb) && mb > 0 ? mb * 1024 * 1024 : 0;
	},

	async set(key, value) {
		const { tx, store } = await this._tx("readwrite");
		return new Promise((resolve, reject) => {
			store.put(value, key);
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
			const keysReq = store.getAllKeys();
			const valsReq = store.getAll();
			valsReq.onsuccess = () => {
				const result = {};
				keysReq.result.forEach((k, i) => (result[k] = valsReq.result[i]));
				resolve(result);
			};
			valsReq.onerror = () => reject(valsReq.error);
		});
	},

	_sizeOf(key, value) {
		const enc = (this._enc ??= new TextEncoder());
		let bytes = enc.encode(String(key)).length;
		if (value instanceof Blob) bytes += value.size;
		else if (value instanceof ArrayBuffer) bytes += value.byteLength;
		else bytes += enc.encode(JSON.stringify(value) ?? "").length;
		return bytes;
	},

	async getSize() {
		const { store } = await this._tx("readonly");
		return new Promise((resolve, reject) => {
			let bytes = 0, count = 0;
			const req = store.openCursor();
			req.onsuccess = (e) => {
				const cursor = e.target.result;
				if (!cursor) {
					resolve({ count, kb: +(bytes / 1024).toFixed(2) });
					return;
				}
				bytes += this._sizeOf(cursor.key, cursor.value);
				count++;
				cursor.continue();
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


	async deleteExpired(days = 3) {
		const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
		const { tx, store } = await this._tx("readwrite");

		return new Promise((resolve, reject) => {
			let deleted = 0;
			const req = store.openCursor();

			req.onsuccess = (e) => {
				const cursor = e.target.result;
				if (!cursor) return;

				const d = cursor.value?.date;
				const ts = d == null ? NaN : new Date(d).getTime();

				if (!Number.isNaN(ts) && ts <= threshold) {
					cursor.delete();
					deleted++;
				}
				cursor.continue();
			};

			req.onerror = () => reject(req.error);
			tx.oncomplete = () => resolve(deleted);
			tx.onerror = () => reject(tx.error);
			tx.onabort = () => reject(tx.error);
		});
	},


	_hwidKey(uid, hwidName) {
		return `${uid}::HW::${hwidName}`;
	},
	
	async _putWithEviction(key, value, maxBytes) {
		const { tx, store } = await this._tx("readwrite");

		return new Promise((resolve, reject) => {
			const newSize = this._sizeOf(key, value);
			let total = 0;
			let oldSizeOfKey = 0;
			const candidates = [];

			const req = store.openCursor();
			req.onsuccess = (e) => {
				const cursor = e.target.result;

				if (cursor) {
					const size = this._sizeOf(cursor.key, cursor.value);
					total += size;

					if (cursor.key === key) {
						oldSizeOfKey = size;
					} else {
						const d = cursor.value?.date;
						const ts = d == null ? NaN : new Date(d).getTime();
						if (!Number.isNaN(ts)) candidates.push({ key: cursor.key, size, ts });
					}
					cursor.continue();
					return;
				}

				if (newSize > maxBytes) {
					console.warn(`[cache] entry (${newSize} B) is bigger than MaxCacheSize (${maxBytes} B)`);
				}

				let need = total - oldSizeOfKey + newSize - maxBytes;
				if (need > 0) {
					candidates.sort((a, b) => a.ts - b.ts);
					for (const c of candidates) {
						if (need <= 0) break;
						store.delete(c.key);
						need -= c.size;
					}
					if (need > 0) {
						console.warn("[cache] not enough evictable entries, cache is still over limit");
					}
				}

				store.put(value, key);
			};

			req.onerror = () => reject(req.error);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
			tx.onabort = () => reject(tx.error);
		});
	},

	async setHWID(uid, hwidName, { displayAs = "text", content = "", type } = {}) {
		const value = { displayAs, content, date: new Date() };

		if (type !== undefined && type !== null) {
			value.type = type;
		}

		const key = this._hwidKey(uid, hwidName);

		const maxBytes = await this._getMaxBytes();
		if (maxBytes > 0) {
			await this._putWithEviction(key, value, maxBytes);
		} else {
			await this.set(key, value);
		}
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
		const hws = await this.getAllHWS(uid);
		for (const hwidName of Object.keys(hws)) {
			await this.deleteHWID(uid, hwidName);
		}
	},



	registerBridge() {
		if (this._bridgeRegistered) return;
		this._bridgeRegistered = true;

		const ALLOWED_METHODS = new Set([
			"get", "set", "delete", "clear", "isKeyExists", "getAll",
			"ensureUID", "setUIDData", "setHWID", "getHWID",
			"deleteHWID", "getAllHWS", "deleteUID", "getSize",
			"deleteExpired"
		]);

		BrowserContext.runtime.onMessage.addListener((msg, sender, sendResponse) => {
			if (!msg || msg.__idbBridge !== true) {
				return false;
			}

			const { method, args = [] } = msg;

			if (!ALLOWED_METHODS.has(method) || typeof this[method] !== "function") {
				sendResponse({ ok: false, error: `Unknown IDBSettings method: ${method}` });
				return false;
			}

			this[method](...args)
				.then((result) => {
					sendResponse({ ok: true, result });
				})
				.catch((err) => {
					sendResponse({ ok: false, error: String(err?.message ?? err) });
				});

			return true;
		});
	},
};

export default IDBSettings;