import { convertNumberToString, countBy, createCounter, getOrCreateContainer } from "../pages/Content/Content";

export let addAverageERPerVideo = (itemsDict, nick, dataTag, row, name) => {

  let avgER = '';
  if (itemsDict[nick]?.length) {

    const fnER = (item) =>
      item.stats.playCount ? (item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount
        : 0;

    const sum = itemsDict[nick].reduce((acc, item) => acc + fnER(item), 0);
    avgER = (sum / itemsDict[nick].length).toFixed(2) + '%';
  }

  createCounter(avgER, name, dataTag, row);
}

export let addAverageVideoCountPerDay = (itemsDict, nick, dataTag, row, name) => {
  let counter;
  if (itemsDict[nick]?.length) {
    const minTime = itemsDict[nick].reduce((acc, val) => {
      return acc < val.createTime ? acc : val.createTime;
    })

    const maxTime = itemsDict[nick].reduce((acc, val) => {
      return acc > val.createTime ? acc : val.createTime;
    })

    // @ts-ignore
    const diffInMs = new Date(maxTime * 1000) - new Date(minTime * 1000)
    counter = (diffInMs / (1000 * 60 * 60 * 24 * itemsDict[nick].length)).toFixed(2);
  }

  createCounter(convertNumberToString(counter), name, dataTag, row);
}

export let addAverageCreatedTimePerVideo = (itemsDict, nick, dataTag, row, name) => {
  let counter;
  if (itemsDict[nick]?.length) {
    counter = (itemsDict[nick].reduce((acc, curr) => {
      const date = new Date(curr.createTime * 1000);
      date.setFullYear(2000, 1, 1);
      return acc + date.getTime()
    }, 0) / itemsDict[nick].length);

    counter = new Date(counter).toLocaleTimeString();
  }

  createCounter(convertNumberToString(counter), name, dataTag, row);
}

export let addAverageCounterPerVideo = (itemsDict, nick, dataTag, fieldName, row, name) => {
  let counter = '';
  if (itemsDict[nick]?.length) {
    counter = (itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0) / itemsDict[nick].length).toFixed(1);
  }

  createCounter(convertNumberToString(counter), name, dataTag, row);
}

export let addRatingPerViews = (itemsDict, nick, dataTag, fieldName, row, name) => {
  let counter = '';
  if (itemsDict[nick]?.length) {
    counter = (itemsDict[nick].reduce((acc, curr) => curr.stats.playCount ? acc + curr.stats[fieldName] * 100 / curr.stats.playCount : acc, 0) / itemsDict[nick].length).toFixed(2);
  }

  createCounter(counter + '%', name, dataTag, row);
}

export let addVideosCount = (itemsDict, nick, dataTag, row, name) => {

  let counter = 0;
  if (itemsDict[nick]?.length) {
    counter = itemsDict[nick].length; // [0].authorStats.videoCount;
  }

  createCounter(convertNumberToString(counter), name, dataTag, row);
}

export let addTopTags = (itemsDict, nick, dataTag, row, name) => {
  let counter: any[] = [];
  if (itemsDict[nick]?.length) {
    counter = itemsDict[nick].filter(curr => curr.challenges).reduce((acc, curr) => acc.concat(...curr.challenges), []);
    counter = countBy(counter, i => i.title).sort((a: any, b: any) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      // a должно быть равным b
      return 0;
    }).splice(0, 5).map(([key]) => key);
  }

  let container = getOrCreateContainer(row);

  let numberContainer = document.querySelector(`div[${dataTag}]`);

  if (!numberContainer) {
    numberContainer = document.createElement('div');
    numberContainer.classList.add('number');
    container.appendChild(numberContainer);
  } else {
    numberContainer.innerHTML = '';
  }
  numberContainer.setAttribute(`${dataTag}`, counter.map(key => `#${key}`).join(' '));

  let numberTextLabel = document.querySelector(`div[${dataTag}] span`);
  if (!numberTextLabel) {
    numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = name;
    numberContainer.appendChild(numberTextLabel);
  }

  let numberCountLabel: any = numberContainer.querySelector(`a[${dataTag}]`);
  if (!numberCountLabel) {
    counter.forEach(tag => {
      numberCountLabel = document.createElement('a');
      numberCountLabel.title = `${tag}`;
      numberContainer?.appendChild(numberCountLabel);

      numberCountLabel.href = `https://www.tiktok.com/tag/${tag}`
      numberCountLabel.target = '_blank';
      numberCountLabel.textContent = `#${tag}`;
      numberCountLabel.setAttribute(`${dataTag}`, `#${tag}`);
    })
  }
}

export let addViewsCount = (itemsDict, nick, dataTag, fieldName, row, name) => {

  let counter = 0;
  if (itemsDict[nick]?.length) {
    counter = itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0);
  }

  createCounter(convertNumberToString(counter), name, dataTag, row);
}
