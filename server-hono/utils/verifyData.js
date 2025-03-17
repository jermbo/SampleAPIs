import path from "path";
import { fileURLToPath } from "url";
import { createMiddleware } from "hono/factory";
import { getFromFile } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hasAllData(dataKeys, bodyKeys) {
  return dataKeys.every((dataKey) => bodyKeys.includes(dataKey));
}

function hasRelativeData(dataKeys, bodyKeys) {
  return bodyKeys.some((bodyKey) => dataKeys.includes(bodyKey));
}

// Create a middleware for verifying data
export const verifyData = createMiddleware(async (c, next) => {
  const method = c.req.method;
  const originalUrl = c.req.path;
  let body = {};

  try {
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      body = await c.req.json();
    }

    const [baseParent, endPoint] = originalUrl.split("/").filter((d) => d);
    const dataPath = path.join(__dirname, `../api/${baseParent}.json`);
    const data = getFromFile(dataPath)[endPoint][0];

    const dataKeys = Object.keys(data);

    const expectedObjectData = {};
    for (let key in data) {
      let type = typeof data[key];
      if (type === "object") {
        type = Array.isArray(data[key]) ? "array" : "object";
      }
      expectedObjectData[key] = type;
    }

    const bodyKeys = ["id", ...Object.keys(body)];

    if (method === "POST" || method === "PUT") {
      if (!hasAllData(dataKeys, bodyKeys)) {
        return c.json(
          {
            error: 400,
            message:
              "The data you are sending does not match the existing data object. Check out the expected shape versus what was sent.",
            expected: expectedObjectData,
            received: body,
          },
          400,
        );
      }

      return await next();
    }

    if (method === "PATCH") {
      if (!hasRelativeData(dataKeys, bodyKeys)) {
        return c.json(
          {
            error: 400,
            message:
              "It appears you are trying to manipulate data that does not exist on the object. Check out the expected shape versus what was sent.",
            expected: expectedObjectData,
            received: body,
          },
          400,
        );
      }

      return await next();
    }

    if (method === "GET" || method === "DELETE") {
      return await next();
    }
  } catch (ex) {
    return c.json(
      {
        error: 500,
        message: `Unexpected data sent in! ${method} NOT accepted. Please send valid data next time!`,
        received: body,
      },
      500,
    );
  }
});
