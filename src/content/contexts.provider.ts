import * as React from "react";
import { useContext } from "react";

type  ItemsContextType = {
  [id: string]: any[]
};

type  LastCursorType = {
  [id: string]: string
};

export const ItemsContext = React.createContext<ItemsContextType>({})
export const LastCursorDict = React.createContext<LastCursorType>({})

export const useItems = () => useContext(ItemsContext);
export const useLastCursor = () => useContext(LastCursorDict);
