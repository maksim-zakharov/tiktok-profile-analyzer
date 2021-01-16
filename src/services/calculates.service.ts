export default {
  addViewsCount(itemsDict, nick, fieldName) {

    let value = 0;
    if (itemsDict[nick]?.length) {
      value = itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0);
    }

    return value;
  },
  addVideosCount(itemsDict, nick) {

    let counter = 0;
    if (itemsDict[nick]?.length) {
      counter = itemsDict[nick].length; // [0].authorStats.videoCount;
    }

    return counter;
  },

  addRatingPerViews(itemsDict, nick, fieldName) {
    let counter = '';
    if (itemsDict[nick]?.length) {
      counter = (itemsDict[nick].reduce((acc, curr) => curr.stats.playCount ? acc + curr.stats[fieldName] * 100 / curr.stats.playCount : acc, 0) / itemsDict[nick].length).toFixed(2);
    }

    return counter;
  },

  addAverageCounterPerVideo(itemsDict, nick, fieldName) {
    let counter = '';
    if (itemsDict[nick]?.length) {
      counter = (itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0) / itemsDict[nick].length).toFixed(1);
    }

    return counter;
  },

  addAverageVideoCountPerDay(itemsDict, nick) {
    let counter;
    if (itemsDict[nick]?.length) {
      const minTime = itemsDict[nick].reduce((acc, val) => {
        return acc < val.createTime ? acc : val.createTime;
      });

      const maxTime = itemsDict[nick].reduce((acc, val) => {
        return acc > val.createTime ? acc : val.createTime;
      })

      // @ts-ignore
      const diffInMs = new Date(maxTime * 1000) - new Date(minTime * 1000)
      counter = (diffInMs / (1000 * 60 * 60 * 24 * itemsDict[nick].length)).toFixed(2);
    }

    return counter;
  },

  addAverageCreatedTimePerVideo(itemsDict, nick) {
    let counter;
    if (itemsDict[nick]?.length) {
      counter = (itemsDict[nick].reduce((acc, curr) => {
        const date = new Date(curr.createTime * 1000);
        date.setFullYear(2000, 1, 1);
        return acc + date.getTime()
      }, 0) / itemsDict[nick].length);

      counter = new Date(counter).toLocaleTimeString();
    }

    return counter;
  }
}
