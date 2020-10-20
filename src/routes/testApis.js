const express = require("express");
const ApiList = require("../apiList");
const fetch = require("node-fetch");
const router = express.Router();

/// Main EndPoint Route
router.get("/",   (req, res) => {
    res.set('Content-Type', 'text/html');
    res.write("<html><head><title>Testing...</title></head><body>");
    res.write("Testing all endpoints...<BR>");

    let PromiseFetches = [];
    ApiList.forEach( (apiDeets)  => {
        //res.write(`<hr>Testing ${apiDeets.title}...<BR>`);
        PromiseFetches.push(apiDeets.endPoints.map( (endpoint) => {
          const url = `http://${req.headers.host}/${apiDeets.link}/api/${endpoint}`;

         
            return fetch(url)
            .then(res => res.json())
            .then(collection => {
              //console.log(collection.length);
              res.write(`calling ${url}: `);
              if (collection && collection.length) {
              res.write(`${collection.length} records found<BR>`);
              } else {
                res.write('<font color=red>FAIL!!!!</font><BR>')
              }
              return collection.length;
            })
            .catch(err => {
              console.log(`Error fetching ${url}`);
              console.error(err);
  
              res.write(`Error fetching ${url}`);
              res.write(err);
              return 0;
            });
        }));
      });
      //console.log("PromiseFetches",PromiseFetches);
      Promise.all(PromiseFetches).then((results ) => {
        
        setTimeout(()=> {
          res.end("</html>");
        },1000);
      });
      

  
});


// API EndPoint Route

module.exports = router;