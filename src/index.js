const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 5001;
const ApiList = require("./apiList");
const jsonGraphqlExpress = require("json-graphql-server");
const { getFromFile } = require("./utils");

const app = express();

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View EngineÍ
app.set("view engine", "pug");
app.set("views", path.join(__dirname, `/views`));

// ----------------------
// Routes

// Main page
app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList)
  });
});

// Individual Page Route
app.get("/:id", (req, res) => {
  const id = req.params.id.toLowerCase();
  const data = ApiList.filter(api => id == api.link.toLowerCase())[0];

  if (data) {
    res.render("page", {
      ...data
    });
  } else {
    res.render("404");
  }
});

var cors = require('cors');

var whitelist = [
  'http://localhost', // add here the url when you access to your angular app
  'http://localhost:5000'
];

var corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: 'accept, content-type'
};

app.use(cors(corsOptions));

// Creating Routes based on the ApiList array
ApiList.forEach(({ link }) => {
  app.use(
    `/${link}/api`,
    jsonServer.router(path.join(__dirname, `/api/${link}.json`))
  );
  let data = getFromFile(path.join(__dirname, `/api/${link}.json`));
  try {
    app.use(`/${link}/graphql`, jsonGraphqlExpress.default(data));
  } catch (err) {
    console.log(`Unable to set up  /${link}/graphql`);
  }
});

// Reset API Route
app.get("/api-reset", (req, res) => {
  pages.forEach(page => {
    fs.copyFile(
      path.join(__dirname, `/api/${page}.json.backup`),
      path.join(__dirname, `/api/${page}.json`),
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  res.send("ok");
});

// Starting App
app.listen(port, () => {
  console.log(`Express is now : http://localhost:${port}`);
});
