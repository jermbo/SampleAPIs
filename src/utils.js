const fs = require("fs");

module.exports = {
  getFromFile: getFromFile
};

function getFromFile(fileName) {
  let rawData = fs.readFileSync(fileName);
  let parsedData = JSON.parse(rawData);
  traverse(parsedData);
  return parsedData;
}

function traverse(x) {
  if (isArray(x)) {
    traverseArray(x);
  } else if (typeof x === "object" && x !== null) {
    traverseObject(x);
  }
}

function traverseArray(arr) {
  arr.forEach(function(x) {
    traverse(x);
  });
}

function traverseObject(obj) {
  for (var key in obj) {
    let replaced = key
      .trim()
      .replace(" ", "")
      .replace("-", "");
    if (obj[key] && key !== replaced) {
      obj[replaced] = obj[key];
      delete obj[key];
    }
    if (obj.hasOwnProperty(replaced)) {
      traverse(obj[replaced]);
    }
  }
}

function isArray(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
}
