import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, "../api");

export const getAPIListData = async () => {
  let files = await fs.promises.readdir(directoryPath);
  files = files.filter((f) => !f.includes(".backup"));

  const results = [];
  for (const file of files) {
    try {
      const filePath = path.join(__dirname, `../api/${file}`);
      const stats = fs.statSync(filePath);

      // Skip if it's a directory
      if (stats.isDirectory()) continue;

      const data = JSON.parse(fs.readFileSync(filePath));
      const endpoints = Object.keys(data);
      const metaData = data.metaData[0];
      const name = file.split(".")[0].toLowerCase();

      results.push({
        name,
        link: name,
        metaData,
        endpoints: endpoints.filter((e) => e != "metaData"),
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
    }
  }

  return results;
};

export const generateAPIListData = async () => {
  let files = await fs.promises.readdir(directoryPath);
  files = files.filter((f) => !f.includes(".backup"));

  const apiData = [];
  for (const file of files) {
    try {
      const filePath = path.join(__dirname, `../api/${file}`);
      const stats = fs.statSync(filePath);

      // Skip if it's a directory
      if (stats.isDirectory()) continue;

      const data = JSON.parse(fs.readFileSync(filePath));
      const endpoints = Object.keys(data);
      const metaData = data.metaData[0];
      const name = file.split(".")[0].toLowerCase();

      apiData.push({
        name,
        link: name,
        metaData,
        endpoints: endpoints.filter((e) => e != "metaData"),
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
    }
  }

  const jsFileData = `export default ${JSON.stringify(apiData)}`;
  const outputPath = path.join(__dirname, "../GeneratedAPIList.js");
  await fs.promises.writeFile(outputPath, jsFileData);
  return true;
};
