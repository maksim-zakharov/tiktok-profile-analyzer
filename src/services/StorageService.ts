import { ProfileVideo } from "@services/ApiService";
import storageService from "@services/StorageService";
import Tab = chrome.tabs.Tab;

const listeners: { [storageKey: string]: ((videoItems: ProfileVideo[]) => any)[] } = {};

export default {

  itemsDict: {} as {
    [id: string]: ProfileVideo[]
  },
  lastCursorDict: {} as {
    [id: string]: string
  },

  getVideoItems(nick) {
    if (!storageService.itemsDict[nick]) {
      storageService.itemsDict[nick] = [];
    }

    return storageService.itemsDict[nick];
  },

  getCurrentTab(): Promise<Tab | undefined> {
    return new Promise(resolve => {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        resolve(tabs[0]);
      });
    });
  },

  saveProfileVideos: async (nick, videoItems: ProfileVideo[]) => {

    const tab = await storageService.getCurrentTab();
    if (!tab) {
      return;
    }

    storageService.getVideoItems(nick).push(...videoItems);

    chrome.runtime.sendMessage(`${tab.id}`, {
      action: "onStorage",
      data: {storageKey: `videoItems_${nick}`, videoItems}
    });

    storageService.fireListeners(`videoItems_${nick}`, storageService.itemsDict[nick]);
  },

  addListener: async (storageKey: string, listener: (videoItems: ProfileVideo[]) => void) => {
    if (!listeners[storageKey]) {
      listeners[storageKey] = [];
    }
    const currentTab = await storageService.getCurrentTab();

    listeners[storageKey].push(listener);

    chrome.runtime.onMessage.addListener(function ({action, data: {videoItems}}, {tab}) {
      console.log(action, tab?.id, currentTab?.id)
      if (action === 'onStorage' && currentTab?.id === tab?.id) {
        listener(videoItems);
      }
    });
  },

  fireListeners: (storageKey, videoItems: ProfileVideo[]) => {
    listeners[storageKey]?.forEach(listener => listener(videoItems));
  },

  removeListener: (storageKey, listener: () => any) => {
    listeners[storageKey] = listeners[storageKey]?.filter(existListener => existListener !== listener);
  },
  /**
   * Возвращает данные из хранилища хрома
   * @param name Ключ значения
   * @returns Возвращает Promise с значением
   */
  getItem(name): Promise<string | null> {
    if (!chrome?.storage) {
      return Promise.resolve(localStorage.getItem(name));
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
  onChanged(keyName: string, resolve: (newValue) => void, init: boolean): { removeListener: (handle) => void, handle: (changes) => void } {
    if (!chrome?.storage) {
      return {
        removeListener: () => {
        }, handle: () => {
        }
      };
    }

    if (init) {
      this.getItem(keyName).then(resolve);
    }

    const handle = function (changes) {
      for (let key in changes) {
        if (key === keyName) {
          resolve(changes[keyName].newValue);
        }
      }
    };

    chrome.storage.onChanged.addListener(handle);

    return {removeListener: chrome.storage.onChanged.removeListener, handle};
  }
}
