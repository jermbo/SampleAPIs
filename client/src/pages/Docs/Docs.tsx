import React from "react";
import PageHeaderActions from "../../components/PageHeaderActions/PageHeaderActions";
import "./Docs.scss";


interface Props { }

const Docs: React.FC<Props> = () => {
  return (
    <div className="page-docs">
      <header className="page-header">
        <h2 className="page-header__title">Documentation</h2>
        <p className="page-header__desc">
          <div className="section">
          <p>A simple, no fuss, no mess, no auth playground for learning to play with APIs and call them without thinking of Authentication or permissions.</p>
          </div>
          <div className="section">
            <h2>Purpose</h2>
            <p>Understanding RESTful APIs is hard enough, even without including an authentication mechanism. The sole purpose of this repository is to play with RESTful endpoints and learn. We have a few endpoints that you can start playing around with right away! If you are not finding anything you are interested in, create your own endpoints and/or submit a pull request. Take a look at the <a href="https://github.com/jermbo/SampleAPIs/blob/master/CONTRIBUTING.md">CONTRIBUTING</a> for more information on how to get involved.</p>
          </div>
          <div className="section">
            <h2> How to use the service</h2>
            <p>Choose an endpoint, say "futurama", then choose what information you'd like, say "characters":
              <pre>
                fetch("https://api.sampleapis.com/futurama/characters") <br />
                .then(resp =&gt; resp.json()) <br />
                .then(data =&gt; console.log(data)); <br />
              </pre>
              Want to Search? for all chatacters with the name "Bender"?
              <pre>
                fetch(`https://api.sampleapis.com/futurama/characters?name.first=Bender`) <br />
            .then(resp =&gt; resp.json()) <br />
            .then(data =&gt; console.log(data)); <br />
              </pre>
              <p>

            Want to learn more? Try watching this video that will explain how to use this api and showcase the results 
            without any front end coding: <a href="https://www.youtube.com/watch?v=lCs9EriXnY8">https://www.youtube.com/watch?v=lCs9EriXnY8</a>

              </p>
            </p>
          </div>
          <div className="section">
            <p>
              You also have full CRUD, so you can add information or correct existing ones.
              <br /> <br />
              Note: Just know that we reset all datapoints weekly and each time we have a new endpoint added.
            </p>
          </div>
          <div className="section">
            <h2>Disclaimers</h2>
            <p>
              <ul>
                <li>The data on this site is for educational purposes only and is not owned by SampleAPIs.com</li>
                <li>Data will be reset back to its original state on a regular basis. If you are updating or adding data to the endpoints and want to have them persist as part of the collection, please contribute to the repo by submitting a pull request.</li>
                <li>By using SampleAPIs.com you agree to the following terms: This service is provided under an "as is" condition. It might change or will be discontinued without prior notice. The maker of this service can't be held liable in any way for any reason.</li>
              </ul>
            </p>
          </div>














        </p>

      </header>
    </div>

  );
};

export default Docs;
