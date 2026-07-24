const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../api");
const generatedListPath = path.join(__dirname, "../GeneratedAPIList.js");

const buildAPIListData = () => {
  const files = fs.readdirSync(directoryPath).filter((f) => !f.includes(".backup"));
  return files.map((file) => {
    const data = JSON.parse(fs.readFileSync(path.join(directoryPath, file)));
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

const getAPIListData = async () => buildAPIListData();

const generateAPIListData = async () => {
  const apiData = buildAPIListData();
  // Resolve against __dirname so regeneration doesn't depend on the process cwd.
  const jsFileData = `module.exports = ${JSON.stringify(apiData)}`;
  fs.writeFileSync(generatedListPath, jsFileData);
  return true;
};

module.exports = {
  getAPIListData,
  generateAPIListData,
};
