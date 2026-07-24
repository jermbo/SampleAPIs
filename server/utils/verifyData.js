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

    // `id` is exempt on POST/PUT — the router assigns or preserves it.
    const bodyKeys = ["id", ...Object.keys(body)];

    if (method == "POST" || method == "PUT") {
      if (!hasAllData(dataKeys, bodyKeys)) {
        return res.status(400).json({
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
      // Check the raw body keys here — including the exempt "id" would make
      // this pass for any body, since every collection record has an id.
      if (!hasRelativeData(dataKeys, Object.keys(body))) {
        return res.status(400).json({
          error: 400,
          message:
            "It appears you are trying to manipulate data that does not exist on the object. Check out the expected shape versus what was sent.",
          expected: expectedObjectData,
          received: body,
        });
      }

      return next();
    }

    return next();
  } catch (ex) {
    return res.status(400).json({
      error: 400,
      message: `Unexpected data sent in! ${method} NOT accepted. Please send valid data next time!`,
      received: body,
    });
  }
};

function hasAllData(dataKeys, bodyKeys) {
  return dataKeys.every((dataKey) => bodyKeys.includes(dataKey));
}

function hasRelativeData(dataKeys, bodyKeys) {
  return bodyKeys.some((bodyKey) => dataKeys.includes(bodyKey));
}

module.exports = { verifyData };
