const Settings = {
	  get(key, defValue) {
		return new Promise(resolve => {
		  chrome.storage.local.get(key, res => {
			if (res[key] === undefined) {resolve(defValue); return}
			resolve(res[key]);
		  });
		});
	  },

	  set(key, value) {
		return new Promise(resolve => {
		  chrome.storage.local.set({ [key]: value }, resolve);
		  notifySettingsChange();
		});
	  },

	  delete(key) {
		return new Promise(resolve => {
		    chrome.storage.local.remove(key, resolve);
		    notifySettingsChange();
		});
	  },

	  clear() {
		return new Promise(resolve => {
		    chrome.storage.local.clear(resolve);
			notifySettingsChange();
		});
	  },

	  async isKeyExists(key) {
		return new Promise(resolve => {
		  chrome.storage.local.get(key, res => {
			resolve(Object.prototype.hasOwnProperty.call(res, key));
		  });
		});
	  },
	  
	  getAll() {
		return new Promise(resolve => {
		  chrome.storage.local.get(null, res => {
			resolve(res);
		  });
		});
	  } 
	};
	
	
async function clearIndexedDB(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = (event) => reject(request.error);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const storeNames = Array.from(db.objectStoreNames);

      if (storeNames.length === 0) {
        db.close();
        return resolve();
      }

      const transaction = db.transaction(storeNames, 'readwrite');

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = (event) => {
        db.close();
        reject(transaction.error);
      };

      storeNames.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        store.clear();
      });
    };
  });
}
