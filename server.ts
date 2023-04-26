import * as fs from "fs";
import express, { Request, Response } from "express";
import * as jsonHandler from "./json-handler";
import path from "path";
import { userSort } from "./users-sort";

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

//exercício 5.18
app.get("/carts", (req: Request, res: Response) => {
  const minPrice = Number(req.query.min_price);
  const maxPrice = Number(req.query.max_price);

  const jsonCarts = JSON.parse(fs.readFileSync("carts.json").toString());

  const cartsList = jsonCarts.carts.map((cart: any) => {
    return cart.products;
  });

  const productsCarts = cartsList.flat().filter((item: any) => {
    if (item.price >= minPrice && item.price <= maxPrice) {
      return item.price;
    }
  });

  const productsCartsSort = productsCarts.sort(
    (a: any, b: any) => a.price - b.price
  );

  res.json(productsCartsSort);

  /*
  //SOLUÇÃO WELLIGTON 19/04
  const cartsList = jsonCarts.carts.map((cart: []) => {
    return cart;
  });

  const productsList = cartsList.map((item: any) => {
    return item.products.filter((item: any) => {
      if (item.price >= minPrice && item.price <= maxPrice) {
        return item;
      }
    });
  });

  //ordernar e verificar a quantidade de nulos
  //sort()

  //pular o numero de nulos
  //slice()

  console.log(productsList); */
});

/* //Exercício 5.19
app.get("/numeros", (req: Request, res: Response) => {
  const min = Number(req.query.min);
  const max = Number(req.query.max);
  let impar = req.query.impares;

  function isOdd(num: number) {
    return num % 2 !== 0;
  }

  let numbers = [];

  for (let number = min; number <= max; number++) {
    if (impar != null) {
      if (isOdd(number)) {
        numbers.push(number);
      } else {
        null;
      }
    } else {
      numbers.push(number);
    }
  }

  console.log(`min:${min} max:${max} \n(${numbers})`);
}); */

//Exercício 5.20
app.get("/users", (req: Request, res: Response) => {
  const orderBy = req.query.order_by;
  const direction = req.query.direction;

  console.log(orderBy);
  console.log(direction);

  const usersJson = JSON.parse(fs.readFileSync("users.json").toString());

  if (orderBy === "age") {
    if (direction === "asc") {
      usersJson.users.sort((a: any, b: any) => a.age - b.age);
    } else if (direction === "desc") {
      usersJson.users.sort((a: any, b: any) => b.age - a.age);
    }
  }

  if (orderBy === "birthDate") {
    if (direction === "asc") {
      usersJson.users.sort((a: any, b: any) => {
        if (a.birthDate > b.birthDate) {
          return -1;
        }
        if (a.birthDate < b.birthDate) {
          return 1;
        }
        return 0;
      });
    }
    if (direction === "desc") {
      usersJson.users.sort((a: any, b: any) => {
        if (a.birthDate > b.birthDate) {
          return 1;
        }
        if (a.birthDate < b.birthDate) {
          return -1;
        }
        return 0;
      });
    }
  }

  if (orderBy === "height") {
    if (direction === "asc") {
      usersJson.users.sort((a: any, b: any) => a.height - b.height);
    } else if (direction === "desc") {
      usersJson.users.sort((a: any, b: any) => b.height - a.height);
    }
  }

  if (orderBy === "weight") {
    if (direction === "asc") {
      usersJson.users.sort((a: any, b: any) => a.weight - b.weight);
    } else if (direction === "desc") {
      usersJson.users.sort((a: any, b: any) => b.weight - a.weight);
    }
  }

  res.json(usersJson);

  //solução welligton
  /* type ObjectKey = keyof typeof usersJson.users;

  const orderByFinal = orderBy as ObjectKey;

  console.log(orderByFinal);

  console.log(typeof orderByFinal);

  const keys = Object.keys(usersJson.users[0]);

  console.log(keys);

  const userListSort = usersJson.users.sort((a: any, b: any) => {
    const teste = a.orderByFinal;
    const testeB = b.orderByFinal;

    if (teste < testeB) {
      return -1;
    }
    if (teste > testeB) {
      return 1;
    }
    return 0;
  });
 */

  /* console.log(`${orderBy} ${direction}`); */
});

app.listen(8080, () => {
  console.log("server running");
});
