import React, { useEffect, useState } from 'react';
import './styles/styles.scss';

import Endpoints from './components/Endpoints'

function App() {

  const [endpoints, setEndpoints] = useState([]);

  const getData = async () => {
    const resp = await fetch('http://localhost:5555/frontend');
    const data = await resp.json();
    console.log(data);
    setEndpoints(data.APIList);
  }

  useEffect(() => {
    getData();
  }, [])

  return (

    <main>
      <article className="site">
        <div className="site__inner">
          <h1 className="site__title">Sample APIs</h1>
          <p>A fun and safe place to practice with RESTful APIs</p>
          <p>You can use any HTTP verbs (GET, POST, PUT, PATCH and DELETE) and access your resources from anywhere using CORS and JSONP.</p>
          <p>Here is a list of existing APIs to get you started.</p>
          <div className="endpoints">
            <a className="endpoint" href="">info</a>
            <a className="endpoint" href="">characters</a>
            <a className="endpoint" href="">questions</a>
          </div>
        </div>
      </article>
      <Endpoints endpoints={endpoints} />
    </main>
  );
}

export default App;
