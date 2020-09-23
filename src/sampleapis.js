const express = require("express");
const path = require("path");
const cors = require("cors");
const ApiList = require("./apiList");
// const morgan = require('morgan');
// const corsOptions = require("./cors");

// Express App
const app = express();
const port = process.env.PORT || 5555;

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, `/views`));

// CORS
app.use(cors());

// For debugging;
// app.use(morgan('dev'));

// Routes
const reset = require("./routes/reset");
const baseApis = require('./routes/base-apis');

app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList)
  });
});

app.use('/', baseApis);
app.use("/reset", reset);

// Starting App
app.listen(port, () => {
  console.log(`App is listening on: http://localhost:${port}`);
})
