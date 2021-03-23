import utilityService from '@services/utility';
import apiService from '@services/ApiService';
import storageService from '@services/StorageService';
import VideoFooter from "../components/VideoFooter";
import {render} from 'react-dom';
import React from "react";
import ShareLayoutHeader from "../components/ShareLayoutHeader";

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

var tiktokParse = () => {
    const tag = getTagPage();
    const nick = getProfilePage();
    if (nick) {
        update(nick)
    } else if (tag) {
        update(tag, true)
    }
};

const update = async (tag, isTag) => {
    createAnalyzeButton();
    createCsvButton();

    const loadedVideosCount = document.querySelectorAll('.video-feed-item-wrapper').length;
    const markedVideosCount = document.querySelectorAll('.video-feed-item-wrapper.marked').length;

    await updateProfile(tag);

    if (storageService.lastCursorDict[tag] || storageService.itemsDict[tag] && loadedVideosCount <= markedVideosCount) {

        storageService.itemsDict[tag]
            .map(item => ({
                item, link: isTag
                    ? document.querySelector(`a[href*="/video/${item.id}"]`)
                    : document.querySelector(`a[href^="https://www.tiktok.com/@${tag}/video/${item.id}"]`)
            }))
            .filter(({link}) => link)
            .forEach((_, index, array) => createVideoFooter(array[index].item, array[index].link))

        isTag
            ? document.querySelectorAll(`a[href^="https://www.tiktok.com/@"]`).forEach(link => link.classList.add('marked'))
            : document.querySelectorAll(`a[href^="https://www.tiktok.com/@${tag}/video/"]`).forEach(link => link.classList.add('marked'));
    }

    clearInterval(interval);
    interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))
}

var interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))

let createVideoFooter = (item, link) => {
    let footer = link.querySelector('.card-footer.normal.no-avatar.analytics');

    if (!footer) {
        link.setAttribute(`data-video_create-time`, item.createTime);
        render(
            <VideoFooter
                isProfilePage={!getProfilePage() && !getTagPage()}
                link={link}
                item={item}/>
            , link.querySelector('.video-card-mask')
        )
    }
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
    const shareLayoutHeader = document.querySelector('.share-layout-header.share-header');
    const shareDesc = shareLayoutHeader.querySelector('.share-desc');

    const alreadyExistStats = shareLayoutHeader.querySelector('.count-infos + div')

    if (alreadyExistStats) {
        return;
    }

    const tempDiv = document.createElement('div');
    shareLayoutHeader.insertBefore(tempDiv, shareDesc);

    render(
        <ShareLayoutHeader
            isProfilePage={!getProfilePage() && !getTagPage()}
            nick={nick}/>
        , tempDiv
    )
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

        utilityService.downloadCsv([[
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

    setLoadingToButton('data_content_start_analyzing');

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

    removeLoadingFromButton('data_content_start_analyzing', 'content_start_analyzing');

    storageService.itemsDict[tag]
        .map(item => ({item, link: document.querySelector(`a[href*="/video/${item.id}"]`)}))
        .filter(({link}) => link)
        .forEach((_, index, array) => createVideoFooter(array[index].item, array[index].link))

    storageService.onChanged('video_Sort_by_ER', enable => {
        if (!getProfilePage() && !getTagPage()) return;
        enable ? sortByER() : sortByCreationTime();
    }, true)

    await updateProfile(tag);
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
    chrome.runtime.sendMessage({action: "fetchVideoItems", data: {secUid, nick, tagId}})

    console.log('[Content]: click analyzeProfile')

    storageService.addListener(`videoItems_${nick}`, ({action, data: {videoItems, storageKey}}) => {
        // if(action !== 'onStorage' || storageKey !== `videoItems_${nick}`){
        //     return;
        // }
        console.log('[Content]: onStorage...')
        console.log(storageService.itemsDict[nick]);
        console.log(videoItems);

        storageService.itemsDict[nick] = videoItems;

        storageService.itemsDict[nick]
            .map(item => ({
                item, link: document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
            }))
            .filter(({link}) => link)
            .forEach((_, index, array) => createVideoFooter(array[index].item, array[index].link))

        storageService.onChanged('video_Sort_by_ER', enable => {
            if (!getProfilePage() && !getTagPage()) return;
            enable ? sortByER() : sortByCreationTime();
        }, true)

        updateProfile(nick);

        removeLoadingFromButton('data_content_start_analyzing', 'content_start_analyzing');
    })

    // window.addEventListener('storage', () => {
    //     console.log('[Content]: onStorage...')
    //     console.log(localStorage.getItem(`videoItems_${nick}`));
    //
    //     storageService.itemsDict[nick] = JSON.parse(localStorage.getItem(`videoItems_${nick}`));
    //
    //     storageService.itemsDict[nick]
    //         .map(item => ({
    //             item, link: document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
    //         }))
    //         .filter(({link}) => link)
    //         .forEach((_, index, array) => createVideoFooter(array[index].item, array[index].link))
    //
    //     storageService.onChanged('video_Sort_by_ER', enable => {
    //         if (!getProfilePage() && !getTagPage()) return;
    //         enable ? sortByER() : sortByCreationTime();
    //     }, true)
    //
    //     updateProfile(nick);
    //
    //     removeLoadingFromButton('data_content_start_analyzing', 'content_start_analyzing');
    // }, true)
}

function setLoadingToButton(tagSelector) {
    document.querySelector(`[${tagSelector}]`).setAttribute('disabled', 'disabled');
    document.querySelector(`[${tagSelector}]`).innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;
}

function removeLoadingFromButton(tagSelector, i18nText) {
    document.querySelector(`[${tagSelector}]`).removeAttribute('disabled');
    document.querySelector(`[${tagSelector}]`).innerHTML = chrome.i18n.getMessage(i18nText);
}
