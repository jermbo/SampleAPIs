const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../api");

const getAPIListData = async () => {
  let files = await fs.readdirSync(directoryPath);
  files = files.filter((f) => !f.includes(".backup"));
  return files.map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, `../api/${file}`)));
    const endpoints = Object.keys(data);
    const metaData = data.metaData[0];
    const name = file.split(".")[0].toLowerCase();

    return {
      name,
      link: name,
      metaData,
      endpoints: endpoints.filter((e) => e != "metaData"),
    };
  });
};

module.exports = {
  getAPIListData,
};
