import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "../components/Editor";
import EndPointLink from "../components/EndPointLink";
import { GlobalContext } from "../GlobalContext";
import { APIData } from "../utils/Interfaces";

interface ParamTypes {
  id: string;
}

const APIDetails: React.FC = () => {
  const { id } = useParams<ParamTypes>();
  const { apiList } = useContext(GlobalContext);
  const [singleAPI, setSingleAPI] = useState({} as APIData);

  useEffect(() => {
    const api = apiList.filter((a) => a.name === id)[0];
    setSingleAPI(api);
  }, [apiList]);

  const [html, setHTML] = useState("");
  const [css, setCSS] = useState("");
  const [js, setJS] = useState("");
  useEffect(() => {
    setHTML(`<h1>Hello World</h1>`);
    setJS(`const baseURL = 'https://sampleapis.com/futurama/api/questions';
fetch(baseURL)
  .then(resp => resp.json())
  .then(data => document.body.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>");`);
  }, []);

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
    <section className="home-page">
      {!singleAPI?.metaData && <h1>LOADING....</h1>}
      {singleAPI?.metaData && (
        <>
          <div className="home-page-header">
            <Link to="/api-list" className="home-page-action btn">
              Back to List
            </Link>
            <h2 className="home-page__title">{singleAPI.metaData.title}</h2>
            <p>{singleAPI.metaData.longDesc}</p>
            <div className="home-page-actions">
              {singleAPI.endpoints &&
                singleAPI.endpoints.map((endpoint) => (
                  <EndPointLink key={endpoint} baseAPI={singleAPI.link} endpoint={endpoint} />
                ))}
            </div>
          </div>
          <div className="home-page-featured">
            <div className="editor">
              <div className="pane top-pane">
                <Editor language="xml" displayName="HTML" value={html} onChange={setHTML} />
                <Editor language="css" displayName="CSS" value={css} onChange={setCSS} />
                <Editor language="javascript" displayName="JS" value={js} onChange={setJS} />
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
          </div>
        </>
      )}
    </section>
  );
};

export default APIDetails;
