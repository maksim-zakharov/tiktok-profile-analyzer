import calculateService from '../services/calculates.service'
import api from '../services/api.service'
import { onChanged } from "./storage.service";
import { addAverageERPerVideo, addTopTags } from "./profile.service";
import { sortByCreationTime, sortByER } from "./video-wappers";

export let getProfilePage = () => {
  // @ts-ignore
  return document.querySelector('meta[property="twitter:creator:id"]')?.content;
}

export let getTagPage = () => {
  const meta = document.querySelector('meta[property="al:ios:url"][content*="snssdk1233://challenge"]');
  if (!meta) {
    return undefined;
  }

  const url1 = new URL(`https://tiktok.com/${meta.getAttribute('content')?.replace('snssdk1233://', '')}`);
  const tagId = url1.pathname?.split('/')[url1.pathname?.split('/').length - 1];
  if (tagId === 'feed') {
    return undefined;
  }

  return +tagId;
}

export let updateProfile = (nick, itemsDict): Promise<any[]> => {
  return Promise.all([
    onChanged('profile_Views', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addViewsCount(itemsDict, nick, "playCount")),
        fieldName: "data_views",
        label: chrome.i18n.getMessage('data_views')
      };
    }, true),

    onChanged('profile_videos', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addVideosCount(itemsDict, nick)),
        fieldName: "data_videos",
        label: chrome.i18n.getMessage('data_videos')
      };
    }, true),

    onChanged('profile_Shares', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addViewsCount(itemsDict, nick, "shareCount")),
        fieldName: "data_shares",
        label: chrome.i18n.getMessage('data_shares')
      };
    }, true)
    , onChanged('profile_Comments', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addViewsCount(itemsDict, nick, "commentCount")),
        fieldName: "data_comments",
        label: chrome.i18n.getMessage('data_comments')
      };
    }, true)

    , onChanged('profile_rating_likes', enable => {
      if (!enable) return undefined;
      return {
        value: calculateService.addRatingPerViews(itemsDict, nick, "diggCount") + '%',
        fieldName: "data_rating_likes",
        label: chrome.i18n.getMessage('data_rating_likes')
      };
    }, true)

    , onChanged('profile_rating_shares', enable => {
      if (!enable) return undefined;
      return {
        value: calculateService.addRatingPerViews(itemsDict, nick, "shareCount") + '%',
        fieldName: "data_rating_shares",
        label: chrome.i18n.getMessage('data_rating_shares')
      };
    }, true)

    , onChanged('profile_rating_comments', enable => {
      if (!enable) return undefined;
      return {
        value: calculateService.addRatingPerViews(itemsDict, nick, "commentCount") + '%',
        fieldName: "data_rating_comments",
        label: chrome.i18n.getMessage('data_rating_comments')
      };
    }, true)

    , onChanged('profile_Average_likes', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addAverageCounterPerVideo(itemsDict, nick, "diggCount")),
        fieldName: "data_avg_likes",
        label: chrome.i18n.getMessage('data_avg_likes')
      };
    }, true)
    , onChanged('profile_Average_views', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addAverageCounterPerVideo(itemsDict, nick, "playCount")),
        fieldName: "data_avg_views",
        label: chrome.i18n.getMessage('data_avg_views')
      };
    }, true)
    , onChanged('profile_Average_shares', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addAverageCounterPerVideo(itemsDict, nick, "shareCount")),
        fieldName: "data_avg_shares",
        label: chrome.i18n.getMessage('data_avg_shares')
      };
    }, true)
    , onChanged('profile_Average_comments', enable => {
      if (!enable) return undefined;
      return {
        value: convertNumberToString(calculateService.addAverageCounterPerVideo(itemsDict, nick, "commentCount")),
        fieldName: "data_avg_comments",
        label: chrome.i18n.getMessage('data_avg_comments')
      };
    }, true)
    , onChanged('profile_Average_ER', enable => {
      if (!getProfilePage() && !getTagPage()) return;
      if (enable) {
        addAverageERPerVideo(itemsDict, nick, "data_avg_er", "tt-analytic-2", chrome.i18n.getMessage('data_avg_er'));
      } else {
        var elem = document.querySelector("[data_avg_er]")
        elem?.parentNode?.removeChild(elem)
      }
    }, true)
    , onChanged('profile_Average_created_time', enable => {
      if (!enable) return undefined;
      return {
        value: calculateService.addAverageCreatedTimePerVideo(itemsDict, nick),
        fieldName: "data_avg_created_time",
        label: chrome.i18n.getMessage('data_avg_created_time')
      };
    }, true)
    , onChanged('profile_Average_videos_per_day', enable => {
      if (!enable) return undefined;
      return {
        value: calculateService.addAverageVideoCountPerDay(itemsDict, nick),
        fieldName: "data_avg_videos_per_day",
        label: chrome.i18n.getMessage('data_avg_videos_per_day')
      };
    }, true)
    , onChanged('profile_top5_tags', enable => {
      if (!getProfilePage() && !getTagPage()) return;
      if (enable) {
        addTopTags(itemsDict, nick, "data_top5_tags", "tt-analytic-3", chrome.i18n.getMessage('data_top5_tags'))
      } else {
        var elem = document.querySelector("[data_top5_tags]")
        elem?.parentNode?.removeChild(elem)
      }
    }, true)
  ]);
}

/**
 * Создает кнопку для анализа профиля
 */
export function createAnalyzeButton(itemsDict, lastCursorDict) {
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
  button.addEventListener('click', getProfilePage() ? () => analyzeProfile(itemsDict, lastCursorDict) : () => analyzeTagPage(itemsDict, lastCursorDict));
}

/**
 * Создает кнопку для анализа профиля
 */
export function createCsvButton(itemsDict, lastCursorDict) {
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

    if (!itemsDict[nick || tag] || !itemsDict[nick || tag].length) {
      nick ? await analyzeProfile(itemsDict, lastCursorDict) : await analyzeTagPage(itemsDict, lastCursorDict);
    }

    document.querySelector('[data_content_download_Csv]')?.setAttribute('disabled', 'disabled');
    // @ts-ignore
    document.querySelector('[data_content_download_Csv]').innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;

    chrome.runtime.sendMessage({action: "export-csv", data: {tag, nick}});

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
      // ...Object.keys(itemsDict[nick][0].stats)
    ].join(","), ...itemsDict[nick || tag].map(i => [
      `https://www.tiktok.com/@${i.author.uniqueId}/video/${i.id}`,
      i.desc.replaceAll(',', ' '),
      new Date(i.createTime * 1000).toLocaleString(),
      i.challenges?.map(c => `#${c.title}`).join(' '),
      i.video.duration,
      i.stats.playCount ? ((i.stats.commentCount + i.stats.diggCount + i.stats.shareCount) * 100 / i.stats.playCount).toFixed(2) : 0 + '%', // ER
      ...Object.values(i.stats)
    ].join(","))], nick || tag);

    document.querySelector('[data_content_download_Csv]')?.removeAttribute('disabled');
    // @ts-ignore
    document.querySelector('[data_content_download_Csv]').innerHTML = chrome.i18n.getMessage('content_download_Csv');
  });
}

/**
 * Анализирует текущий профиль, запрашивая все видосы по API, обновляет каунтеры
 */
export async function analyzeTagPage(itemsDict, lastCursorDict) {
  document.querySelector('[data_content_start_analyzing]')?.setAttribute('disabled', 'disabled');
  // @ts-ignore
  document.querySelector('[data_content_start_analyzing]').innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;

  const tag = getTagPage();
  if (!tag) {
    // Мы не на странице профиля
    return;
  }

  let lastCursor;

  // @ts-ignore
  const meta = document.querySelector('meta[property="al:ios:url"]')?.content;
  const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
  const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];
  chrome.runtime.sendMessage({action: "start-analyze", data: {tagId}});

  let response;
  do {
    if (!itemsDict[tag] || !itemsDict[tag].length) {
      lastCursor = 0;
      itemsDict[tag] = [];
    } else {
      lastCursor = itemsDict[tag].length;
    }

    response = await api.getTagVideos(tagId, lastCursor);

    if (!response.itemList) {
      break;
    }

    itemsDict[tag].push(...response.itemList);

    lastCursorDict[tag] = lastCursor;
  } while (response.hasMore)

  for (let i = 0; i < itemsDict[tag].length; i++) {
    const item = itemsDict[tag][i];

    const link = document.querySelector(`a[href*="/video/${item.id}"]`)
    if (!link) {
      continue;
    }

    // addItem(item, link);
  }

  await onChanged('video_Sort_by_ER', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? sortByER() : sortByCreationTime();
  }, true)

  await updateProfile(tag, itemsDict);

  document.querySelector('[data_content_start_analyzing]')?.removeAttribute('disabled');
  // @ts-ignore
  document.querySelector('[data_content_start_analyzing]').innerHTML = chrome.i18n.getMessage('content_start_analyzing');
  return {lastCursorDict, itemsDict};
}

/**
 * Анализирует текущий профиль, запрашивая все видосы по API, обновляет каунтеры
 */
export async function analyzeProfile(itemsDict, lastCursorDict) {
  document.querySelector('[data_content_start_analyzing]')?.setAttribute('disabled', 'disabled');
  // @ts-ignore
  document.querySelector('[data_content_start_analyzing]').innerHTML = `
    <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
    <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;

  const nick = getProfilePage();
  if (!nick) {
    // Мы не на странице профиля
    return;
  }

  let lastCursor;

  // @ts-ignore
  const meta = document.querySelector('meta[property="al:ios:url"]')?.content;
  const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
  const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];
  chrome.runtime.sendMessage({action: "start-analyze", data: {nick, tagId}});

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
    response = await api.getProfileVideos(tagId, lastCursor)

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

    // addItem(item, link);
  }

  await onChanged('video_Sort_by_ER', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? sortByER() : sortByCreationTime();
  }, true)

  await updateProfile(nick, itemsDict);

  document.querySelector('[data_content_start_analyzing]')?.removeAttribute('disabled');
  // @ts-ignore
  document.querySelector('[data_content_start_analyzing]').innerHTML = chrome.i18n.getMessage('content_start_analyzing');

  return {lastCursorDict, itemsDict};
}

export let convertNumberToString = (number) => {

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
}/**
 * Возвращает контейнер под каунтеры профиля или создает его, если еще не создан
 * @param name Название контейнера
 * @returns {Element}
 */
export let getOrCreateContainer = (name) => {
    let container = document.querySelector(`.count-infos.${name}`)
    if (!container) {
      const shareHeader = document.querySelector('.share-layout-header.share-header');
      container = document.createElement('h2');
      // Если ТЕГ
      if (!document.querySelector(`.count-infos`)) {
        shareHeader?.appendChild(container);
      } else { // Если профиль
        shareHeader?.insertBefore(container, document.querySelector('.share-desc'));
      }
      container.classList.add('count-infos');
      container.classList.add(name);
    }

    return container;
  }

export let createCounter = (text, name, dataTag, row) => {
  let container = getOrCreateContainer(row);
  let numberContainer = document.querySelector(`div[${dataTag}]`);

  if (!numberContainer) {
    numberContainer = document.createElement('div');
    numberContainer.classList.add('number');
    container.appendChild(numberContainer);
  }
  numberContainer.setAttribute(`${dataTag}`, text);

  let numberCountLabel: any = document.querySelector(`div[${dataTag}]`);
  if (!numberCountLabel) {
    numberCountLabel = document.createElement('strong');
    numberCountLabel.title = name;
    numberContainer.appendChild(numberCountLabel);
  }
  numberCountLabel.textContent = text;
  numberCountLabel.setAttribute(`${dataTag}`, text);

  const numberTextLabel = document.createElement('span');
  numberTextLabel.classList.add('unit');
  numberTextLabel.textContent = name;
  numberContainer.appendChild(numberTextLabel);
}

export const countBy = (arr, predicate) => {
  return Object.entries(arr.reduce((acc, val) => {
    const value = predicate(val);
    acc[value.toString()] = (acc[value.toString()] || 0) + 1;
    return acc;
  }, {}));
};

export function downloadCsv(data, name) {
  var pom = document.createElement('a');
  var csvContent = data.join("\r\n"); //here we load our csv data
  var blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  pom.href = url;
  pom.setAttribute('download', `${name}.csv`);
  pom.click();
}

