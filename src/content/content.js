// import './storage.service'

var itemsDict = {};
var lastCursorDict = {};

if (!+localStorage.getItem('timeout')) {
    localStorage.setItem('timeout', 1000);
}

let isProfilePage = () => {
    return !!document.querySelector('meta[property="twitter:creator:id"]');
}

var tiktokParse = () => {
    if (!isProfilePage()) {
        // Мы не на странице профиля
        return;
    }

    createAnalyzeButton();

    const nick = document.querySelector('meta[property="twitter:creator:id"]').content;
    const loadedVideosCount = document.querySelectorAll('.video-feed-item-wrapper').length;
    const markedVideosCount = document.querySelectorAll('.video-feed-item-wrapper.marked').length;

    updateProfile(nick);

    if (lastCursorDict[nick] || itemsDict[nick] && loadedVideosCount <= markedVideosCount) {
        for (let i = 0; i < itemsDict[nick].length; i++) {
            const item = itemsDict[nick][i];

            const link = document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
            if (!link) {
                continue;
            }

            addItem(item, link);
        }

        document.querySelectorAll(`a[href^="https://www.tiktok.com/@${nick}/video/"]`).forEach(link => link.classList.add('marked'));
    }

    clearInterval(interval);
    interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))
};

var interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))

let addItem = async (item, link) => {
    if (link.getAttribute('data-ER')) {
        return;
    }
    link.setAttribute(`data-video_create-time`, item.createTime);

    await onChanged('video_Likes', enable => {
        if (!isProfilePage()) return;
        enable ? addLikes(link, item.stats.diggCount) : Array.from(document.querySelectorAll("[data-video_like]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)

    const firstContainer = document.createElement('strong');
    firstContainer.classList.add('jsx-1036923518');
    firstContainer.classList.add('video-bottom-info');
    link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar').appendChild(firstContainer);

    await onChanged('video_Shares', enable => {
        if (!isProfilePage()) return;
        enable ? addShare(link, item) : Array.from(document.querySelectorAll("[data-video_share]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)
    await onChanged('video_Comments', enable => {
        if (!isProfilePage()) return;
        enable ? addComment(link, item) : Array.from(document.querySelectorAll("[data-video_comment]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)
    await onChanged('video_ER', enable => {
        if (!isProfilePage()) return;
        enable ? addER(link, item) : Array.from(document.querySelectorAll("[data-video_ER]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)

    link.classList.add('marked');
}

let addLikes = (linkElement, likesCount) => {
    if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_like]')) {
        return;
    }
    const likesButton = document.createElement('strong');
    likesButton.classList.add('custom-like');
    likesButton.setAttribute(`data-video_like`, likesCount);

    const likesText = document.createElement('strong');
    likesText.classList.add('jsx-1036923518');
    likesText.innerText = likesCount;
    likesText.setAttribute(`data-video_like`, likesCount);

    linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesButton);
    linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesText);
}

let addShare = (linkElement, item) => {
    if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_share]')) {
        return;
    }
    const shareButton = document.createElement('svg');
    shareButton.classList.add('custom-share');
    shareButton.setAttribute(`data-video_share`, item.stats.shareCount);

    const shareText = document.createElement('strong');
    shareText.classList.add('jsx-1036923518');
    shareText.innerText = item.stats.shareCount;
    shareText.setAttribute(`data-video_share`, item.stats.shareCount);

    linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(shareButton);
    linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(shareText);
}

let addComment = (linkElement, item) => {
    if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_comment]')) {
        return;
    }
    const commentButton = document.createElement('strong');
    commentButton.classList.add('custom-comment');
    commentButton.setAttribute(`data-video_comment`, item.stats.commentCount);

    const commentText = document.createElement('strong');
    commentText.classList.add('jsx-1036923518');
    commentText.innerText = item.stats.commentCount;
    commentText.setAttribute(`data-video_comment`, item.stats.commentCount);

    linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(commentButton);
    linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(commentText);
}

let addER = (link, item) => {
    if (link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar [data-ER]')) {
        return;
    }
    const ERContainer = document.createElement('strong');
    ERContainer.classList.add('jsx-1036923518');
    ERContainer.classList.add('video-bottom-info');
    link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar').appendChild(ERContainer);

    const ERButton = document.createElement('svg');
    ERButton.classList.add('jsx-1036923518');
    ERButton.textContent = 'ER';
    ERContainer.appendChild(ERButton);

    const ERText = document.createElement('strong');
    ERText.classList.add('jsx-1036923518');

    const ER = ((item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount);
    ERText.innerText = ER.toFixed(2) + '%';
    ERContainer.appendChild(ERText);
    link.setAttribute('data-ER', ER);
    ERContainer.setAttribute(`data-video_ER`, ER);
}

let sortByCreationTime = (nick) => {
    var array = Array.from(document.querySelectorAll(`a[data-video_create-time]`))
    array = array.sort((a, b) => {
        if (+a.getAttribute('data-video_create-time') > +b.getAttribute('data-video_create-time')) {
            return -1;
        }
        if (+a.getAttribute('data-video_create-time') < +b.getAttribute('data-video_create-time')) {
            return 1;
        }
        // a должно быть равным b
        return 0;
    })
    array = array.map(link => link.closest('.video-feed-item.three-column-item'))
    array.forEach(e => document.querySelector(".video-feed.compact").appendChild(e));
}

let sortByER = () => {
    var array = Array.from(document.querySelectorAll(`a[data-ER]`))
    array = array.sort((a, b) => {
        if (+a.getAttribute('data-ER') > +b.getAttribute('data-ER')) {
            return -1;
        }
        if (+a.getAttribute('data-ER') < +b.getAttribute('data-ER')) {
            return 1;
        }
        // a должно быть равным b
        return 0;
    })
    array = array.map(link => link.closest('.video-feed-item.three-column-item'))
    array.forEach(e => document.querySelector(".video-feed.compact").appendChild(e));
}

let convertNumberToString = (number) => {

    let round = (num) => Math.round(num * 10) / 10;

    let result = '';
    if (number > 1000000000) {
        result = `${round(number / 1000000000)}B`
    } else if (number > 1000000) {
        result = `${round(number / 1000000)}M`
    } else if (number > 1000) {
        result = `${round(number / 1000)}K`
    } else {
        result = number;
    }
    return result;
}

let addAverageERPerVideo = (nick, dataTag, row, name) => {

    let avgER = 0;
    if (itemsDict[nick]?.length) {
        const fnER = (item) => (item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount;

        avgER = (itemsDict[nick].reduce((acc, item) => acc + fnER(item), 0) / itemsDict[nick].length).toFixed(2) + '%';
    }

    let container = getOrCreateContainer(row);
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, avgER);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = name;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = avgER;
    numberCountLabel.setAttribute(`${dataTag}`, avgER);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageVideoCountPerDay = (nick, dataTag, row, name) => {
    let counter = 0;
    if (itemsDict[nick]?.length) {
        const minTime = itemsDict[nick].reduce((acc, val) => {
            return acc < val.createTime ? acc : val.createTime;
        })

        const maxTime = itemsDict[nick].reduce((acc, val) => {
            return acc > val.createTime ? acc : val.createTime;
        })

        const diffInMs = new Date(maxTime * 1000) - new Date(minTime * 1000)
        counter = (diffInMs / (1000 * 60 * 60 * 24 * itemsDict[nick].length)).toFixed(2);
    }

    let container = getOrCreateContainer(row);
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, counter);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = name;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = counter;
    numberCountLabel.setAttribute(`${dataTag}`, counter);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageCreatedTimePerVideo = (nick, dataTag, row, name) => {
    let counter = 0;
    if (itemsDict[nick]?.length) {
        counter = (itemsDict[nick].reduce((acc, curr) => {
            const date = new Date(curr.createTime * 1000);
            date.setFullYear(2000, 1, 1);
            return acc + date.getTime()
        }, 0) / itemsDict[nick].length);

        counter = new Date(counter).toLocaleTimeString();
    }

    let container = getOrCreateContainer(row);
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, counter);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = name;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = counter;
    numberCountLabel.setAttribute(`${dataTag}`, counter);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageCounterPerVideo = (nick, dataTag, fieldName, row, name) => {
    let counter = 0;
    if (itemsDict[nick]?.length) {
        counter = (itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0) / itemsDict[nick].length).toFixed(1);
    }

    let container = getOrCreateContainer(row);
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, convertNumberToString(counter));

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = name;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = convertNumberToString(counter);
    numberCountLabel.setAttribute(`${dataTag}`, convertNumberToString(counter));

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
}

let addViewsCount = (nick, dataTag, fieldName, row, name) => {

    let counter = 0;
    if (itemsDict[nick]?.length) {
        counter = itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0);
    }

    let container = getOrCreateContainer(row);

    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, convertNumberToString(counter));

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = name;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = convertNumberToString(counter);
    numberCountLabel.setAttribute(`${dataTag}`, convertNumberToString(counter));

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
}

let updateProfile = async (nick) => {

    await onChanged('profile_Views', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addViewsCount(nick, "data_views", "playCount", "tt-analytic-1", chrome.i18n.getMessage('data_views'))
        } else {
            var elem = document.querySelector("[data_views]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Shares', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addViewsCount(nick, "data_shares", "shareCount", "tt-analytic-1", chrome.i18n.getMessage('data_shares'));
        } else {
            var elem = document.querySelector("[data_shares]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Comments', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addViewsCount(nick, "data_comments", "commentCount", "tt-analytic-1", chrome.i18n.getMessage('data_comments'));
        } else {
            var elem = document.querySelector("[data_comments]");
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_views', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageCounterPerVideo(nick, "data_avg_views", "playCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_views'));
        } else {
            var elem = document.querySelector("[data_avg_views]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_shares', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageCounterPerVideo(nick, "data_avg_shares", "shareCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_shares'));
        } else {
            var elem = document.querySelector("[data_avg_shares]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_comments', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageCounterPerVideo(nick, "data_avg_comments", "commentCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_comments'));
        } else {
            var elem = document.querySelector("[data_avg_comments]");
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_ER', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageERPerVideo(nick, "data_avg_er", "tt-analytic-2", chrome.i18n.getMessage('data_avg_er'));
        } else {
            var elem = document.querySelector("[data_avg_er]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_created_time', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageCreatedTimePerVideo(nick, "data_avg_created_time", "tt-analytic-2", chrome.i18n.getMessage('data_avg_created_time'));
        } else {
            var elem = document.querySelector("[data_avg_created_time]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await onChanged('profile_Average_videos_per_day', enable => {
        if (!isProfilePage()) return;
        if (enable) {
            addAverageVideoCountPerDay(nick, "data_avg_videos_per_day", "tt-analytic-2", chrome.i18n.getMessage('data_avg_videos_per_day'));
        } else {
            var elem = document.querySelector("[data_avg_videos_per_day]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
}

/**
 * Создает кнопку для анализа профиля
 */
function createAnalyzeButton() {
    if (document.querySelector('[data_content_start_analyzing]')) {
        return;
    }
    const button = document.createElement('button')
    button.classList.add('follow-button');
    button.classList.add('jsx-3251180706');
    button.classList.add('jsx-683523640');
    button.classList.add('share-follow');
    button.classList.add('tiktok-btn-pc');
    button.classList.add('tiktok-btn-pc-medium');
    button.classList.add('tiktok-btn-pc-primary');
    button.setAttribute('data_content_start_analyzing', 'button');
    document.querySelector('.share-title-container').appendChild(button);
    button.textContent = chrome.i18n.getMessage('content_start_analyzing');
    button.addEventListener('click', analyzeProfile);
}

/**
 * Анализирует текущий профиль, запрашивая все видосы по API, обновляет каунтеры
 */
async function analyzeProfile() {
    document.querySelector('[data_content_start_analyzing]').setAttribute('disabled', 'disabled');
    document.querySelector('[data_content_start_analyzing]').innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;

    if (!isProfilePage()) {
        // Мы не на странице профиля
        return;
    }

    const nick = document.querySelector('meta[property="twitter:creator:id"]').content;

    let lastCursor;

    const meta = document.querySelector('meta[property="al:ios:url"]').content;
    const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
    const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];

    if (!itemsDict[nick] || !itemsDict[nick].length) {
        lastCursor = new Date().getTime() * 1000;
        itemsDict[nick] = [];
    } else {
        const minTime = itemsDict[nick].reduce((acc, val) => {
            return acc < val.createTime ? acc : val.createTime;
        })
        lastCursor = minTime * 1000;
    }

    let response;
    do {
        response = await getRequestAsync(`https://m.tiktok.com/api/item_list/?count=30&id=${tagId}&maxCursor=${lastCursor}&minCursor=0&sourceType=8`)

        if (!response.items) {
            break;
        }

        itemsDict[nick].push(...response.items);

        if (!itemsDict[nick] || !itemsDict[nick].length) {
            lastCursor = new Date().getTime() * 1000;
            itemsDict[nick] = [];
        } else {
            const minTime = itemsDict[nick].reduce((acc, val) => {
                return acc < val.createTime ? acc : val.createTime;
            })
            lastCursor = minTime * 1000;
        }

        lastCursorDict[nick] = lastCursor;
    } while (response.hasMore)

    for (let i = 0; i < itemsDict[nick].length; i++) {
        const item = itemsDict[nick][i];

        const link = document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
        if (!link) {
            continue;
        }

        addItem(item, link);
    }

    await onChanged('video_Sort_by_ER', enable => {
        if (!isProfilePage()) return;
        enable ? sortByER() : sortByCreationTime(nick);
    }, true)

    updateProfile(nick)

    document.querySelector('[data_content_start_analyzing]').removeAttribute('disabled');
    document.querySelector('[data_content_start_analyzing]').innerHTML = chrome.i18n.getMessage('content_start_analyzing');
}

/**
 * Делает GET запрос
 * @param url URL запроса
 */
let getRequestAsync = (url) => {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    return new Promise((resolve, reject) => {
        xhr.responseType = 'json';

        xhr.onload = () => resolve(xhr.response);

        xhr.onerror = reject;

        xhr.send();
    })
}

/**
 * Возвращает контейнер под каунтеры профиля или создает его, если еще не создан
 * @param name Название контейнера
 * @returns {Element}
 */
let getOrCreateContainer = (name) => {
    let container = document.querySelector(`.count-infos.${name}`)
    if (!container) {
        const shareHeader = document.querySelector('.share-layout-header.share-header');
        container = document.createElement('h2');
        shareHeader.insertBefore(container, document.querySelector('.share-desc'));
        container.classList.add('count-infos');
        container.classList.add(name);
    }

    return container;
}

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
            console.log(data);
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
