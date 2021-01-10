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
      localStorage.setItem('onDownloadLink', JSON.stringify({
        outer: result,
        inner: tiktokURL,
      }))
    }
  }
}

chrome.runtime.onMessage.addListener(({cmd, data}) => {
  switch (cmd) {
    case "download":
      download.onController(data.tiktokURL, data.errorCounter)
  }
});
