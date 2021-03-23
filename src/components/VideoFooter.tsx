import * as React from "react";
import storageService from '@services/StorageService';
import counterService from '@services/CounterService'
import { useEffect, useState } from "react";
import { ProfileVideo } from "@services/ApiService";

type VideoFooterState = {
  likes?: number,
  views?: number,
  shares?: number,
  comments?: number,
  ER?: string
}

type VideoFooterProps = {
  isProfilePage?: boolean,
  item: ProfileVideo,
  link: Element
}

const VideoFooter: React.FC<VideoFooterProps> = ({isProfilePage, link, item}) => {

  const ER = ((item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount);

  const [state, setState] = useState<VideoFooterState>({});

  const changeViewsHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({...prevState, views: item.stats.playCount}))
      : setState(prevState => ({...prevState, views: undefined}));
  };

  const changeLikesHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({...prevState, likes: item.stats.diggCount}))
      : setState(prevState => ({...prevState, likes: undefined}));
  };

  const changeSharesHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({...prevState, shares: item.stats.shareCount}))
      : setState(prevState => ({...prevState, shares: undefined}));
  };

  const changeCommentsHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({...prevState, comments: item.stats.commentCount}))
      : setState(prevState => ({...prevState, comments: undefined}));
  };

  const changeERHandle = enable => {
    if (isProfilePage) return;
    enable ? setState(prevState => ({
        ...prevState,
        ER: ER.toFixed(2) + '%'
      }))
      : setState(prevState => ({...prevState, ER: undefined}));
  };

  useEffect(() => {
    const {handle: viewsHandle, removeListener: viewsRemoveListener} = storageService.onChanged('video_Views', changeViewsHandle, true)
    const {handle: likesHandle, removeListener: likesRemoveListener} = storageService.onChanged('video_Likes', changeLikesHandle, true)
    const {handle: sharesHandle, removeListener: sharesRemoveListener} = storageService.onChanged('video_Shares', changeSharesHandle, true)
    const {handle: commentsHandle, removeListener: commentsRemoveListener} = storageService.onChanged('video_Comments', changeCommentsHandle, true)
    const {handle: ERHandle, removeListener: erRemoveListener} = storageService.onChanged('video_ER', changeERHandle, true)

    link.classList.add('marked')

    link.setAttribute('data-ER', ER.toString());

    return () => {
      viewsRemoveListener(viewsHandle);
      likesRemoveListener(likesHandle);
      sharesRemoveListener(sharesHandle);
      commentsRemoveListener(commentsHandle);
      erRemoveListener(ERHandle);
    }
  }, [])


  useEffect(() => {
  }, [changeViewsHandle, changeLikesHandle, changeSharesHandle, changeCommentsHandle, changeERHandle])

  return (
    <div className="jsx-1036923518 card-footer normal no-avatar analytics">
      <strong className="jsx-1036923518 video-bottom-info">
        {state.views && <React.Fragment>
            <strong className="like-icon custom-views"/>
            <strong className="jsx-1036923518">{counterService.convertNumberToString(state.views)}</strong>
        </React.Fragment>
        }
        {state.likes && <React.Fragment>
            <strong className="custom-like"/>
            <strong className="jsx-1036923518">{counterService.convertNumberToString(state.likes)}</strong>
        </React.Fragment>
        }
      </strong>
      <strong className="jsx-1036923518 video-bottom-info">
        {state.shares && <React.Fragment>
            <svg className="custom-share"/>
            <strong className="jsx-1036923518">{counterService.convertNumberToString(state.shares)}</strong>
        </React.Fragment>
        }
        {state.comments && <React.Fragment>
            <strong className="custom-comment"/>
            <strong className="jsx-1036923518">{counterService.convertNumberToString(state.comments)}</strong>
        </React.Fragment>
        }
      </strong>
      {state.ER &&
      <strong className="jsx-1036923518 video-bottom-info">
          <strong className="jsx-1036923518">ER</strong>
          <strong className="jsx-1036923518">{state.ER}</strong>
      </strong>
      }
    </div>
  )
}

export default VideoFooter;
