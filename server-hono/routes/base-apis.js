import { Hono } from "hono";
import path from "path";
import { fileURLToPath } from "url";
import { getAPIListData } from "../utils/getAPIListData.js";
import { createRestApiHandler } from "../utils/restApiHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseApis = new Hono();

// Get the list of available APIs
const apiList = await getAPIListData();

// Set up routes for each API
apiList.forEach(({ link }) => {
  const dataPath = path.join(__dirname, `../api/${link}.json`);
  console.log(`Setting up API for /${link} using ${dataPath}`);

  // Use our custom REST API handler
  baseApis.all(`/${link}/*`, createRestApiHandler(dataPath));
  baseApis.all(`/${link}`, createRestApiHandler(dataPath));
});

export default baseApis;
