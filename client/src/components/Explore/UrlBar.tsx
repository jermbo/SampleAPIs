import React from "react";
import { copyButtonLabel } from "./labels";
import { useCopied } from "./useCopied";

interface Props {
  fullUrl: string;
}

/** The live composed URL — the "what I clicked is what I'd type" lesson. */
const UrlBar: React.FC<Props> = ({ fullUrl }) => {
  const { copied, copy } = useCopied();

  return (
    <div className="qb-url">
      <code className="qb-url__text">{fullUrl}</code>
      <button className="btn" onClick={() => copy(fullUrl)}>
        {copyButtonLabel(copied, "Copy URL")}
      </button>
    </div>
  );
};

export default UrlBar;
