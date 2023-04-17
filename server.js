const fs = require("fs");
const express = require("express");
const jsonHandler = require("./json-handler");
const path = require("path");

const app = express();
app.use(express.json());

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  const home = fs.readFileSync("index.html").toString();
  res.end(home);
});

app.get("/api/user", (req, res) => {
  const files = fs.readdirSync("users");
  const userData = files.map((item) => jsonHandler.readJSON("users", item));
  res.json(userData);
});

app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const userData = jsonHandler.readJSON("users", `${userId}.json`);
  res.end(JSON.stringify(userData));
});

app.post("/api/user", (req, res) => {
  const dataPath = "users";

  const latestId = jsonHandler.readJSON("users", "id.json");

  const newId = latestId.id + 1;

  jsonHandler.updateJSON(["users", "id.json"], { id: newId });

  const jsonPath = [dataPath, `${newId}.json`];

  const content = { id: newId, ...req.body };

  const newPost = jsonHandler.createJSON(jsonPath, content);

  res.end(newPost);
});

app.put("/api/user/:id", (req, res) => {
  const userID = req.params.id;
  const content = {
    userID,
    teste: true,
  };
  jsonHandler.overwriteJSON(["users", `${userID}.json`], content);
});

app.patch("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const userData = jsonHandler.updateJSON(
    ["users", `${userId}.json`],
    req.body
  );
  res.json(req.body);
});

app.delete("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const userData = jsonHandler.deleteJSON(["users", `${userId}.json`]);
  res.end(userData);
});

app.listen(8080, () => {
  console.log("server running");
});
