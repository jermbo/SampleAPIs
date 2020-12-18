import React, { useEffect, useState } from "react";
import { URLS } from "../../utils/Config";
import CodeEditor from "../CodeEditor/CodeEditor";

interface Props {
  urlBase: string;
  endpoint: string;
}

const APIFilter: React.FC<Props> = ({ urlBase, endpoint }) => {
  const [html, setHTML] = useState("");
  const [css, setCSS] = useState("");
  const [js, setJS] = useState("");
  useEffect(() => {
    setHTML("<pre>JSON GOES HERE</pre>");
    setJS(`const baseURL = '${URLS.API_LINK}/${urlBase}/${endpoint}';
fetch(baseURL)
  .then(resp => resp.json())
  .then(data => displayData(data));

function displayData(data) {
  document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
}`);
  }, [urlBase, endpoint]);

  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
      </html>
    `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  return (
    <div className="editor">
      <div className="pane top-pane">
        <CodeEditor language="xml" displayName="HTML" value={html} onChange={setHTML} />
        <CodeEditor language="css" displayName="CSS" value={css} onChange={setCSS} />
        <CodeEditor language="javascript" displayName="JS" value={js} onChange={setJS} />
      </div>
      <div className="pane">
        <iframe
          style={{
            background: "white",
          }}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="500px"
          srcDoc={srcDoc}
        />
      </div>
    </div>
  );
};

export default APIFilter;
