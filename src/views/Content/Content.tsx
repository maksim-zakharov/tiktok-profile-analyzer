import * as React from "react";
import {
  createAnalyzeButton, createCsvButton,
  getProfilePage,
  getTagPage, updateProfile
} from "../../content/utilities";
import { useEffect, useState } from "react";
import { useItems, useLastCursor } from "../../content/contexts.provider";
import { Counter } from "../../components/Counter";

export let Content: React.FC = () => {
  const itemsDict = useItems();
  const lastCursorDict = useLastCursor();
// @ts-ignore
  let [state, setState]: any[] = useState({interval: 0, nick: '', counters: {}});

  useEffect(() => {
    createCsvButton(itemsDict, lastCursorDict);

    state.nick = getProfilePage();
    if (!state.nick) state.nick = getTagPage();

    state.interval = setInterval(async () => {

      const counters = await updateProfile(state.nick, itemsDict);

      setState({
        counters: {
          ...counters.filter(curr => curr?.fieldName)
            .reduce((acc, {fieldName, label, value}) => ({[fieldName]: {label, value}, ...acc}), {})
        }
      });
      // @ts-ignore
    }, +localStorage.getItem('timeout'))

    return () => clearInterval(state.interval);
  });

  return (
    <React.Fragment>
      {Object.entries(state.counters).map(([fieldName, counter]: any[]) =>
        <Counter fieldName={fieldName}
                 value={counter.value}
                 text={counter.label}/>)}
    </React.Fragment>
  )
}
