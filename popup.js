var itemsDict = {};
var lastCursorDict = {};

if (!+localStorage.getItem('timeout')) {
    localStorage.setItem('timeout', 1000);
}

var tiktokParse = () => {
    const nick = document.querySelector('meta[property="twitter:creator:id"]').content;

    const loadedVideosCount = document.querySelectorAll('.video-feed-item-wrapper').length;
    const markedVideosCount = document.querySelectorAll('.video-feed-item-wrapper.marked').length;
    let lastCursor;
    if (lastCursorDict[nick] || itemsDict[nick] && loadedVideosCount <= markedVideosCount) {

        addViewsCount(nick, "data-Views", "playCount");
        addViewsCount(nick, "data-Shares", "shareCount");
        addViewsCount(nick, "data-Comments", "commentCount");

        addAverageCounterPerVideo(nick, "data-avg-Views", "playCount");
        addAverageCounterPerVideo(nick, "data-avg-Shares", "shareCount");
        addAverageCounterPerVideo(nick, "data-avg-Comments", "commentCount");
        addAverageERPerVideo(nick, "data-avg-ER");
        addAverageCreatedTimePerVideo(nick, "data-avg-CreatedTime", "tt-analytic-2");
        addAverageVideoCountPerDay(nick, "data-avg-VideosPerDay", "tt-analytic-2");
        return;
    }

    if (!itemsDict[nick] || !itemsDict[nick].length) {
        lastCursor = new Date().getTime() * 1000;
        itemsDict[nick] = [];
    } else {
        const minTime = itemsDict[nick].reduce((acc, val) => {
            return acc < val.createTime ? acc : val.createTime;
        })
        lastCursor = minTime * 1000; // itemsDict[nick][itemsDict[nick].length - 1].createTime * 1000;
    }
    const meta = document.querySelector('meta[property="al:ios:url"]').content;
    const url1 = new URL(`https://tiktok.com/${meta.replace('snssdk1233://', '')}`);
    const tagId = url1.pathname.split('/')[url1.pathname.split('/').length - 1];

    let xhr = new XMLHttpRequest();

    xhr.open('GET', `https://m.tiktok.com/api/item_list/?count=30&id=${tagId}&maxCursor=${lastCursor}&minCursor=0&sourceType=8`);

    xhr.responseType = 'json';

    xhr.onload = function () {

        localStorage.setItem('timeout', 1000);

        let responseObj = xhr.response;
        if (!responseObj.hasMore) {
            lastCursorDict[nick] = lastCursor;
        }
        if (!responseObj.items && itemsDict[nick] && itemsDict[nick].length) {

            for (let i = 0; i < itemsDict[nick].length; i++) {
                const item = itemsDict[nick][i];

                const link = document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
                if (!link) {
                    continue;
                }

                addItem(item, link);
            }

            document.querySelectorAll(`a[href^="https://www.tiktok.com/@${nick}/video/"]`).forEach(link => link.classList.add('marked'));
            sortByER();
        } else {

            itemsDict[nick].push(...responseObj.items);

            const shareHeader = document.querySelector('.share-layout-header.share-header');

            const row1 = document.createElement('h2');
            shareHeader.insertBefore(row1, document.querySelector('.share-desc'));
            row1.classList.add('count-infos');
            row1.classList.add('tt-analytic-1');

            const row2 = document.createElement('h2');
            shareHeader.insertBefore(row2, document.querySelector('.share-desc'));
            row2.classList.add('count-infos');
            row2.classList.add('tt-analytic-2');

            addViewsCount(nick, "data-Views", "playCount", "tt-analytic-1");
            addViewsCount(nick, "data-Shares", "shareCount", "tt-analytic-1");
            addViewsCount(nick, "data-Comments", "commentCount", "tt-analytic-1");

            addAverageCounterPerVideo(nick, "data-avg-Likes", "diggCount", "tt-analytic-2");
            addAverageCounterPerVideo(nick, "data-avg-Views", "playCount", "tt-analytic-2");
            addAverageCounterPerVideo(nick, "data-avg-Shares", "shareCount", "tt-analytic-2");
            addAverageCounterPerVideo(nick, "data-avg-Comments", "commentCount", "tt-analytic-2");
            addAverageERPerVideo(nick, "data-avg-ER", "tt-analytic-2");
            addAverageCreatedTimePerVideo(nick, "data-avg-CreatedTime", "tt-analytic-2");
            addAverageVideoCountPerDay(nick, "data-avg-VideosPerDay", "tt-analytic-2");

            for (let i = 0; i < responseObj.items.length; i++) {
                const item = responseObj.items[i];

                const link = document.querySelector(`a[href^="https://www.tiktok.com/@${nick}/video/${item.id}"]`)
                if (!link) {
                    continue;
                }

                addItem(item, link);
            }
            sortByER();
        }
    };

    xhr.onerror = () => {
        localStorage.setItem('timeout', 20000);
    }

    xhr.send();

    clearInterval(interval);
    interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))
};

var interval = setInterval(tiktokParse, +localStorage.getItem('timeout'))

let addItem = (item, link) => {
    if (link.getAttribute('data-ER')) {
        return;
    }

    addLikes(link, item.stats.diggCount);

    const firstContainer = document.createElement('strong');
    firstContainer.classList.add('jsx-1036923518');
    firstContainer.classList.add('video-bottom-info');
    link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar').appendChild(firstContainer);

    addShare(firstContainer, item);
    addComment(firstContainer, item);
    addER(link, item);

    link.classList.add('marked');
}

let addShare = (firstContainer, item) => {

    const shareButton = document.createElement('svg');
    shareButton.classList.add('custom-share');

    const shareText = document.createElement('strong');
    shareText.classList.add('jsx-1036923518');
    shareText.classList.add('video-count');
    shareText.innerText = item.stats.shareCount;

    firstContainer.appendChild(shareButton);
    firstContainer.appendChild(shareText);
}

let addComment = (firstContainer, item) => {

    const commentButton = document.createElement('strong');
    commentButton.classList.add('custom-comment');

    const commentText = document.createElement('strong');
    commentText.classList.add('jsx-1036923518');
    commentText.classList.add('video-count');
    commentText.innerText = item.stats.commentCount;

    firstContainer.appendChild(commentButton);
    firstContainer.appendChild(commentText);
}

let addER = (link, item) => {

    const ERContainer = document.createElement('strong');
    ERContainer.classList.add('jsx-1036923518');
    ERContainer.classList.add('video-bottom-info');
    link.querySelector('.jsx-1036923518.card-footer.normal.no-avatar').appendChild(ERContainer);

    const ERButton = document.createElement('svg');
    ERButton.classList.add('jsx-1036923518');
    ERButton.classList.add('video-count');
    ERButton.textContent = 'ER';
    ERContainer.appendChild(ERButton);

    const ERText = document.createElement('strong');
    ERText.classList.add('jsx-1036923518');
    ERText.classList.add('video-count');

    const ER = ((item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount);
    ERText.innerText = ER.toFixed(2) + '%';
    ERContainer.appendChild(ERText);
    link.setAttribute('data-ER', ER);
}

let addLikes = (linkElement, likesCount) => {
    const likesButton = document.createElement('strong');
    likesButton.classList.add('custom-like');

    const likesText = document.createElement('strong');
    likesText.classList.add('jsx-1036923518');
    likesText.classList.add('video-count');
    likesText.innerText = likesCount;

    linkElement.querySelector('.jsx-1036923518 .video-bottom-info').appendChild(likesButton);
    linkElement.querySelector('.jsx-1036923518 .video-bottom-info').appendChild(likesText);
}

let sortByER = () => {
    var array = Array.from(document.querySelectorAll(`a[data-ER]`))
    array = array.sort((a, b) => {
        if (+a.getAttribute('data-ER') > +b.getAttribute('data-ER')) {
            return -1;
        }
        if (+a.getAttribute('data-ER') < +b.getAttribute('data-ER')) {
            return 1;
        }
        // a должно быть равным b
        return 0;
    })
    array = array.map(link => link.closest('.video-feed-item.three-column-item'))
    array.forEach(e => document.querySelector(".video-feed.compact").appendChild(e));
}

let convertNumberToString = (number) => {
    let result = '';
    if (number > 1000000) {
        result = `${(number / 1000000).toFixed(1)}M`
    } else if (number > 1000) {
        result = `${(number / 1000).toFixed(1)}K`
    } else {
        result = number;
    }
    return result;
}

let addAverageERPerVideo = (nick, dataTag, row) => {

    const fnER = (item) => (item.stats.commentCount + item.stats.diggCount + item.stats.shareCount) * 100 / item.stats.playCount;

    const avgER = (itemsDict[nick].reduce((acc, item) => acc + fnER(item), 0) / itemsDict[nick].length).toFixed(2) + '%';

    const container = document.querySelector(`.count-infos.${row}`)
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, avgER);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = `Avg.${dataTag.split('data-avg-')[1]}`;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = avgER;
    numberCountLabel.setAttribute(`${dataTag}`, avgER);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = `Avg.${dataTag.split('data-avg-')[1]}`;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageVideoCountPerDay = (nick, dataTag, row) => {
    const minTime = itemsDict[nick].reduce((acc, val) => {
        return acc < val.createTime ? acc : val.createTime;
    })

    const maxTime = itemsDict[nick].reduce((acc, val) => {
        return acc > val.createTime ? acc : val.createTime;
    })

    const diffInMs = new Date(maxTime * 1000) - new Date(minTime * 1000)
    const counter =  (diffInMs / (1000 * 60 * 60 * 24 * itemsDict[nick].length)).toFixed(2);

    const container = document.querySelector(`.count-infos.${row}`)
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, counter);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = `Avg.${dataTag.split('data-avg-')[1]}`;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = counter;
    numberCountLabel.setAttribute(`${dataTag}`, counter);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = `Avg.${dataTag.split('data-avg-')[1]}`;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageCreatedTimePerVideo = (nick, dataTag, row) => {

    let counter = (itemsDict[nick].reduce((acc, curr) => {
        const date = new Date(curr.createTime * 1000);
        date.setFullYear(2000, 1, 1);
        return acc + date.getTime()
    }, 0) / itemsDict[nick].length);

    counter = new Date(counter).toLocaleTimeString();

    const container = document.querySelector(`.count-infos.${row}`)
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, counter);

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = `Avg.${dataTag.split('data-avg-')[1]}`;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = counter;
    numberCountLabel.setAttribute(`${dataTag}`, counter);

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = `Avg.${dataTag.split('data-avg-')[1]}`;
    numberContainer.appendChild(numberTextLabel);
}

let addAverageCounterPerVideo = (nick, dataTag, fieldName, row) => {

    const counter = (itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0) / itemsDict[nick].length).toFixed(1);

    const container = document.querySelector(`.count-infos.${row}`)
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, convertNumberToString(counter));

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = `Avg.${dataTag.split('data-avg-')[1]}`;
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = convertNumberToString(counter);
    numberCountLabel.setAttribute(`${dataTag}`, convertNumberToString(counter));

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = `Avg.${dataTag.split('data-avg-')[1]}`;
    numberContainer.appendChild(numberTextLabel);
}

let addViewsCount = (nick, dataTag, fieldName, row) => {

    const counter = itemsDict[nick].reduce((acc, curr) => acc + curr.stats[fieldName], 0);

    const container = document.querySelector(`.count-infos.${row}`)
    let numberContainer = document.querySelector(`div[${dataTag}]`);

    if (!numberContainer) {
        numberContainer = document.createElement('div');
        numberContainer.classList.add('number');
        container.appendChild(numberContainer);
    }
    numberContainer.setAttribute(`${dataTag}`, convertNumberToString(counter));

    let numberCountLabel = document.querySelector(`div[${dataTag}]`);
    if (!numberCountLabel) {
        numberCountLabel = document.createElement('strong');
        numberCountLabel.title = dataTag.split('data-')[1];
        numberContainer.appendChild(numberCountLabel);
    }
    numberCountLabel.textContent = convertNumberToString(counter);
    numberCountLabel.setAttribute(`${dataTag}`, convertNumberToString(counter));

    const numberTextLabel = document.createElement('span');
    numberTextLabel.classList.add('unit');
    numberTextLabel.textContent = dataTag.split('data-')[1];
    numberContainer.appendChild(numberTextLabel);
}
