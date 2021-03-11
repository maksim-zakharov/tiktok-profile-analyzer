import * as React from 'react';
import { render } from 'react-dom';
import { Content, getOrCreateContainer } from './Content';
import { VideoItem } from '../../components/VideoItem';
import { Button } from "../../components/Button";
import { SFCElement } from "react";

let renderVideos = () => {
  document.querySelectorAll(`a[href^="https://www.tiktok.com/@"]:not(.marked)`).forEach(element => {
    const href = element.getAttribute('href');
    if (!href) return;
    let hrefParts = href.split('/');
    if (!hrefParts.length) return;

    const videoId = hrefParts[hrefParts.length - 1]

    hrefParts = href.split('@');
    if (!hrefParts.length) return;
    const nick = hrefParts[1].split('/')[0];
    // @ts-ignore
    render(<VideoItem nick={nick} id={videoId}/>, element.querySelector('.card-footer'));

  })
}

const titleObserver = new MutationObserver(renderVideos);
const videoObserver = new MutationObserver(renderVideos);
const contentObserver = new IntersectionObserver(() => {
  render(<Content/>, getOrCreateContainer('tt-analytic-1'));

  renderWithReplace(
    <Button data="data_content_start_analyzing" text={chrome.i18n.getMessage('content_start_analyzing')}/>
    , document.querySelector('.share-title-container'), "[data_content_start_analyzing]")

  titleObserver.disconnect();
// @ts-ignore
  document.querySelector('.tt-analytic-1') && titleObserver.observe(document.querySelector('.tt-analytic-1'), {
    subtree: true,
    attributes: true
  });
});

// @ts-ignore
document.querySelector('.share-title') && contentObserver.observe(document.querySelector('.share-title'));
// @ts-ignore
document.querySelector(`.video-feed`) && videoObserver.observe(document.querySelector(`.video-feed`), {childList: true});

const renderWithReplace = (element: SFCElement<any>, container: Element | null, existSelector?: string) => {
  if (document.querySelector(`${existSelector}`)) {
    return;
  }
  const tempButtonTarget = document.createElement('div');
  container?.appendChild(tempButtonTarget);
  const reactButton = tempButtonTarget.querySelector('button');
  if (reactButton) {
    tempButtonTarget.parentNode?.appendChild(reactButton);
    tempButtonTarget.closest('div')?.remove();
  }
  render(element, tempButtonTarget);
}

// const [storage, setStorage] = useState({});
// const onChangeStorageCallback = useCallback(changes => {
//   console.log(changes);
//   for (let key in changes) {
//     setStorage({
//       [key]: changes[key].newValue
//     })
//   }
// }, []);
//
// useEffect(() => {
//   chrome.storage.onChanged.addListener(onChangeStorageCallback);
//
//   return () => {
//     chrome.storage.onChanged.removeListener(onChangeStorageCallback);
//   };
// }, [onChangeStorageCallback]);
