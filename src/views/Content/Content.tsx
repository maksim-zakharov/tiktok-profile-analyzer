import * as React from "react";
import {
  analyzeProfile, analyzeTagPage, convertNumberToString,
  downloadCsv,
  getProfilePage,
  getTagPage
} from "../../content/utilities";
import { useEffect, useState } from "react";
import { useItems, useLastCursor } from "../../content/contexts.provider";
import { Counter } from "../../components/Counter";
import { listenStorageKey} from "../../content/storage.service";
import calculateService from "../../services/calculates.service";

export let Content: React.FC = () => {
  const itemsDict = useItems();
  const lastCursorDict = useLastCursor();

  const [counters, setCounters]: any[] = useState({});
  const [nick, setNick]: any[] = useState('');

  const downloadCsvHandler = async () => {
    let profile = getProfilePage();
    if (!profile) profile = getTagPage();
    setNick(profile);
    if (!profile) {
      // Мы не на странице профиля
      return;
    }

    if (!itemsDict[profile] || !itemsDict[profile].length) {
      getProfilePage() ? await analyzeProfile(itemsDict, lastCursorDict) : await analyzeTagPage(itemsDict, lastCursorDict);
    }

    document.querySelector('[data_content_download_Csv]')?.setAttribute('disabled', 'disabled');
    // @ts-ignore
    document.querySelector('[data_content_download_Csv]').innerHTML = `
      <div class="tiktok-loading-ring" style="width: 18px; height: 18px;">
      <svg class="ring tt-analytic" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C10.415 15 11.7119 14.512 12.7375 13.6941C13.3852 13.1775 14.329 13.2838 14.8455 13.9315C15.3621 14.5792 15.2558 15.5229 14.6081 16.0395C13.0703 17.266 11.1188 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="white"></path></svg></div>`;

    chrome.runtime.sendMessage({action: "export-csv", data: {profile}});

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
    ].join(","), ...itemsDict[profile].map(i => [
      `https://www.tiktok.com/@${i.author.uniqueId}/video/${i.id}`,
      i.desc.replaceAll(',', ' '),
      new Date(i.createTime * 1000).toLocaleString(),
      i.challenges?.map(c => `#${c.title}`).join(' '),
      i.video.duration,
      i.stats.playCount ? ((i.stats.commentCount + i.stats.diggCount + i.stats.shareCount) * 100 / i.stats.playCount).toFixed(2) : 0 + '%', // ER
      ...Object.values(i.stats)
    ].join(","))], profile);

    document.querySelector('[data_content_download_Csv]')?.removeAttribute('disabled');
    // @ts-ignore
    document.querySelector('[data_content_download_Csv]').innerHTML = chrome.i18n.getMessage('content_download_Csv');
  };

  useEffect(() => {
    const csvButton = createCsvButton();
    csvButton?.addEventListener('click', downloadCsvHandler);
    return () => {
      csvButton?.removeEventListener('click', downloadCsvHandler);
    }
  }, [])

  useEffect(() => {
    console.log('Content: useEffect')

    let listener;

    listenStorageKey('profile_Views', enable => {
      if (!enable) return undefined;
      const result = {
        value: convertNumberToString(calculateService.addViewsCount(itemsDict, nick, "playCount")),
        fieldName: "data_views",
        label: chrome.i18n.getMessage('data_views')
      };
      console.log(result);
      return result;
    }, true).then(result => listener = result);

    // updateProfile(nick, itemsDict).then(counters => setCounters({
    //   ...counters.filter(curr => curr?.fieldName)
    //     .reduce((acc, {fieldName, label, value}) => ({[fieldName]: {label, value}, ...acc}), {})
    // }));

    return () => listener.removeListener();

  }, [itemsDict]);

  return (
    <React.Fragment>
      {Object.entries(counters).map(([fieldName, counter]: any[]) =>
        <Counter fieldName={fieldName}
                 value={counter.value}
                 text={counter.label}/>)}
    </React.Fragment>
  )
}

/**
 * Создает кнопку для анализа профиля
 */
export function createCsvButton() {
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
  return button;
}
