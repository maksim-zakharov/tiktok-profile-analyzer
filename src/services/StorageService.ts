import { ProfileVideo } from "@services/ApiService";

export default {
  itemsDict: {} as {
    [id: string]: ProfileVideo[]
  },
  lastCursorDict: {} as {
    [id: string]: string
  },
  /**
   * Возвращает данные из хранилища хрома
   * @param name Ключ значения
   * @returns Возвращает Promise с значением
   */
  getItem(name): Promise<string> | string | null {
    if (!chrome?.storage) {
      return localStorage.getItem(name);
    }
    return new Promise(resolve => {
      chrome.storage.sync.get(name, data => {
        resolve(data[name]);
      });
    });
  },

  /**
   * Возвращает данные из хранилища хрома
   * @param name Ключ значения
   * @param value Значение
   */
  setItem(name, value): Promise<string> | void {
    if (!chrome?.storage) {
      return localStorage.setItem(name, value);
    }
    return new Promise(resolve => {
      // @ts-ignore
      chrome.storage.sync.set({[name]: value}, data => {
        resolve(data);
      });
    });
  },

  /**
   * Реагирует на изменения значения в хранилище хрома
   * @param keyName Ключ значения
   * @param resolve Функция в случае окей
   * @param init Брать текущее значение или нет
   */
  async onChanged(keyName, resolve, init) {
    if (!chrome?.storage) {
      return;
    }

    if (init) {
      resolve(await this.getItem(keyName));
    }

    chrome.storage.onChanged.addListener(function (changes) {
      for (let key in changes) {
        if (key === keyName) {
          resolve(changes[keyName].newValue);
        }
      }
    });
  }
}
