import React, { useEffect, useState } from "react";

type ReturnType<T> = [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorageState<T>(key: string, defaultValue: T): ReturnType<T> {
  const [state, setState] = useState<T>(() => {
    if (!defaultValue) {
      return;
    }

    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.log(e);
      }
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
