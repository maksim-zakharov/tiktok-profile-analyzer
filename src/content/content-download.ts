// content-script.js
import { download } from '../pages/background/download-video'

let SELECTOR: any = {
  buttons: {
    dw: '.ext-dw-button',
  },
  feed: {
    listens: [
      '.lazyload-wrapper',
      '.tt-feed',
      '.video-feed-item',
    ],
    appendTo: '.default',
  },
  card: {
    listens: [
      '.video-card-big',
      '.video-card-browse',
      '.video-player',
    ],
    appendTo: '.video-card-container',
  }
}

SELECTOR.listens = [
  ...SELECTOR.feed.listens,
  ...SELECTOR.card.listens,
]

SELECTOR.appendTo = [
  SELECTOR.feed.appendTo,
  SELECTOR.card.appendTo,
]

let $dwButton = document.createElement('div')

$dwButton.className = SELECTOR.buttons.dw.substr(1);
$dwButton.innerHTML = `
    <div class="ext-lds-circle"><div></div></div>
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" fill="#FE2C55" fill-opacity="0.6"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M34 36L16 36L16 33L34 33L34 36ZM25 30L17.7397 21.8322C17.4531 21.5097 17.682 21 18.1134 21L23 21L23 15L27 15L27 21L31.8866 21C32.318 21 32.5469 21.5097 32.2603 21.8322L25 30Z" fill="white"/>
    </svg>
`;

function loading(state = false) {
  document.querySelectorAll(SELECTOR.buttons.dw).forEach(($btn) => {
    state ? $btn.classList.add('loading') : $btn.classList.remove('loading');
  });
}

const view = {
  init() {
    document.querySelectorAll(SELECTOR.listens).forEach(($card) => {
      ($card.querySelectorAll(SELECTOR.appendTo) || $card.closest(SELECTOR.appendTo)).forEach(($container) => {
        view.addButton($container);
        view.addTimeline($container);
      })
    })

    chrome.runtime.onMessage.addListener(async ({cmd, links}) => {
      if (cmd === 'onDownloadLink') {
        if (links.inner) {
          await onDownloadLink(links);
        } else {
          console.log('Не получил ссылку перез скачиванием')
        }
      }
    });
  },
  addTimeline($container) {
    SELECTOR.appendTo.forEach((selector) => {
      let $video = $container.querySelector('video') || $container.closest('video')
      if ($video && !$video.inited) {
        $video.timer && clearTimeout($video.timer);
        $video.timer = setTimeout(() => {
          let $oldVideoTimeline = $container.querySelector('.ext-timeline');
          $oldVideoTimeline && $oldVideoTimeline.remove();
          let $videoTimeline = document.createElement('div')
          $videoTimeline.className = 'ext-timeline';
          $container.appendChild($videoTimeline)
          $video.ontimeupdate = (event) => {
            let duration = $video.duration;
            let step = duration / 100;
            let asd = Math.abs((duration - event.currentTarget.currentTime) / step - 100) / 100;
            $videoTimeline.style.transform = `scaleX(${asd})`
          };
          $video.inited = true;
        }, 1000)
      }
    })
  },
  addButton($container) {
    $container.timer && clearTimeout($container.timer);
    $container.timer = setTimeout(() => {
      if (!$container.querySelector(SELECTOR.buttons.dw)) {
        const $cloneButton = $dwButton.cloneNode(true)
        $cloneButton.addEventListener('click', async (event: any) => {

          if (event.currentTarget) {
            const $containerLink = event.currentTarget.parentElement.closest('.item-video-card-wrapper');
            const tiktokURL = $containerLink ? $containerLink.href : location.href

            loading(true)
            chrome.runtime.sendMessage({
              cmd: 'download',
              data: {
                tiktokURL
              }
            });
          } else {
            console.log('Цели клика нет клика.')
          }
        })

        $container.appendChild($cloneButton)
      }
    }, 10)
  }
}

view.init();

async function onDownloadLink(links, name = 'tiktok video', errorCounter = 0) {
  let a = document.createElement("a");

  try {
    const response = await fetch(links.outer);
    const blob = await response.blob();
    a.download = name;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    loading(false);
  } catch (e) {
    console.log(`Ошибка при загрузке самого видео файла номер: ${errorCounter}`);
    if (errorCounter <= 1) {
      chrome.runtime.sendMessage({
        cmd: 'download',
        data: {
          tiktokURL: links.inner,
          errorCounter: errorCounter + 1
        }
      });

    } else {
      loading(false);
      console.log(`Ошибка финальный сбой при загрузке видео файла`);
    }
  }

  // delete a;
}

chrome.storage.onChanged.addListener(async (event) => {
  console.log('location.hostname', location.hostname);
  if (location.hostname === "snaptik.app" && event.downloadIn && event.downloadIn.newValue) {
    await download.onController(event.downloadIn.newValue.url);
  }
});

let observer = new MutationObserver(mutations => {
  mutations
    .forEach(mutation =>
      Array.from(mutation.addedNodes as any)
        .filter(node => node instanceof HTMLElement)
        .forEach((node: any) => {

          SELECTOR.listens.filter(select => node.classList.contains(select.substr(1))).forEach((select) => view.init())
        }))
});

let $listenedContainer = document.querySelector('body');
$listenedContainer && observer.observe($listenedContainer, {childList: true, subtree: true});
