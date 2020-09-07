const express = require("express");
const path = require("path");
const morgan = require('morgan');
const cors = require("cors");
const jsonServer = require("json-server");
const jsonGraphqlExpress = require("json-graphql-server")
const ApiList = require("./apiList");
const { getFromFile } = require("./utils");
//const corsOptions = require("./cors");

// Express App
const app = express();

//CORS
app.use(cors());

//for debuging;
//app.use(morgan('dev'));

// Routes
const reset = require("./routes/reset");

let port = process.env.PORT || 5555;

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, `/views`));

app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList)
  });
});

app.use("/reset", reset);

// Main EndPoint Route
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

// API EndPoint Route
ApiList.forEach(({ link }) => {
  app.use(
    `/${link}/api`,
    jsonServer.router(path.join(__dirname, `/api/${link}.json`))
  );

  let data = getFromFile(path.join(__dirname, `/api/${link}.json`));
  try {
    app.use(`/${link}/graphql`, jsonGraphqlExpress.default(data));
  } catch (err) {
    console.log(`Unable to set up /${link}/graphql`);
    console.error(err);
  }
});



// Starting App
app.listen(port, () => {
  console.log(`App is listening on: http://localhost:${port}`);
})
