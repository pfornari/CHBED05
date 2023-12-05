const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productsFilePath = path.join(__dirname, "/data/products.json");

const {
  newProduct,
  updateProduct,
  deleteProduct,
} = require("./views/productController");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

async function readProductsFile() {
  const data = await fs.readFile(productsFilePath, "utf8");
  return JSON.parse(data);
}

async function writeProductsFile(data) {
  await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2), "utf8");
}

app.get("/", async (req, res) => {
  const products = await readProductsFile();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await readProductsFile();
  res.render("realTimeProducts", { products });
});

httpServer.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newProduct", async (product) => {
    const products = await readProductsFile();
    products.push({ id: String(products.length + 1), ...product });
    await writeProductsFile(products);
    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", async (productId) => {
    let products = await readProductsFile();
    products = products.filter((product) => product.id !== productId);
    await writeProductsFile(products);
    io.emit("updateProducts", products);
  });
});
