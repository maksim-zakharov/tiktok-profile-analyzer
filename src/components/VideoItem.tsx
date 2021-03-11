import * as React from "react";
import { useItems } from "../content/contexts.provider";
import { useEffect, useState } from "react";
import { convertNumberToString } from "../pages/Content/Content";

// @ts-ignore
export let VideoItem: React.FC = ({id, nick}: { id: string, nick: string }) => {
  const items = useItems();
  let [video, setVideo] = useState<any>(undefined);

  useEffect(() => {
    if (!items[nick]) {
      return undefined;
    }
    // await onChanged('video_Views', enable => {
    //   if (!getProfilePage() && !getTagPage()) return;
    //   enable ? addViews(link, item.stats.playCount) : Array.from(document.querySelectorAll("[data_video_views]")).map(elem => elem?.parentNode?.removeChild(elem));
    // }, true)
    video = items[nick].find(i => i.id === id);
    if (!video) {
      return undefined;
    }

    video.data_video_views = convertNumberToString(video?.stats?.playCount);
    video.data_video_like = convertNumberToString(video?.stats?.diggCount);
    video.data_video_share = convertNumberToString(video?.stats?.diggCount);
    video.data_video_comment = convertNumberToString(video?.stats?.commentCount);
    const ER = video.stats.playCount ? (video.stats.commentCount + video.stats.diggCount + video.stats.shareCount) * 100 / video.stats.playCount : 0;
    video.data_video_ER = ER.toFixed(2) + '%';
    setVideo(video);

    return;
  });

  return (
    <React.Fragment>
      <strong className="jsx-1036923518 video-bottom-info">
        {video?.data_video_views &&
        <React.Fragment>
            <strong className="like-icon custom-views" {...{data_video_views: video?.data_video_views}}/>
            <strong className="jsx-1036923518" {...{data_video_views: video?.data_video_views}}>
              {video?.data_video_views}
            </strong>
        </React.Fragment>}

        {video?.data_video_like &&
        <React.Fragment>
            <strong className="custom-like" {...{data_video_like: video?.data_video_like}}/>
            <strong className="jsx-1036923518" {...{data_video_like: video?.data_video_like}}>
              {video?.data_video_like}
            </strong>
        </React.Fragment>}
      </strong>
      <strong className="jsx-1036923518 video-bottom-info">
        {video?.data_video_share &&
        <React.Fragment>
            <svg className="custom-share" {...{data_video_share: video?.data_video_share}}/>
            <strong className="jsx-1036923518" {...{data_video_share: video?.data_video_share}}>
              {video?.data_video_share}
            </strong>
        </React.Fragment>}

        {video?.data_video_comment &&
        <React.Fragment>
            <strong className="custom-comment" {...{data_video_comment: video?.data_video_comment}}/>
            <strong className="jsx-1036923518" {...{data_video_comment: video?.data_video_comment}}>
              {video?.data_video_comment}
            </strong>
        </React.Fragment>}
      </strong>
      {video?.data_video_ER &&
      <strong className="jsx-1036923518 video-bottom-info">
          <strong {...{data_video_ER: video?.data_video_ER}}>ER</strong>
          <strong className="jsx-1036923518" {...{data_video_ER: video?.data_video_ER}}>
            {video?.data_video_ER}
          </strong>
      </strong>}
    </React.Fragment>
  )
}
