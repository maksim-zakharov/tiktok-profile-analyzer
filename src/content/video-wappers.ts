import { onChanged } from "./storage.service";
import { convertNumberToString, getProfilePage, getTagPage } from "./utilities";

export let addItem = async (item, link) => {
  if (link.getAttribute('data-ER')) {
    return;
  }
  link.setAttribute(`data-video_create-time`, item.createTime);

  let footer = link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar');
  if (!footer) {
    footer = document.createElement('div');
    footer.classList.add('jsx-1036923518');
    footer.classList.add('card-footer');
    footer.classList.add('normal');
    footer.classList.add('no-avatar');
    link.querySelector('.jsx-1778455663.video-card-mask').appendChild(footer);
  }
  let firstContainer = link.querySelector('strong.jsx-1036923518.video-bottom-info');
  if (!firstContainer) {
    firstContainer = document.createElement('strong');
    firstContainer.classList.add('jsx-1036923518');
    firstContainer.classList.add('video-bottom-info');
    footer.appendChild(firstContainer);
  }
  let secondContainer = link.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info');
  if (!secondContainer) {
    secondContainer = document.createElement('strong');
    secondContainer.classList.add('jsx-1036923518');
    secondContainer.classList.add('video-bottom-info');
    footer.appendChild(secondContainer);
  }

  await onChanged('video_Views', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? addViews(link, item.stats.playCount) : Array.from(document.querySelectorAll("[data-video_views]")).map(elem => elem?.parentNode?.removeChild(elem));
  }, true)

  await onChanged('video_Likes', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? addLikes(link, item.stats.diggCount) : Array.from(document.querySelectorAll("[data-video_like]")).map(elem => elem?.parentNode?.removeChild(elem));
  }, true)

  await onChanged('video_Shares', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? addShare(link, item) : Array.from(document.querySelectorAll("[data-video_share]")).map(elem => elem?.parentNode?.removeChild(elem));
  }, true)
  await onChanged('video_Comments', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? addComment(link, item) : Array.from(document.querySelectorAll("[data-video_comment]")).map(elem => elem?.parentNode?.removeChild(elem));
  }, true)
  await onChanged('video_ER', enable => {
    if (!getProfilePage() && !getTagPage()) return;
    enable ? addER(link, item) : Array.from(document.querySelectorAll("[data-video_ER]")).map(elem => elem?.parentNode?.removeChild(elem));
  }, true)

  link.classList.add('marked');
}

let addViews = (linkElement, likesCount) => {
  if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_views], .jsx-1036923518.video-bottom-info svg')) {
    return;
  }
  const likesButton = document.createElement('strong');
  likesButton.classList.add('like-icon');
  likesButton.classList.add('custom-views');
  likesButton.setAttribute(`data-video_views`, convertNumberToString(likesCount));

  const likesText = document.createElement('strong');
  likesText.classList.add('jsx-1036923518');
  likesText.innerText = convertNumberToString(likesCount);
  likesText.setAttribute(`data-video_views`, convertNumberToString(likesCount));

  linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesButton);
  linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesText);
}

let addLikes = (linkElement, likesCount) => {
  if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_like]')) {
    return;
  }
  const likesButton = document.createElement('strong');
  likesButton.classList.add('custom-like');
  likesButton.setAttribute(`data-video_like`, convertNumberToString(likesCount));

  const likesText = document.createElement('strong');
  likesText.classList.add('jsx-1036923518');
  likesText.innerText = convertNumberToString(likesCount);
  likesText.setAttribute(`data-video_like`, convertNumberToString(likesCount));

  linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesButton);
  linkElement.querySelector('.jsx-1036923518.video-bottom-info').appendChild(likesText);
}

let addShare = (linkElement, item) => {
  if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_share]')) {
    return;
  }
  const shareButton = document.createElement('svg');
  shareButton.classList.add('custom-share');
  shareButton.setAttribute(`data-video_share`, convertNumberToString(item.stats.shareCount));

  const shareText = document.createElement('strong');
  shareText.classList.add('jsx-1036923518');
  shareText.innerText = convertNumberToString(item.stats.shareCount);
  shareText.setAttribute(`data-video_share`, convertNumberToString(item.stats.shareCount));

  linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(shareButton);
  linkElement.querySelector('.jsx-1036923518.video-bottom-info:first-of-type + .jsx-1036923518.video-bottom-info').appendChild(shareText);
}

let addComment = (linkElement, item) => {
  if (linkElement.querySelector('.jsx-1036923518.video-bottom-info [data-video_comment]')) {
    return;
  }
  const commentButton = document.createElement('strong');
  commentButton.classList.add('custom-comment');
  commentButton.setAttribute(`data-video_comment`, convertNumberToString(item.stats.commentCount));

  const commentText = document.createElement('strong');
  commentText.classList.add('jsx-1036923518');
  commentText.innerText = convertNumberToString(item.stats.commentCount);
  commentText.setAttribute(`data-video_comment`, convertNumberToString(item.stats.commentCount));

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

  const ER = item.stats.playCount ? (item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount : 0;
  ERText.innerText = ER.toFixed(2) + '%';
  ERContainer.appendChild(ERText);
  link.setAttribute('data-ER', ER.toString());
  ERContainer.setAttribute(`data-video_ER`, ER.toString());
}
export let sortByCreationTime = () => {
  var array = Array.from(document.querySelectorAll(`a[data-video_create-time]`))
  array = array.sort((a, b) => {
    // @ts-ignore
    if (+a.getAttribute('data-video_create-time') > +b.getAttribute('data-video_create-time')) {
      return -1;
    }
    // @ts-ignore
    if (+a.getAttribute('data-video_create-time') < +b.getAttribute('data-video_create-time')) {
      return 1;
    }
    // a должно быть равным b
    return 0;
  })
  // @ts-ignore
  array = array.map(link => link.closest('.video-feed-item.three-column-item'))
  array.forEach(e => document.querySelector(".video-feed.compact")?.appendChild(e));
}

export let sortByER = () => {
  var array = Array.from(document.querySelectorAll(`a[data-ER]`))
  array = array.sort((a, b) => {
    // @ts-ignore
    if (+a.getAttribute('data-ER') > +b.getAttribute('data-ER')) {
      return -1;
    }
    // @ts-ignore
    if (+a.getAttribute('data-ER') < +b.getAttribute('data-ER')) {
      return 1;
    }
    // a должно быть равным b
    return 0;
  })
  // @ts-ignore
  array = array.map(link => link.closest('.video-feed-item.three-column-item'))
  array.forEach(e => document.querySelector(".video-feed.compact")?.appendChild(e));
}
