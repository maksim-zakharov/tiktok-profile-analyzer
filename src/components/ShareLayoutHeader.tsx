import storageService from "@services/StorageService";
import counterService from "@services/CounterService";
import { useEffect, useState } from "react";
import * as React from "react";

type ShareLayoutHeaderState = {
  views?: number,
  videos?: number,
  shares?: number,
  rating_likes?: number,
  rating_shares?: number,
  rating_comments?: number,
  avg_likes?: number,
  avg_views?: number,
  avg_shares?: number,
  avg_comments?: number,
  avg_er?: number,
  avg_created_time?: number,
  avg_videos_per_day?: number,
  top5_tags?: number,
}

type ShareLayoutHeaderProps = {
  isProfilePage?: boolean,
  nick: string
}

const ShareLayoutHeader: React.FC<ShareLayoutHeaderProps> = ({isProfilePage, nick}) => {

  const [state, setState] = useState<ShareLayoutHeaderState>({});

  const changeViewsHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({
        ...prevState,
        views: counterService.addViewsCount(nick, "data_views", "playCount")
      }))
      : setState(prevState => ({...prevState, views: undefined}));
  };

  const changeVideosHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({
        ...prevState,
        videos: counterService.addVideosCount(nick)
      }))
      : setState(prevState => ({...prevState, videos: undefined}));
  };

  // storageService.onChanged('profile_Shares', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addViewsCount(nick, "data_shares", "shareCount", "tt-analytic-1", chrome.i18n.getMessage('data_shares'));
  //   } else {
  //     var elem = document.querySelector("[data_shares]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Comments', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addViewsCount(nick, "data_comments", "commentCount", "tt-analytic-1", chrome.i18n.getMessage('data_comments'));
  //   } else {
  //     var elem = document.querySelector("[data_comments]");
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  //
  // storageService.onChanged('profile_rating_likes', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addRatingPerViews(nick, "data_rating_likes", "diggCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_likes'));
  //   } else {
  //     var elem = document.querySelector("[data_rating_likes]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  //
  // storageService.onChanged('profile_rating_shares', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addRatingPerViews(nick, "data_rating_shares", "shareCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_shares'));
  //   } else {
  //     var elem = document.querySelector("[data_rating_shares]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  //
  // storageService.onChanged('profile_rating_comments', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addRatingPerViews(nick, "data_rating_comments", "commentCount", "tt-analytic-2", chrome.i18n.getMessage('data_rating_comments'));
  //   } else {
  //     var elem = document.querySelector("[data_rating_comments]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  //
  // storageService.onChanged('profile_Average_likes', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageCounterPerVideo(nick, "data_avg_likes", "diggCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_likes'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_likes]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_views', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageCounterPerVideo(nick, "data_avg_views", "playCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_views'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_views]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_shares', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageCounterPerVideo(nick, "data_avg_shares", "shareCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_shares'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_shares]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_comments', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageCounterPerVideo(nick, "data_avg_comments", "commentCount", "tt-analytic-2", chrome.i18n.getMessage('data_avg_comments'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_comments]");
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_ER', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageERPerVideo(nick, "data_avg_er", "tt-analytic-2", chrome.i18n.getMessage('data_avg_er'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_er]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_created_time', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageCreatedTimePerVideo(nick, "data_avg_created_time", "tt-analytic-2", chrome.i18n.getMessage('data_avg_created_time'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_created_time]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_Average_videos_per_day', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addAverageVideoCountPerDay(nick, "data_avg_videos_per_day", "tt-analytic-2", chrome.i18n.getMessage('data_avg_videos_per_day'));
  //   } else {
  //     var elem = document.querySelector("[data_avg_videos_per_day]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)
  // storageService.onChanged('profile_top5_tags', enable => {
  //   if (isProfilePage) return;
  //   if (enable) {
  //     counterService.addTopTags(nick, "data_top5_tags", "tt-analytic-3", chrome.i18n.getMessage('data_top5_tags'))
  //   } else {
  //     var elem = document.querySelector("[data_top5_tags]")
  //     elem?.parentNode.removeChild(elem)
  //   }
  // }, true)

  useEffect(() => {
    const {handle: viewsHandle, removeListener: viewsRemoveListener} = storageService.onChanged('profile_Views', changeViewsHandle, true)
    const {handle: videosHandle, removeListener: videosRemoveListener} = storageService.onChanged('profile_videos', changeVideosHandle, true)

    // const {handle: likesHandle, removeListener: likesRemoveListener} = storageService.onChanged('video_Likes', changeLikesHandle, true)
    // const {handle: sharesHandle, removeListener: sharesRemoveListener} = storageService.onChanged('video_Shares', changeSharesHandle, true)
    // const {handle: commentsHandle, removeListener: commentsRemoveListener} = storageService.onChanged('video_Comments', changeCommentsHandle, true)
    // const {handle: ERHandle, removeListener: erRemoveListener} = storageService.onChanged('video_ER', changeERHandle, true)

    return () => {
      viewsRemoveListener(viewsHandle);
      videosRemoveListener(videosHandle);
      // likesRemoveListener(likesHandle);
      // sharesRemoveListener(sharesHandle);
      // commentsRemoveListener(commentsHandle);
      // erRemoveListener(ERHandle);
    }
  }, [])


  useEffect(() => {
  }, [changeViewsHandle, changeVideosHandle])


  return (
    <React.Fragment>
      <h2 className="count-infos tt-analytic-1">
        {state.views! && <div className="number">{counterService.convertNumberToString(state.views)}<span
            className="unit">{chrome.i18n.getMessage('data_views')}</span></div>}
        {state.videos! && <div className="number">{counterService.convertNumberToString(state.videos)}<span
            className="unit">{chrome.i18n.getMessage('data_videos')}</span></div>}
        {/*<div className="number" data_shares="19.1K">19.1K<span className="unit">Поделились</span></div>*/}
        {/*<div className="number" data_comments="1.2K">1.2K<span className="unit">Комментарии</span></div>*/}
      </h2>
      {/*<h2 className="count-infos tt-analytic-2">*/}
      {/*  <div className="number" data_rating_likes="3.08%">3.08%<span className="unit">Рейтинг одобрения</span></div>*/}
      {/*  <div className="number" data_rating_shares="0.37%">0.37%<span className="unit">Рейтинг распространения</span>*/}
      {/*  </div>*/}
      {/*  <div className="number" data_rating_comments="0.19%">0.19%<span className="unit">Рейтинг обсуждаемости</span>*/}
      {/*  </div>*/}
      {/*  <div className="number" data_avg_likes="3.5K">3.5K<span className="unit">Средн. лайки</span></div>*/}
      {/*  <div className="number" data_avg_views="52.3K">52.3K<span className="unit">Средн. просмотры</span></div>*/}
      {/*  <div className="number" data_avg_shares="830.3">830.3<span className="unit">Средн. репосты</span></div>*/}
      {/*  <div className="number" data_avg_comments="51.0">51.0<span className="unit">Средн. комментарии</span></div>*/}
      {/*  <div className="number" data_avg_er="3.64%">3.64%<span className="unit">Средн. коэффициент вовлеченности</span>*/}
      {/*  </div>*/}
      {/*  <div className="number" data_avg_created_time="18:34:19">18:34:19<span*/}
      {/*    className="unit">Средн. время создания</span>*/}
      {/*  </div>*/}
      {/*  <div className="number" data_avg_videos_per_day="810.41">810.41<span*/}
      {/*    className="unit">Средн. кол-во видео в день</span></div>*/}
      {/*</h2>*/}
      {/*<h2 className="count-infos tt-analytic-3">*/}
      {/*  <div className="number" data_top5_tags="#программист #программирование #it #айти #разработка"><span*/}
      {/*    className="unit">Топ 5 тегов</span><a title="программист" href="https://www.tiktok.com/tag/программист"*/}
      {/*                                          target="_blank" data_top5_tags="#программист">#программист</a><a*/}
      {/*    title="программирование" href="https://www.tiktok.com/tag/программирование" target="_blank"*/}
      {/*    data_top5_tags="#программирование">#программирование</a><a title="it" href="https://www.tiktok.com/tag/it"*/}
      {/*                                                               target="_blank" data_top5_tags="#it">#it</a><a*/}
      {/*    title="айти" href="https://www.tiktok.com/tag/айти" target="_blank" data_top5_tags="#айти">#айти</a><a*/}
      {/*    title="разработка" href="https://www.tiktok.com/tag/разработка" target="_blank"*/}
      {/*    data_top5_tags="#разработка">#разработка</a></div>*/}
      {/*</h2>*/}
    </React.Fragment>
  )
}
export default ShareLayoutHeader;
