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

