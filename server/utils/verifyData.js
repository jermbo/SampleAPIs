 const path = require("path");
 const { getFromFile } = require("./utils");

const verifyData = (req, res, next) => {
  const { method, originalUrl } = req;
  // Reads don't carry a body to validate. Bail out before touching req.body or
  // parsing the path — under Express 5 req.body is undefined on bodyless
  // requests, which the shape checks below would otherwise choke on.
  if (method === "GET" || method === "DELETE") {
    return next();
  }
  const body = req.body || {};
  try {
    // Strip any query string so the resource name resolves cleanly.
    const [baseParent, endPoint] = originalUrl
      .split("?")[0]
      .split("/")
      .filter((d) => d);
    const dataPath = path.join(__dirname, `../api/${baseParent}.json`);
    const data = getFromFile(dataPath)[endPoint][0];

    const dataKeys = Object.keys(data);

    const expectedObjectData = {};
    for (let key in data) {
      let type = typeof data[key];
      if (type == "object") {
        type = Array.isArray(data[key]) ? "array" : "object";
      }
      expectedObjectData[key] = type;
    }

    const bodyKeys = ["id", ...Object.keys(body)];

    if (method == "POST" || method == "PUT") {
      if (!hasAllData(dataKeys, bodyKeys)) {
        return res.json({
          error: 400,
          message:
            "The data you are sending does not match the existing data object. Check out the expected shape versus what was sent.",
          expected: expectedObjectData,
          received: body,
        });
      }

      return next();
    }

    if (method == "PATCH") {
      if (!hasRelativeData(dataKeys, bodyKeys)) {
        return res.json({
          error: 400,
          message:
            "It appears you are trying to manipulate data that does not exist on the object. Check out the expected shape versus what was sent.",
          expected: expectedObjectData,
          received: body,
        });
      }

      return next();
    }

    if (method == "GET" || method == "DELETE") {
      return next();
    }

  } catch (ex) {
         //console.log("invalid data sent in: ",body)
        return res.json({
          error: 500,
          message:
            `Unexpected data sent in! ${method} NOT accepted. Please send valid data next time!`,
          received: body,
        });


  } // end of try 
};

function hasAllData(dataKeys, bodyKeys) {
  return dataKeys.every((dataKey) => bodyKeys.includes(dataKey));
}

function hasRelativeData(dataKeys, bodyKeys) {
  return bodyKeys.some((bodyKey) => dataKeys.includes(bodyKey));
}

module.exports = { verifyData };
