import {downloadCsv} from '../content/utility';
import apiService from '@services/ApiService';
import counterService from '@services/CounterService'
import storageService from '@services/StorageService';

if (!+localStorage.getItem('timeout')) {
    localStorage.setItem('timeout', 1000);
}

let getProfilePage = () => {
    return document.querySelector('meta[property="twitter:creator:id"]')?.content;
}

let getTagPage = () => {
    const meta = document.querySelector('meta[property="al:ios:url"][content*="snssdk1233://challenge"]');
    if (!meta) {
        return undefined;
    }

    const url1 = new URL(`https://tiktok.com/${meta.getAttribute('content').replace('snssdk1233://', '')}`);
    const tagId = url1.pathname?.split('/')[url1.pathname?.split('/').length - 1];
    if (tagId === 'feed') {
        return undefined;
    }

    return +tagId;
}

var tiktokParse = async () => {
    const tag = getTagPage();
    const nick = getProfilePage();
    if (nick) {

        createAnalyzeButton();

        createCsvButton();

        const loadedVideosCount = document.querySelectorAll('.video-feed-item-wrapper').length;
        const markedVideosCount = document.querySelectorAll('.video-feed-item-wrapper.marked').length;

        updateProfile(nick);

        if (storageService.lastCursorDict[nick] || storageService.itemsDict[nick] && loadedVideosCount <= markedVideosCount) {
            for (let i = 0; i < storageService.itemsDict[nick].length; i++) {
                const item = storageService.itemsDict[nick][i];

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
    }

    if (tag) {
        createAnalyzeButton();

        createCsvButton();

        const loadedVideosCount = document.querySelectorAll('.video-feed-item-wrapper').length;
        const markedVideosCount = document.querySelectorAll('.video-feed-item-wrapper.marked').length;

        updateProfile(tag);

        if (storageService.lastCursorDict[tag] || storageService.itemsDict[tag] && loadedVideosCount <= markedVideosCount) {
            for (let i = 0; i < storageService.itemsDict[tag].length; i++) {
                const item = storageService.itemsDict[tag][i];

                const link = document.querySelector(`a[href*="/video/${item.id}"]`)
                if (!link) {
                    continue;
                }

                addItem(item, link);
            }

            document.querySelectorAll(`a[href^="https://www.tiktok.com/@"]`).forEach(link => link.classList.add('marked'));
        }

        clearInterval(interval);
        interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))
    }
};

var interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))

let addItem = async (item, link) => {
    // if (link.getAttribute('data-ER')) {
    //     return;
    // }
    link.setAttribute(`data-video_create-time`, item.createTime);

    let footer = link.querySelector('.card-footer.normal.no-avatar');
    if (!footer) {
        footer = document.createElement('div');
        footer.classList.add('jsx-1036923518');
        footer.classList.add('card-footer');
        footer.classList.add('normal');
        footer.classList.add('no-avatar');
        link.querySelector('.video-card-mask')?.appendChild(footer);
    }
    let firstContainer = link.querySelector('strong.video-bottom-info');
    if (!firstContainer) {
        firstContainer = document.createElement('strong');
        firstContainer.classList.add('jsx-1036923518');
        firstContainer.classList.add('video-bottom-info');
        footer.appendChild(firstContainer);
    }
    let secondContainer = link.querySelector('.video-bottom-info:first-of-type + .video-bottom-info');
    if (!secondContainer) {
        secondContainer = document.createElement('strong');
        secondContainer.classList.add('jsx-1036923518');
        secondContainer.classList.add('video-bottom-info');
        footer.appendChild(secondContainer);
    }

    await storageService.onChanged('video_Views', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? counterService.addViews(link, item.stats.playCount) : Array.from(document.querySelectorAll("[data-video_views]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)

    await storageService.onChanged('video_Likes', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? counterService.addLikes(link, item.stats.diggCount) : Array.from(document.querySelectorAll("[data-video_like]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)

    await storageService.onChanged('video_Shares', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? counterService.addShare(link, item) : Array.from(document.querySelectorAll("[data-video_share]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)
    await storageService.onChanged('video_Comments', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? counterService.addComment(link, item) : Array.from(document.querySelectorAll("[data-video_comment]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)
    await storageService.onChanged('video_ER', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? counterService.addER(link, item) : Array.from(document.querySelectorAll("[data-video_ER]")).map(elem => elem?.parentNode.removeChild(elem));
    }, true)

    link.classList.add('marked');
}

let sortByCreationTime = () => {
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
    array.forEach(e => document.querySelector(".video-feed.compact")?.appendChild(e));
}

let sortByER = () => {
    var array = Array.from(document.querySelectorAll(`a[href*="/video/"]`))
    array = array.sort((a, b) => {
        if (!b.getAttribute('data-ER') || +a.getAttribute('data-ER') > +b.getAttribute('data-ER')) {
            return -1;
        }
        if (!a.getAttribute('data-ER') || +a.getAttribute('data-ER') < +b.getAttribute('data-ER')) {
            return 1;
        }
        // a должно быть равным b
        return 0;
    })
    array = array.map(link => link.closest('.video-feed-item.three-column-item'))
    array.forEach(e => document.querySelector(".video-feed.compact")?.appendChild(e));
}

let updateProfile = async (nick) => {

    await storageService.onChanged('profile_Views', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addViewsCount(nick, "data_views", "playCount", "tt-analytic-1", chrome.i18n.getMessage('data_views'))
        } else {
            var elem = document.querySelector("[data_views]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_videos', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addVideosCount(nick, "data_videos", "tt-analytic-1", chrome.i18n.getMessage('data_videos'))
        } else {
            var elem = document.querySelector("[data_videos]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)

    await storageService.onChanged('profile_Shares', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addViewsCount(nick, "data_shares", "shareCount", "tt-analytic-1", chrome.i18n.getMessage('data_shares'));
        } else {
            var elem = document.querySelector("[data_shares]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Comments', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addViewsCount(nick, "data_comments", "commentCount", "tt-analytic-1", chrome.i18n.getMessage('data_comments'));
        } else {
            var elem = document.querySelector("[data_comments]");
            elem?.parentNode.removeChild(elem)
        }
    }, true)

    await storageService.onChanged('profile_rating_likes', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addRatingPerViews(nick, "data_rating_likes", "diggCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_likes'));
        } else {
            var elem = document.querySelector("[data_rating_likes]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)

    await storageService.onChanged('profile_rating_shares', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addRatingPerViews(nick, "data_rating_shares", "shareCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_shares'));
        } else {
            var elem = document.querySelector("[data_rating_shares]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)

    await storageService.onChanged('profile_rating_comments', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addRatingPerViews(nick, "data_rating_comments", "commentCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_comments'));
        } else {
            var elem = document.querySelector("[data_rating_comments]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)

    await storageService.onChanged('profile_Average_likes', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageCounterPerVideo(nick, "data_avg_likes", "diggCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_likes'));
        } else {
            var elem = document.querySelector("[data_avg_likes]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_views', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageCounterPerVideo(nick, "data_avg_views", "playCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_views'));
        } else {
            var elem = document.querySelector("[data_avg_views]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_shares', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageCounterPerVideo(nick, "data_avg_shares", "shareCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_shares'));
        } else {
            var elem = document.querySelector("[data_avg_shares]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_comments', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageCounterPerVideo(nick, "data_avg_comments", "commentCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_comments'));
        } else {
            var elem = document.querySelector("[data_avg_comments]");
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_ER', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageERPerVideo(nick, "data_avg_er", "tt-analytic-2", chrome.i18n.getMessage('data_avg_er'));
        } else {
            var elem = document.querySelector("[data_avg_er]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_created_time', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageCreatedTimePerVideo(nick, "data_avg_created_time", "tt-analytic-2", chrome.i18n.getMessage('data_avg_created_time'));
        } else {
            var elem = document.querySelector("[data_avg_created_time]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_Average_videos_per_day', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addAverageVideoCountPerDay(nick, "data_avg_videos_per_day", "tt-analytic-2", chrome.i18n.getMessage('data_avg_videos_per_day'));
        } else {
            var elem = document.querySelector("[data_avg_videos_per_day]")
            elem?.parentNode.removeChild(elem)
        }
    }, true)
    await storageService.onChanged('profile_top5_tags', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        if (enable) {
            counterService.addTopTags(nick, "data_top5_tags", "tt-analytic-3", chrome.i18n.getMessage('data_top5_tags'))
        } else {
            var elem = document.querySelector("[data_top5_tags]")
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
    document.querySelector('.share-title-container')?.appendChild(button);
    button.textContent = chrome.i18n.getMessage('content_start_analyzing');
    button.addEventListener('click', getProfilePage() ? analyzeProfile : analyzeTagPage);
}

/**
 * Создает кнопку для анализа профиля
 */
function createCsvButton() {
    if (document.querySelector('[data_content_download_Csv]')) {
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
    button.setAttribute('data_content_download_Csv', 'button');
    document.querySelector('.share-title-container')?.appendChild(button);
    button.textContent = chrome.i18n.getMessage('content_download_Csv');
    button.addEventListener('click', async () => {
        const nick = getProfilePage();
        const tag = getTagPage();
        if (!nick && !tag) {
            // Мы не на странице профиля
            return;
        }

        if (!storageService.itemsDict[nick || tag] || !storageService.itemsDict[nick || tag].length) {
            nick ? await analyzeProfile() : await analyzeTagPage();
        }

        setLoadingToButton('data_content_download_Csv');

        downloadCsv([[
            chrome.i18n.getMessage('content_csv_url'),
            chrome.i18n.getMessage('content_csv_desc'),
            chrome.i18n.getMessage('content_csv_createDate'),
            chrome.i18n.getMessage('content_csv_createTime'),
            chrome.i18n.getMessage('content_csv_challenges'),
            chrome.i18n.getMessage('content_csv_duration'),
            chrome.i18n.getMessage('content_csv_ER'),
            chrome.i18n.getMessage('content_csv_likes'),
            chrome.i18n.getMessage('content_csv_shares'),
            chrome.i18n.getMessage('content_csv_comments'),
            chrome.i18n.getMessage('content_csv_views'),
            // ...Object.keys(storageService.itemsDict[nick][0].stats)
        ].join(","), ...storageService.itemsDict[nick || tag].map(i => [
            `https://www.tiktok.com/@${i.author.uniqueId}/video/${i.id}`,
            i.desc.replaceAll(',', ' '),
            new Date(i.createTime * 1000).toLocaleString(),
            i.challenges?.map(c => `#${c.title}`).join(' '),
            i.video.duration,
            ((i.stats.commentCount + i.stats.diggCount + i.stats.shareCount) * 100 / i.stats.playCount).toFixed(2) + '%', // ER
            ...Object.values(i.stats)
        ].join(","))], nick || tag);


        removeLoadingFromButton('data_content_download_Csv', 'content_download_Csv');

    });
}

/**
 * Анализирует текущий профиль, запрашивая все видосы по API, обновляет каунтеры
 */
async function analyzeTagPage() {
    setLoadingToButton('data_content_start_analyzing');

    const tag = getTagPage();
    if (!tag) {
        // Мы не на странице профиля
        return;
    }

    let lastCursor;

    const meta = document.querySelector('meta[property="al:ios:url"]').content;
    const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
    const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];
    chrome.runtime.sendMessage({action: "start-analyze", data: {tagId}});

    let response;
    do {
        if (!storageService.itemsDict[tag] || !storageService.itemsDict[tag].length) {
            lastCursor = 0;
            storageService.itemsDict[tag] = [];
        } else {
            lastCursor = storageService.itemsDict[tag].length;
        }

        response = await apiService.getChallengeVideosByChallengeID(tagId, lastCursor);

        if (!response.itemList) {
            break;
        }

        storageService.itemsDict[tag].push(...response.itemList);

        storageService.lastCursorDict[tag] = lastCursor;
    } while (response.hasMore)

    for (let i = 0; i < storageService.itemsDict[tag].length; i++) {
        const item = storageService.itemsDict[tag][i];

        const link = document.querySelector(`a[href*="/video/${item.id}"]`)
        if (!link) {
            continue;
        }

        addItem(item, link);
    }

    await storageService.onChanged('video_Sort_by_ER', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? sortByER() : sortByCreationTime();
    }, true)

    updateProfile(tag);

    removeLoadingFromButton('data_content_start_analyzing', 'content_start_analyzing');
}

/**
 * Анализирует текущий профиль, запрашивая все видосы по API, обновляет каунтеры
 */
async function analyzeProfile() {
    setLoadingToButton('data_content_start_analyzing');

    const nick = getProfilePage();
    if (!nick) {
        // Мы не на странице профиля
        return;
    }

    let lastCursor;

    const meta = document.querySelector('meta[property="al:ios:url"]').content;
    const secUid = JSON.parse(document.querySelector('#__NEXT_DATA__')?.innerText)?.props?.pageProps?.userInfo?.user?.secUid;
    const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
    const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];
    chrome.runtime.sendMessage({action: "start-analyze", data: {nick, tagId}});

    if (!storageService.itemsDict[nick] || !storageService.itemsDict[nick].length) {
        lastCursor = new Date().getTime() * 1000;
        storageService.itemsDict[nick] = [];
    } else {
        const minTime = storageService.itemsDict[nick].reduce((acc, val) => {
            return acc < val.createTime ? acc : val.createTime;
        })
        lastCursor = minTime * 1000;
    }

    let response;
    do {
        response = await apiService.getProfileVideosBySecUid(secUid, lastCursor)

        if (!response.itemList) {
            break;
        }

        storageService.itemsDict[nick].push(...response.itemList);

        if (!storageService.itemsDict[nick] || !storageService.itemsDict[nick].length) {
            lastCursor = new Date().getTime() * 1000;
            storageService.itemsDict[nick] = [];
        } else {
            const minTime = storageService.itemsDict[nick].reduce((acc, val) => {
                return acc < val.createTime ? acc : val.createTime;
            })
            lastCursor = minTime * 1000;
        }

        storageService.lastCursorDict[nick] = lastCursor;
    } while (response.hasMore)

    for (let i = 0; i < storageService.itemsDict[nick].length; i++) {
        const item = storageService.itemsDict[nick][i];

        const link = document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
        if (!link) {
            continue;
        }

        addItem(item, link);
    }

    await storageService.onChanged('video_Sort_by_ER', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? sortByER() : sortByCreationTime();
    }, true)

    updateProfile(nick);

    removeLoadingFromButton('data_content_start_analyzing', 'content_start_analyzing');
}

function setLoadingToButton(tagSelector) {
    document.querySelector(`[${tagSelector}]`).setAttribute('disabled', 'disabled');
    document.querySelector(`[${tagSelector}]`).innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path>
    </svg>
    </div>`;
}

function removeLoadingFromButton(tagSelector, i18nText) {
    document.querySelector(`[${tagSelector}]`).removeAttribute('disabled');
    document.querySelector(`[${tagSelector}]`).innerHTML = chrome.i18n.getMessage(i18nText);
}
