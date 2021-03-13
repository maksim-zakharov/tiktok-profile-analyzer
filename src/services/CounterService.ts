import utilityService from "./utility";
import storageService from '@services/StorageService';
import { ProfileChallenge } from "@services/ApiService";

export default {
  addViews(linkElement, likesCount) {
    if (linkElement.querySelector('.video-bottom-info [data-video_views], .video-bottom-info svg')) {
      return;
    }
    const likesButton = document.createElement('strong');
    likesButton.classList.add('like-icon');
    likesButton.classList.add('custom-views');
    likesButton.setAttribute(`data-video_views`, this.convertNumberToString(likesCount));

    const likesText = document.createElement('strong');
    likesText.classList.add('jsx-1036923518');
    likesText.innerText = this.convertNumberToString(likesCount);
    likesText.setAttribute(`data-video_views`, this.convertNumberToString(likesCount));

    linkElement.querySelector('.video-bottom-info')?.appendChild(likesButton);
    linkElement.querySelector('.video-bottom-info')?.appendChild(likesText);
  },

  addLikes(linkElement, likesCount) {
    if (linkElement.querySelector('.video-bottom-info [data-video_like]')) {
      return;
    }
    const likesButton = document.createElement('strong');
    likesButton.classList.add('custom-like');
    likesButton.setAttribute(`data-video_like`, this.convertNumberToString(likesCount));

    const likesText = document.createElement('strong');
    likesText.classList.add('jsx-1036923518');
    likesText.innerText = this.convertNumberToString(likesCount);
    likesText.setAttribute(`data-video_like`, this.convertNumberToString(likesCount));

    linkElement.querySelector('.video-bottom-info')?.appendChild(likesButton);
    linkElement.querySelector('.video-bottom-info')?.appendChild(likesText);
  },

  addShare(linkElement, item) {
    if (linkElement.querySelector('.video-bottom-info [data-video_share]')) {
      return;
    }
    const shareButton = document.createElement('svg');
    shareButton.classList.add('custom-share');
    shareButton.setAttribute(`data-video_share`, this.convertNumberToString(item.stats.shareCount));

    const shareText = document.createElement('strong');
    shareText.classList.add('jsx-1036923518');
    shareText.innerText = this.convertNumberToString(item.stats.shareCount);
    shareText.setAttribute(`data-video_share`, this.convertNumberToString(item.stats.shareCount));

    linkElement.querySelector('.video-bottom-info:first-of-type + .video-bottom-info')?.appendChild(shareButton);
    linkElement.querySelector('.video-bottom-info:first-of-type + .video-bottom-info')?.appendChild(shareText);
  },

  addComment(linkElement, item) {
    if (linkElement.querySelector('.video-bottom-info [data-video_comment]')) {
      return;
    }
    const commentButton = document.createElement('strong');
    commentButton.classList.add('custom-comment');
    commentButton.setAttribute(`data-video_comment`, this.convertNumberToString(item.stats.commentCount));

    const commentText = document.createElement('strong');
    commentText.classList.add('jsx-1036923518');
    commentText.innerText = this.convertNumberToString(item.stats.commentCount);
    commentText.setAttribute(`data-video_comment`, this.convertNumberToString(item.stats.commentCount));

    linkElement.querySelector('.video-bottom-info:first-of-type + .video-bottom-info')?.appendChild(commentButton);
    linkElement.querySelector('.video-bottom-info:first-of-type + .video-bottom-info')?.appendChild(commentText);
  },

  addER(link, item) {
    if (link.querySelector('.card-footer.normal.no-avatar [data-video_er]')) {
      return;
    }
    const ERContainer = document.createElement('strong');
    ERContainer.classList.add('jsx-1036923518');
    ERContainer.classList.add('video-bottom-info');
    link.querySelector('.card-footer.normal.no-avatar')?.appendChild(ERContainer);

    const ERButton = document.createElement('svg');
    ERButton.classList.add('jsx-1036923518');
    ERButton.textContent = 'ER';
    ERContainer.appendChild(ERButton);

    const ERText = document.createElement('strong');
    ERText.classList.add('jsx-1036923518');

    const ER = ((item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount);
    ERText.innerText = ER.toFixed(2) + '%';
    ERContainer.appendChild(ERText);
    link.setAttribute('data-ER', ER.toString());
    ERContainer.setAttribute(`data-video_ER`, ER.toString());
  },

  convertNumberToString(number) {

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
  },

  addAverageERPerVideo(nick: string, dataTag: string, row, name: string) {

    let avgER = '0';
    if (storageService.itemsDict[nick]?.length) {

      const fnER = (item) =>
        item.stats.playCount ? (item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount
          : 0;

      const sum = storageService.itemsDict[nick].reduce((acc, item) => acc + fnER(item), 0);
      avgER = (sum / storageService.itemsDict[nick].length).toFixed(2) + '%';
    }

    utilityService.createCounter(avgER, name, dataTag, row);
  },

  addAverageVideoCountPerDay(nick: string, dataTag: string, row, name: string) {
    let counter = "0";
    if (storageService.itemsDict[nick]?.length) {
      const minTime = storageService.itemsDict[nick].reduce((acc, val) => {
        return acc < val.createTime ? acc : val.createTime;
      }, 0)

      const maxTime = storageService.itemsDict[nick].reduce((acc, val) => {
        return acc > val.createTime ? acc : val.createTime;
      }, 0)

      const diffInMs = new Date(maxTime * 1000).getTime() - new Date(minTime * 1000).getTime()
      counter = (diffInMs / (1000 * 60 * 60 * 24 * storageService.itemsDict[nick].length)).toFixed(2);
    }

    utilityService.createCounter(this.convertNumberToString(counter), name, dataTag, row);
  },

  addAverageCreatedTimePerVideo(nick: string, dataTag: string, row, name: string) {
    let counter;
    if (storageService.itemsDict[nick]?.length) {
      counter = (storageService.itemsDict[nick].reduce((acc, curr) => {
        const date = new Date(curr.createTime * 1000);
        date.setFullYear(2000, 1, 1);
        return acc + date.getTime()
      }, 0) / storageService.itemsDict[nick].length);

      counter = new Date(counter).toLocaleTimeString();
    }

    utilityService.createCounter(this.convertNumberToString(counter), name, dataTag, row);
  },

  addAverageCounterPerVideo(nick, dataTag, fieldName, row, name) {
    let counter = "0";
    if (storageService.itemsDict[nick]?.length) {
      counter = (storageService.itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0) / storageService.itemsDict[nick].length).toFixed(1);
    }

    utilityService.createCounter(this.convertNumberToString(counter), name, dataTag, row);
  },

  addRatingPerViews(nick, dataTag, fieldName, row, name) {
    let counter = "0";
    if (storageService.itemsDict[nick]?.length) {
      counter = (storageService.itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName] * 100 / curr.stats.playCount, 0) / storageService.itemsDict[nick].length).toFixed(2);
    }

    utilityService.createCounter(counter + '%', name, dataTag, row);
  },

  addVideosCount(nick, dataTag, row, name) {

    let counter = 0;
    if (storageService.itemsDict[nick]?.length) {
      counter = storageService.itemsDict[nick].length; // [0].authorStats.videoCount;
    }

    utilityService.createCounter(this.convertNumberToString(counter), name, dataTag, row);
  },

  addTopTags(nick, dataTag, row, name) {

    let counter: string[] = [];
    if (storageService.itemsDict[nick]?.length) {
      const challenges = storageService.itemsDict[nick].filter(curr => curr.challenges).reduce((acc, curr) => acc.concat(...curr.challenges), [] as ProfileChallenge[]);
      counter = utilityService.countBy(challenges, i => i.title).sort((a, b) => {
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

    let container = utilityService.getOrCreateContainer(row);

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

    let numberCountLabel: HTMLAnchorElement | null = numberContainer.querySelector(`a[${dataTag}]`);
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
  },
  addViewsCount(nick: string, dataTag: string, fieldName: string, row, name) {

    let counter = 0;
    if (storageService.itemsDict[nick]?.length) {
      counter = storageService.itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0);
    }

    utilityService.createCounter(this.convertNumberToString(counter), name, dataTag, row);
  }
}
