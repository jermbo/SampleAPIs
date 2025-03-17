import fs from "fs";
import { getFromFile } from "./utils.js";

/**
 * Creates a REST API handler for a JSON data file
 * @param {string} dataPath - Path to the JSON data file
 * @returns {Function} - Hono handler function
 */
export const createRestApiHandler = (dataPath) => {
  // Function to read data from file
  const readData = () => {
    try {
      const data = getFromFile(dataPath);
      return data;
    } catch (error) {
      console.error(`Error reading data from ${dataPath}:`, error);
      return {};
    }
  };

  // Function to write data to file
  const writeData = (data) => {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing data to ${dataPath}:`, error);
      return false;
    }
  };

  return async (c) => {
    try {
      const method = c.req.method;
      const pathParts = c.req.path.split("/").filter(Boolean);

      // Get the data
      const data = readData();

      // Handle base path (e.g., /futurama)
      if (pathParts.length === 1) {
        return c.json(data);
      }

      // Handle resource path (e.g., /futurama/characters)
      const resourceName = pathParts[1];

      // Check if resource exists
      if (!data[resourceName]) {
        return c.json({ error: `Resource '${resourceName}' not found` }, 404);
      }

      // Get the resource data
      const resourceData = data[resourceName];

      // Handle collection requests (e.g., /futurama/characters)
      if (pathParts.length === 2) {
        // GET - Return all items
        if (method === "GET") {
          return c.json(resourceData);
        }

        // POST - Create a new item
        if (method === "POST") {
          const body = await c.req.json().catch(() => null);
          if (!body) {
            return c.json({ error: "Invalid request body" }, 400);
          }

          // Generate ID if not provided
          if (!body.id) {
            const maxId = resourceData.reduce(
              (max, item) => Math.max(max, typeof item.id === "number" ? item.id : 0),
              0,
            );
            body.id = maxId + 1;
          }

          // Add to collection
          resourceData.push(body);
          writeData(data);

          return c.json(body, 201);
        }

        return c.json({ error: "Method not allowed" }, 405);
      }

      // Handle item requests (e.g., /futurama/characters/1)
      if (pathParts.length === 3) {
        const itemId = pathParts[2];
        const numericId = Number(itemId);

        // Find the item
        const itemIndex = resourceData.findIndex((item) => item.id === numericId || item.id === itemId);

        if (itemIndex === -1) {
          return c.json({ error: `Item with ID ${itemId} not found` }, 404);
        }

        // GET - Return the item
        if (method === "GET") {
          return c.json(resourceData[itemIndex]);
        }

        // PUT - Replace the item
        if (method === "PUT") {
          const body = await c.req.json().catch(() => null);
          if (!body) {
            return c.json({ error: "Invalid request body" }, 400);
          }

          // Preserve the ID
          body.id = resourceData[itemIndex].id;

          // Replace the item
          resourceData[itemIndex] = body;
          writeData(data);

          return c.json(body);
        }

        // PATCH - Update the item
        if (method === "PATCH") {
          const body = await c.req.json().catch(() => null);
          if (!body) {
            return c.json({ error: "Invalid request body" }, 400);
          }

          // Update the item
          const updatedItem = { ...resourceData[itemIndex], ...body };

          // Preserve the ID
          updatedItem.id = resourceData[itemIndex].id;

          // Update the item
          resourceData[itemIndex] = updatedItem;
          writeData(data);

          return c.json(updatedItem);
        }

        // DELETE - Remove the item
        if (method === "DELETE") {
          const deletedItem = resourceData[itemIndex];
          resourceData.splice(itemIndex, 1);
          writeData(data);

          return c.json(deletedItem);
        }

        return c.json({ error: "Method not allowed" }, 405);
      }

      // Handle deeper paths
      return c.json({ error: "Path not supported" }, 404);
    } catch (error) {
      console.error("API handler error:", error);
      return c.json({ error: "Internal Server Error", message: error.message }, 500);
    }
  };
};
