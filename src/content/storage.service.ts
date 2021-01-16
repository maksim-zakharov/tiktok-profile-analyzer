/**
 * Возвращает данные из хранилища хрома
 * @param name Ключ значения
 * @returns Возвращает Promise с значением
 */
export let getItem = (name) => {
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
export let setItem = (name, value) => {
  if (!chrome?.storage) {
    return localStorage.setItem(name, value);
  }
  return new Promise((resolve: any) => {
    chrome.storage.sync.set({[name]: value}, resolve);
  });
}

/**
 * Реагирует на изменения значения в хранилище хрома
 * @param keyName Ключ значения
 * @param resolve Функция в случае окей
 * @param init Брать текущее значение или нет
 */
export let onChanged = async (keyName, resolve, init) => {
  if (!chrome?.storage) {
    return;
  }

  if (init) {
    return resolve(await getItem(keyName));
  }

  chrome.storage.onChanged.addListener((changes) => {
    for (let key in changes) {
      if (key === keyName) {
        return resolve(changes[keyName].newValue);
      }
    }
  });
}
