import { useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 1500;

/** Clipboard write with a transient "Copied!" flag for button feedback. */
export const useCopied = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), FEEDBACK_MS);
  };

  return { copied, copy };
};
