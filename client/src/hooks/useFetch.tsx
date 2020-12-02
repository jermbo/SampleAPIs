import { useEffect, useState } from "react";
import { AppStateEnum } from "../utils/Enums";

type ReturnState<T> = {
  state: AppStateEnum;
  data: T | null;
};

function useFetch<T>(url: string): ReturnState<T> {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState(AppStateEnum.initial);

  const getData = async () => {
    setState(AppStateEnum.loading);
    try {
      const resp = await fetch(url);
      const json = await resp.json();
      setData(json);
      setState(AppStateEnum.ready);
    } catch (err) {
      console.log(err);
      setState(AppStateEnum.error);
    }
  };

  useEffect(() => {
    if (state === AppStateEnum.initial) {
      getData();
    }
  }, []);

  return { state, data };
}

export default useFetch;
