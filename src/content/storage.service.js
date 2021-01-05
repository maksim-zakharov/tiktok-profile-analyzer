/**
 * Возвращает данные из хранилища хрома
 * @param name Ключ значения
 * @returns Возвращает Promise с значением
 */
function getItem(name) {
    if (!chrome?.storage) {
        return localStorage.getItem(name);
    }
    return new Promise(resolve => {
        chrome.storage.sync.get(name, data => {
            resolve(data[name]);
        });
    });
}

/**
 * Возвращает данные из хранилища хрома
 * @param name Ключ значения
 * @param value Значение
 */
function setItem(name, value) {
    if (!chrome?.storage) {
        return localStorage.setItem(name, value);
    }
    return new Promise(resolve => {
        chrome.storage.sync.set({[name]: value}, data => {
            resolve(data);
        });
    });
}

/**
 * Реагирует на изменения значения в хранилище хрома
 * @param keyName Ключ значения
 * @param resolve Функция в случае окей
 * @param init Брать текущее значение или нет
 */
async function onChanged(keyName, resolve, init) {
    if (!chrome?.storage) {
        return;
    }

    if (init) {
        resolve(await getItem(keyName));
    }

    chrome.storage.onChanged.addListener(function (changes) {
        for (key in changes) {
            if (key === keyName) {
                resolve(changes[keyName].newValue);
            }
        }
    });
}

module.exports = {getItem, setItem, onChanged}
