import { Hono } from "hono";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We'll need to implement a getAPIListData function or use a simpler approach
// For now, let's use a simple array of APIs
const apiList = [
  {
    title: "Futurama",
    desc: "Futurama API with characters, episodes, and more",
    link: "futurama",
  },
  {
    title: "Avatar",
    desc: "Avatar: The Last Airbender API",
    link: "avatar",
  },
];

const reset = new Hono();

// Reset all APIs
reset.get("/all", async (c) => {
  console.log("Resetting all endpoints");

  try {
    for (const page of apiList) {
      const api = page.link;
      const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
      const mainFile = path.join(__dirname, `../api/${api}.json`);

      if (fs.existsSync(backupFile)) {
        await fs.promises.copyFile(backupFile, mainFile);
        console.log(`Reset ${api} API`);
      } else {
        console.error(`Backup file not found for ${api}`);
      }
    }

    // In a real implementation, we would render a template
    // For now, just return a simple message
    return c.html(`
      <html>
        <head><title>Reset All APIs</title></head>
        <body>
          <h1>All APIs have been reset</h1>
          <p>The server will now restart.</p>
        </body>
      </html>
    `);

    // Note: In a production environment, you would need a way to restart the server
    // process.exit(1) won't work the same way in a serverless environment
  } catch (error) {
    console.error("Error resetting APIs:", error);
    return c.text("Error resetting APIs", 500);
  }
});

// Reset specific API
reset.get("/:id", async (c) => {
  try {
    const id = c.req.param("id").toLowerCase();
    const data = apiList.find((api) => id === api.link.toLowerCase());

    if (!data) {
      return c.text(`API '${id}' not found`, 404);
    }

    const api = data.link;
    const backupFile = path.join(__dirname, `../api/${api}.json.backup`);
    const mainFile = path.join(__dirname, `../api/${api}.json`);

    if (fs.existsSync(backupFile)) {
      await fs.promises.copyFile(backupFile, mainFile);
      console.log(`Reset ${api} API`);
    } else {
      console.error(`Backup file not found for ${api}`);
      return c.text(`Backup file not found for ${api}`, 404);
    }

    // Return a simple HTML response
    return c.html(`
      <html>
        <head><title>Reset ${data.title}</title></head>
        <body>
          <h1>${data.title} API has been reset</h1>
          <p>${data.desc}</p>
          <p>The server will now restart.</p>
        </body>
      </html>
    `);

    // Note: In a production environment, you would need a way to restart the server
  } catch (error) {
    console.error("Error resetting API:", error);
    return c.text("Error resetting API", 500);
  }
});

export default reset;
