import { Hono } from "hono";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a simple API list for now
const GeneratedAPIList = [
  {
    title: "Futurama",
    desc: "Futurama API with characters, episodes, and more",
    link: "/futurama/api",
    graphLink: "/futurama/graphql",
  },
  {
    title: "Avatar",
    desc: "Avatar: The Last Airbender API",
    link: "/avatar/api",
    graphLink: "/avatar/graphql",
  },
];

const frontend = new Hono();

frontend.get("/", (c) => {
  return c.json({
    status: 200,
    data: {
      APIListData: GeneratedAPIList,
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
