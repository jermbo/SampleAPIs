import React from "react";
// @ts-ignore
import Codepen from "react-codepen-embed";

interface Props {
  hash: string;
  title: string;
}

const CodepenWrapper: React.FC<Props> = ({ hash, title }) => {
  return (
    <article className="penWrapper">
      <h2>{title}</h2>
      <Codepen
        hash={hash}
        user="jermbo"
        defaultTab="js,result"
        preview
        loader={() => <div>Loading...</div>}
      />
    </article>
  );
};

export default CodepenWrapper;
