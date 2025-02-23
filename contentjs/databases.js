const filesDatabase = (() => {
    const dbName = "FilesDB";
    const storeName = "files";

    // Функция для открытия базы данных
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Функция для выполнения операций с хранилищем
    function withStore(mode, callback) {
        return openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, mode);
                const store = transaction.objectStore(storeName);
                const request = callback(store);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    return {
        save(key, value) {
            return withStore("readwrite", store => store.put(value, key));
        },
        get(key) {
            return withStore("readonly", store => store.get(key));
        },
        remove(key) {
            return withStore("readwrite", store => store.delete(key));
        },
        clear() {
            return withStore("readwrite", store => store.clear());
        }
    };
})();
