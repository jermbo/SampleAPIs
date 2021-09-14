const fs = require("fs");

async function checkJSONDifference(mainFile, backupFile) {
  const backupFileBuffer = await fs.readFileSync(backupFile);
  const mainFileBuffer = await fs.readFileSync(mainFile);

  const backupJSON = JSON.parse(backupFileBuffer);
  const mainJSON = JSON.parse(mainFileBuffer);

  return JSON.stringify(mainJSON) !== JSON.stringify(backupJSON);
}

module.exports = {
  checkJSONDifference: checkJSONDifference,
};
