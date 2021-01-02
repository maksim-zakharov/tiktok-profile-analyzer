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

function setItem(name, value) {
    if (!chrome?.storage) {
        return localStorage.setItem(name, value);
    }
    return new Promise(resolve => {
        chrome.storage.sync.set({[name]: value}, data => {
            resolve(data);
            console.log(data);
        });
    });
}

function onChanged(keyName, resolve) {
    if (!chrome?.storage) {
        return;
    }
    chrome.storage.onChanged.addListener(function (changes) {
        for (key in changes) {
            if (key === keyName) {
                resolve(changes[keyName].newValue);
            }
        }
    });
}
