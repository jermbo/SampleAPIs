const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const server = jsonServer.create();
const middleware = jsonServer.defaults();
const port = process.env.PORT || 5000;

server.use(middleware);
server.use(
  "/scripts",
  express.static(path.join(__dirname, "./public/scripts/"))
);

server.use("/futurama", express.static(path.join(__dirname, "futurama")));
server.use("/futurama", jsonServer.router("./futurama/futurama.json"));

server.listen(port, () => {
  console.log(`JSON Server is now running on port: ${port}`);
});
