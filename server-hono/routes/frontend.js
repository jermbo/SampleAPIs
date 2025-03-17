import { Hono } from "hono";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import GeneratedAPIList from "../GeneratedAPIList.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transform the api list to proper format for frontend display
const transformedAPIList = GeneratedAPIList.map((api) => {
  return {
    title: api.metaData.title,
    desc: api.metaData.desc,
    link: `/${api.link}`,
    graphLink: `/${api.link}/graphql`,
  };
});

const frontend = new Hono();

frontend.get("/", (c) => {
  return c.json({
    status: 200,
    data: {
      APIListData: transformedAPIList,
    },
  });
});

frontend.get("/:name", (c) => {
  const name = c.req.param("name");
  return c.json({
    status: 200,
    id: name,
  });
});

export default frontend;
