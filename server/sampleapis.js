const express = require("express");
const path = require("path");
const cors = require("cors");

// Express App
const app = express();
const port = process.env.PORT || 5555;

// JSON Parser

// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Files
app.use(express.static(path.join(__dirname, "/public")));

// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

// CORS
app.use(cors());

// For debugging;
// app.use(morgan('dev'));

// Routes
const reset = require("./routes/reset");
const baseApis = require("./routes/base-apis");
const frontend = require("./routes/frontend");

app.use("/frontend", frontend);

const create = require("./routes/create-apis");

const { generateAPIListData } = require("./utils/getAPIListData");
const generateNewAPIListData = async (req, res) => {
  await generateAPIListData();

  res.json({
    response: 200,
    data: {
      message: "Created",
    },
  });
};

//! Deprecation Notice
//* This is to serve the old static design site.
//* The `apiList.js` will be removed in future versions.
const ApiList = require("./apiList");
app.get("/", (req, res) => {
  res.render("index", {
    apiList: JSON.stringify(ApiList),
  });
});

app.use("/reset", reset);
app.use("/create", create);
// app.use("/custom", custom);
app.use("/generate", generateNewAPIListData);
app.use("/", baseApis);

app.use(errorHandler)

function errorHandler (err, req, 
res, next) {
  res.status(500) 
  console.error(err)
  res.json( { error: 
 "fuckery deteted"})
}// Starting App
app.listen(port, () => {
  console.log(`App is listening on: http://localhost:${port}`);
});
