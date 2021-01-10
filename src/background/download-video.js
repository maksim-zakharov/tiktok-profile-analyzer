// background.js
const download = {
    async onDownload(tiktokURL) {
        const formData = new FormData();
        formData.append('url', tiktokURL);
        const options = {
            method: 'POST',
            body: formData,
            credentials: 'include',
        };
        const response = await fetch(`https://snaptik.app/action.php`, options);
        const text = await response.text();

        if (text.indexOf('error_token') !== -1) {
            console.error('РќРµС‚ СЋР·РµСЂ С‚РѕРєРµРЅР°, РєСѓРєРё');
            return false
        }

        return text.match(/<a .*n><\/a>/g).filter((item)=>{
            return item.indexOf('.tiktokcdn') !== -1 || item.indexOf('.akamaized') !== -1
        })[0].match(/href='.*'/)[0].replace(/href='/, '').replace(/'$/, '')
    },
    async onGetUser() {
        const formData = new FormData();
        const options = {
            method: 'POST',
            body: formData,
            credentials: 'include',
        };
        const response = await fetch(`https://snaptik.app/check_token.php`, options);
        const json = await response.json();

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
        ok && (
            result = await download.onDownload(tiktokURL)
        )
        if (result) {
            chrome.runtime.sendMessage( {
                cmd: 'onDownloadLink',
                links: {
                    outer: result,
                    inner: tiktokURL,
                },
                errorCounter,
            });
        }
    }
}

chrome.runtime.onMessage.addListener( ({ cmd , data}) => {
    switch (cmd) {
        case "download":
            return download.onController(data.tiktokURL, data.errorCounter)
    }
});
