import { Hono } from "hono";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAPIListData } from "../utils/getAPIListData.js";
import renderTemplate from "../utils/template.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reset = new Hono();

// Reset all APIs
reset.get("/all", async (c) => {
  console.log("Resetting all endpoints");

  try {
    // Get the current API list
    const apiList = await getAPIListData();
    let successCount = 0;
    let errorCount = 0;

    for (const api of apiList) {
      const apiName = api.link;
      const backupFile = path.join(__dirname, `../api/${apiName}.json.backup`);
      const mainFile = path.join(__dirname, `../api/${apiName}.json`);

      if (fs.existsSync(backupFile)) {
        await fs.promises.copyFile(backupFile, mainFile);
        console.log(`Reset ${apiName} API`);
        successCount++;
      } else {
        console.error(`Backup file not found for ${apiName}`);
        errorCount++;
      }
    }

    // Render template with data
    const html = await renderTemplate(
      "all-success",
      {
        successCount,
        errorCount: errorCount > 0 ? errorCount : null,
      },
      {
        title: "Reset All APIs",
        heading: "All APIs have been reset",
      },
    );

    return c.html(html);
  } catch (error) {
    console.error("Error resetting APIs:", error);

    // Render error template
    const html = await renderTemplate(
      "error",
      {
        errorMessage: error.message || "An unknown error occurred",
      },
      {
        title: "Error",
        heading: "Error Resetting APIs",
        titleColor: "#ff5e5e",
        contentBgColor: "rgba(255, 99, 99, 0.2)",
      },
    );

    return c.html(html, 500);
  }
});

// Reset specific API
reset.get("/:id", async (c) => {
  try {
    const id = c.req.param("id").toLowerCase();

    // Get the API list
    const apiList = await getAPIListData();
    const apiData = apiList.find((api) => api.link.toLowerCase() === id);

    if (!apiData) {
      // Render not found template
      const html = await renderTemplate(
        "not-found",
        {
          id,
        },
        {
          title: "API Not Found",
          heading: "API Not Found",
          titleColor: "#ff5e5e",
        },
      );

      return c.html(html, 404);
    }

    const apiName = apiData.link;
    const backupFile = path.join(__dirname, `../api/${apiName}.json.backup`);
    const mainFile = path.join(__dirname, `../api/${apiName}.json`);

    if (!fs.existsSync(backupFile)) {
      // Render backup not found template
      const html = await renderTemplate(
        "backup-not-found",
        {
          title: apiData.metaData.title,
        },
        {
          title: "Backup Not Found",
          heading: "Backup Not Found",
          titleColor: "#ff5e5e",
        },
      );

      return c.html(html, 404);
    }

    await fs.promises.copyFile(backupFile, mainFile);
    console.log(`Reset ${apiName} API`);

    // Render success template
    const html = await renderTemplate(
      "success",
      {
        message: `${apiData.metaData.title} API has been reset`,
        details: apiData.metaData.desc,
      },
      {
        title: `Reset ${apiData.metaData.title}`,
        heading: `${apiData.metaData.title} API has been reset`,
      },
    );

    return c.html(html);
  } catch (error) {
    console.error("Error resetting API:", error);

    // Render error template
    const html = await renderTemplate(
      "error",
      {
        errorMessage: error.message || "An unknown error occurred",
      },
      {
        title: "Error",
        heading: "Error Resetting API",
        titleColor: "#ff5e5e",
        contentBgColor: "rgba(255, 99, 99, 0.2)",
      },
    );

    return c.html(html, 500);
  }
});

export default reset;
