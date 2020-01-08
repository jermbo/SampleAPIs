const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 5001;
const pages = [
  "futurama",
  "avatar",
  "baseball",
  "recipes",
  "fakebank",
  "football",
  "countries",
  "presidents",
  "simpsons",
  "hurricanes",
  "movies",
  "wines",
  "health",
  "beers",
  "switch",
  "playstation",
  "xbox"
];

const app = express();

// app.get("api/reset", (req, res) => {
//   pages.forEach(page => {
//     fs.copyFile(
//       `./api/${page}/${page}.json.backup`,
//       `./${page}/${page}.json`,
//       err => {
//         if (err) {
//           console.error(err);
//         }
//       }
//     );
//   });
//   res.end("ok");
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.use(express.static(path.join(__dirname, "/public")));

pages.forEach(page => {
  app.use(`/${page}`, express.static(path.join(__dirname, `/api/${page}`)));
  app.use(
    `/${page}/api`,
    jsonServer.router(path.join(__dirname, `/api/${page}/${page}.json`))
  );
});

app.listen(port, () => {
  console.log(`Express is now : http://localhost:${port}`);
});
