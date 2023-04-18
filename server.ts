import * as fs from "fs";
import express, { Request, Response } from "express";
import * as jsonHandler from "./json-handler";
import path from "path";

const app = express();
app.use(express.json());

app.use("/public", express.static("public"));

//teste CRUD
app.get("/", (req: Request, res: Response) => {
  const home = fs.readFileSync("index.html").toString();
  res.status(200);
  res.send(home);
});

app.get("/api/user", (req: Request, res: Response) => {
  const files = fs.readdirSync("users");
  const userData = files.map((item) => jsonHandler.readJSON("users", item));
  res.json(userData);
});

app.get("/api/user/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData = jsonHandler.readJSON("users", `${userId}.json`);
  res.end(JSON.stringify(userData));
});

app.post("/api/user", (req: Request, res: Response) => {
  const dataPath = "users";

  const latestId = jsonHandler.readJSON("users", "id.json");

  const newId = latestId.id + 1;

  jsonHandler.updateJSON(["users", "id.json"], { id: newId });

  const jsonPath = [dataPath, `${newId}.json`];

  const content = { id: newId, ...req.body };

  const newPost = jsonHandler.createJSON(jsonPath, content);

  res.end(newPost);
});

app.put("/api/user/:id", (req: Request, res: Response) => {
  const userID = req.params.id;
  const content = {
    userID,
    teste: true,
  };
  jsonHandler.overwriteJSON(["users", `${userID}.json`], content);
});

app.patch("/api/user/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData = jsonHandler.updateJSON(
    ["users", `${userId}.json`],
    req.body
  );
  res.json(req.body);
});

app.delete("/api/user/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData = jsonHandler.deleteJSON(["users", `${userId}.json`]);
  res.end(userData);
});

/* //exercício 5.15
app.get("/pizza/:sabor", (req, res) => {
  const sabor = req.params.sabor;

  if (sabor === "marguerita") {
    res.status(404);
    res.end(`O sabor ${sabor} foi exterminado`);
  } else {
    res.status(200);
    res.end(`Sabor encontrado: ${sabor}`);
  }
});

//exercício 5.16
app.get("/calcular/:num_a/:operacao/:num_b", (req, res) => {
  const numA = Number(req.params.num_a);
  const numB = Number(req.params.num_b);
  const operacao = req.params.operacao;

  let result = "1";

  switch (operacao) {
    case "mais":
      res.status(200);
      result = numA + numB;
      break;
    case "menos":
      res.status(200);
      result = numA - numB;
      break;
    case "vezes":
      res.status(200);
      result = numA * numB;
      break;
    case "dividido":
      res.status(200);
      result = numA / numB;
      break;
    default:
      res.status(422);
      result = null;
  }

  res.end(`resposta: ${result}`);
});

//exercício 5.17
app.get("/iphone", (req, res) => {
  res.end(
    "<html><h1>Vc quer ganhar um iphone?</h1><br><a href='/iphone/sim'>Sim</a><br><a href='/iphone/nao'>Nao</a></html>"
  );
});

app.get("/iphone/sim", (req, res) => {
  res.redirect(301, "/virus");
});

app.get("/virus", (req, res) => {
  res.end("Vc foi infectado");
});

app.get("/iphone/nao", (req, res) => {
  res.redirect(302, "https:google.com");
});*/

app.listen(8080, () => {
  console.log("server running");
});
