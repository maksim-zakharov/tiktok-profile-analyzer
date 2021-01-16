import * as React from 'react';
import { useItems, useLastCursor } from "../content/contexts.provider";
import { analyzeProfile, analyzeTagPage, getProfilePage } from "../content/utilities";

type ButtonType = {
  data: string,
  text: string
};

export const Button: React.FC<ButtonType> = ({data, text}: ButtonType) => {

  let lastCursorDict = useLastCursor()
  let itemsDict = useItems();

  const onClick = async () => {
    const result = (getProfilePage() ? await analyzeProfile(itemsDict, lastCursorDict) : await analyzeTagPage(itemsDict, lastCursorDict))
    console.log(result);
    itemsDict = {...result?.itemsDict}
    lastCursorDict = {...result?.lastCursorDict}
  }

  return (
    <button
      onClick={onClick}
      className="follow-button jsx-3251180706 jsx-683523640 share-follow tiktok-btn-pc tiktok-btn-pc-medium tiktok-btn-pc-primary"
      {...{[data]: 'button'}}
    >
      {text}
    </button>
  );
}
