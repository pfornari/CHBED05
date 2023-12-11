const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const fs = require("fs").promises;
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productController = require("./controllers/productController");
const productsFilePath = path.join(__dirname, "/data/products.json");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const {
  newProduct,
  updateProduct,
  deleteProduct,
} = require("./views/productController");

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use(express.json());

app.get("/", (req, res) => {
  res.render("home", { layout: false });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { layout: false });
});

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

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.on("addProduct", async (productData) => {
    try {
      const newProduct = await productController.addProduct(productData);
      const products = await productController.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

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
