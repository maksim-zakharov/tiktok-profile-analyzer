import axios from "axios";

export default {
  getProfileVideos(tagId: string, lastCursor: string) {
    return axios.get(`https://m.tiktok.com/api/item_list/?count=30&id=${tagId}&maxCursor=${lastCursor}&minCursor=0&sourceType=8`).then(res => res.data)
  },
  getTagVideos(tagId: string, lastCursor: string) {
    return axios.get(`https://m.tiktok.com/api/challenge/item_list/?aid=1988&count=35&challengeID=${tagId}&cursor=${lastCursor}`).then(res => res.data)
  }
}
