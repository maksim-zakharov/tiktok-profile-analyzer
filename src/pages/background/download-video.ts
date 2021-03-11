// background.js
import axios from "axios";

export const download = {
  async onDownload(tiktokURL) {
    const formData = new FormData();
    formData.append('url', tiktokURL);

    const response = await axios.post(`https://snaptik.app/action.php`, formData, {withCredentials: true});
    const text = await response.data;

    if (text.indexOf('error_token') !== -1) {
      console.error('РќРµС‚ СЋР·РµСЂ С‚РѕРєРµРЅР°, РєСѓРєРё');
      return false
    }

    return text.match(/<a .*n><\/a>/g)
      .filter((item) => item.indexOf('.tiktokcdn') !== -1 || item.indexOf('.akamaized') !== -1)[0]
      .match(/href='.*'/)[0]
      .replace(/href='/, '')
      .replace(/'$/, '')
  },
  async onGetUser() {
    const formData = new FormData();
    const response = await axios.post(`https://snaptik.app/check_token.php`, formData, {
      responseType: "json",
      withCredentials: true
    });
    const json = await response.data;

    if (json && json.status && json.status === '100') {
      console.log('РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РїРѕР»СѓС‡РµРЅ')
      return true;
    } else {
      console.log('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ')
      return false;
    }
  },
  async onController(tiktokURL, errorCounter = 0) {
    let result = false;
    let ok = await download.onGetUser();
    if (ok) (
      result = await download.onDownload(tiktokURL)
    )
    if (result) {
      chrome.tabs.sendMessage(tabId, {
        'cmd': 'onDownloadLink',
        links: {
          outer: result,
          inner: tiktokURL,
        },
        errorCounter,
      });
    }
  }
}
let tabId;
chrome.runtime.onMessage.addListener(function ({cmd, data}, sender, sendResponse) {
  chrome.tabs.query({active: true, currentWindow: true}, async function (tabs) {
    if (sender?.url?.indexOf('chrome-extension:') === -1) {
      if (tabs.length < 1) {
        console.error("no select tab");
        chrome.runtime.sendMessage({cmd: "popup_error", result: {"status": -1, "msg": "Please Select One Tab."}});
        return;
      }
      let current_tab = tabs[0];
      let tab_url = current_tab['url'];
      let tab_title = current_tab['title'];
      tabId = current_tab.id;
      console.log('tabId', tabId);
    }

    switch (cmd) {
      case "download":
        download.onController(data.tiktokURL, data.errorCounter)
        break;
    }
  });
});
