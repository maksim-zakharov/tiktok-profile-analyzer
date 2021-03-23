import axios from "axios";

type VideoAuthor = {
  "id": string, // "6832701005197607942",
  "uniqueId": string, // "zakharov_maksim",
  "nickname": string, // "Веб-разработка | Фриланс",
  "avatarThumb": string, // "https://p58-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/ffb2bac853a14ee087160d6a3c9e37de.jpeg?x-expires=1615723200\u0026x-signature=MN1vbdtMcHQAtYjDzs9vfGTKsic%3D",
  "avatarMedium": string, // "https://p58-sign-sg.tiktokcdn.com/aweme/720x720/tos-alisg-avt-0068/ffb2bac853a14ee087160d6a3c9e37de.jpeg?x-expires=1615723200\u0026x-signature=pgzFEtjYWzoncVjb%2Fjvt8Lg9OKU%3D",
  "avatarLarger": string, // "https://p58-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/ffb2bac853a14ee087160d6a3c9e37de.jpeg?x-expires=1615723200\u0026x-signature=dE88HkX2uRl%2Bq3PMay7l5fa0n3g%3D",
  "signature": string, // "👨🏼‍💻Фриланс, 🚀Айти, 😍Фронтенд\n👇Аналитика Тиктока, Умный Upwork👇",
  "verified": boolean, // boolean,
  "secUid": string, // "MS4wLjABAAAA1izBVyGylnoVg9UsOy5BwI2tdD6JmDRIkELIAMj2pJmVXQumsF7y7adDVXF4k69E",
  "secret": boolean, // boolean,
  "ftc": boolean, // boolean,
  "relation": number, //0,
  "openFavorite": boolean, // boolean,
  "commentSetting": number, //0,
  "duetSetting": number, //0,
  "stitchSetting": number, //0,
  "privateAccount": boolean, // false
}

type AuthorStats = {
  "followingCount": number, // 61,
  "followerCount": number, // 23000,
  "heartCount": number, // 80200,
  "videoCount": number, // 23,
  "diggCount": number, // 12300,
  "heart": number, // 80200
}

export type ProfileChallenge = {
  "id": string,// "76613285",
  "title": string,// "фриланс",
  "desc": string,
  "profileThumb": string,
  "profileMedium": string,
  "profileLarger": string,
  "coverThumb": string,
  "coverMedium": string,
  "coverLarger": string,
  "isCommerce": boolean, // false
}

export type ProfileVideo = {
  "id": string, // "6916804448740183297",
  "desc": string, // "Какими биржами пользуетесь и какой функционал добавить? #фриланс #программист #программирование #апворк #фрилансзаработок #фрилансработа #фрилансер",
  "createTime": number, // 1610444034,
  "video": {
    "id": string, // "6916804448740183297",
    "height": number,
    "width": number,
    "duration": number, //41,
    "ratio": string, // "720p",
    "cover": string, // "https://p58-sign-sg.tiktokcdn.com/tos-alisg-p-0037/920ef8acb3be4cb49d29ae56f28890c8_1610444051~tplv-dmt-logom:tos-alisg-i-0000/30712c4640984e249b15f401a8ad7bb8.image?x-expires=1615658400\u0026x-signature=6gIIIh3aV24COHjn9GiDh4%2Fh6IU%3D",
    "originCover": string, // "https://p58-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/728b80fa56de436c9587cddc281fb9de_1610444050?x-expires=1615658400\u0026x-signature=Qxc37WBU8DgeJQXkKVpd8tPaocw%3D",
    "dynamicCover": string, // "https://p58-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/e0caf752a88846238f33b89d64113d4f_1610444051?x-expires=1615658400\u0026x-signature=zoVGUsUp%2FBaa3tJJt%2BM0kVItYKk%3D",
    "playAddr": string, // "https://v16-web.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/03ac91dd67d749cc89c4a1a92b8a2b3f/?a=1988\u0026br=2330\u0026bt=1165\u0026cd=0%7C0%7C1\u0026ch=0\u0026cr=0\u0026cs=0\u0026cv=1\u0026dr=0\u0026ds=3\u0026er=\u0026expire=1615660817\u0026l=202103131239360101880322233F0B6B85\u0026lr=tiktok_m\u0026mime_type=video_mp4\u0026pl=0\u0026policy=2\u0026qs=0\u0026rc=ajVvaG5pbXhweTMzZzczM0ApPGhkPGk8OTw6NzhnOzllaGdqYmphazU2bXJfLS1jMTRzc2BjNmFiXjMwYGBgYy8yLzU6Yw%3D%3D\u0026signature=0bbb8d446a9d66e0148401ecae57f521\u0026tk=tt_webid_v2\u0026vl=\u0026vr=",
    "downloadAddr": string, // "https://v16-web.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/03ac91dd67d749cc89c4a1a92b8a2b3f/?a=1988\u0026br=2330\u0026bt=1165\u0026cd=0%7C0%7C1\u0026ch=0\u0026cr=0\u0026cs=0\u0026cv=1\u0026dr=0\u0026ds=3\u0026er=\u0026expire=1615660817\u0026l=202103131239360101880322233F0B6B85\u0026lr=tiktok_m\u0026mime_type=video_mp4\u0026pl=0\u0026policy=2\u0026qs=0\u0026rc=ajVvaG5pbXhweTMzZzczM0ApPGhkPGk8OTw6NzhnOzllaGdqYmphazU2bXJfLS1jMTRzc2BjNmFiXjMwYGBgYy8yLzU6Yw%3D%3D\u0026signature=0bbb8d446a9d66e0148401ecae57f521\u0026tk=tt_webid_v2\u0026vl=\u0026vr=",
    "shareCover": string [], // ["https://p58-sign-sg.tiktokcdn.com/tos-alisg-p-0037/728b80fa56de436c9587cddc281fb9de_1610444050~tplv-tiktok-play.jpeg?x-expires=1615658400\u0026x-signature=MaIp8tCJhR16C9Cn9aYC4iJKsWs%3D"]
    "reflowCover": string, // "https://p58-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/920ef8acb3be4cb49d29ae56f28890c8_1610444051?x-expires=1615658400\u0026x-signature=zsNnxsP2T4VBzldpbUUvubrx2ZA%3D"
  },
  "author": VideoAuthor,
  "music": {
    "id": string, // "6909845771187193857",
    "title": string, // "Cristal \u0026 МОЁТ",
    "playUrl": string, // "https://sf58-ies-music-sg.tiktokcdn.com/obj/tiktok-obj/40c0acac58dcf7eb51aaf21315437441.m4a",
    "coverThumb": string, // "https://p58-sg.tiktokcdn.com/aweme/100x100/tos-alisg-v-2102/74619662be8441b0a127832953faef40.jpeg",
    "coverMedium": string, // "https://p58-sg.tiktokcdn.com/aweme/200x200/tos-alisg-v-2102/74619662be8441b0a127832953faef40.jpeg",
    "coverLarge": string, // "https://p58-sg.tiktokcdn.com/aweme/720x720/tos-alisg-v-2102/74619662be8441b0a127832953faef40.jpeg",
    "authorName": string, // "Morgenshtern",
    "original": boolean, // boolean,
    "duration": number, //38,
    "album": string, // "Cristal \u0026 МОЁТ"
  },
  "challenges": ProfileChallenge[ ],
  "stats": {
    "diggCount": number, //106,
    "shareCount": number, //4,
    "commentCount": number, //9,
    "playCount": number, //1558
  },
  "duetInfo": {
    "duetFromId": string, // "0"
  },
  "originalItem": boolean, // boolean,
  "officalItem": boolean, // boolean,
  "textExtra":
    {
      "awemeId": string,
      "start": number, //56,
      "end": number, //64,
      "hashtagName": string, // "фриланс",
      "hashtagId": string,
      "type": number, //1,
      "userId": string,
      "isCommerce": boolean, // boolean,
      "userUniqueId": string,
      "secUid": string, // "string"
    }[  ],
  "secret": boolean, // boolean,
  "forFriend": boolean, // boolean,
  "digged": boolean, // boolean,
  "itemCommentStatus": number, // 0,
  "showNotPass": boolean, // boolean,
  "vl1": boolean, // boolean,
  "itemMute": boolean, // boolean,
  "authorStats": AuthorStats,
  "privateItem": boolean, // boolean,
  "duetEnabled": boolean, // true,
  "stitchEnabled": boolean, // true,
  "shareEnabled": boolean, // true,
  "stickersOnItem": [
    {
      "stickerType": number, // 4,
      "stickerText": string [] // "Получаем заказы на Upwork быстрен всех"
    }
  ],
  "isAd": boolean, // false
}

type ProfileVideoListResponse = {
  "statusCode"?: number, // 0,
  "itemList": ProfileVideo[],
  "cursor"?: string, // "1608218154000",
  "hasMore": boolean
}

export default {
  getProfileVideosBySecUid(secUid: string, lastCursor: string): Promise<ProfileVideoListResponse> {
    return axios.get(`https://m.tiktok.com/api/post/item_list/?aid=1988&count=30&cursor=${lastCursor}&secUid=${secUid}`)
      .then(res => res.data);
  },
  getChallengeVideosByChallengeID(challengeID: string, lastCursor: string): Promise<ProfileVideoListResponse> {
    return axios.get(`https://m.tiktok.com/api/challenge/item_list/?aid=1988&count=35&challengeID=${challengeID}&cursor=${lastCursor}`)
      .then(res => res.data);
  }
}
