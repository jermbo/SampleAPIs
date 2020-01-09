const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 5001;
const ApiList = require("./apiList");

const app = express();

app.get("/api-reset", (req, res) => {
  pages.forEach(page => {
    fs.copyFile(
      path.join(__dirname, `/api/${page}/${page}.json.backup`),
      path.join(__dirname, `/api/${page}/${page}.json`),
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  res.send("ok");
});

app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList)
  });
});

app.get("/:id", (req, res) => {
  const id = req.params.id.toLowerCase();
  const data = ApiList.filter(api => id == api.title.toLowerCase())[0];

  if (data) {
    res.render("page", {
      ...data
    });
  } else {
    res.render("404");
  }
});

app.use(express.static(path.join(__dirname, "/public")));

ApiList.forEach(({ link }) => {
  console.log(path.join(__dirname, `/api/${link}.json`));
  app.use(
    `/${link}/api`,
    jsonServer.router(path.join(__dirname, `/api/${link}.json`))
  );
});

app.listen(port, () => {
  console.log(`Express is now : http://localhost:${port}`);
});
