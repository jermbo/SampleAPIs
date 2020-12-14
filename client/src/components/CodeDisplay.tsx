import React from "react";

const CodeDisplay: React.FC = () => {
  return (
    <div className="code-group">
      <button className="copy">Copy</button>
      <div className="copied">
        <p>Copied!</p>
      </div>
      <code spellCheck="false">
        <p>const baseURL = ''</p>
        <p>fetch(baseURL)</p>
        <p>.then(resp =&lt; resp.json())</p>
        <p>.then(data =&lt; console.log(data));</p>
      </code>
      <textarea className="hidden"></textarea>
    </div>
  );
};

export default CodeDisplay;
