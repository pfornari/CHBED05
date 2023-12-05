const fs = require("fs").promises;
const path = require("path");
const productsFilePath = path.join(__dirname, "data/products.json");

async function readProductsFile() {
  const data = await fs.readFile(productsFilePath, "utf8");
  return JSON.parse(data);
}

async function writeProductsFile(data) {
  await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2), "utf8");
}

async function newProduct(product, io) {
  const products = await readProductsFile();
  product.id = String(products.length + 1); // Generar un ID simple
  products.push(product);
  await writeProductsFile(products);
  io.emit("updateProducts", products); // Emitir evento a través de Socket.io
}

async function updateProduct(productId, updatedData, io) {
  let products = await readProductsFile();
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedData };
    await writeProductsFile(products);
    io.emit("updateProducts", products); // Emitir evento
  }
}

async function deleteProduct(productId, io) {
  let products = await readProductsFile();
  products = products.filter((product) => product.id !== productId);
  await writeProductsFile(products);
  io.emit("updateProducts", products); // Emitir evento
}

module.exports = { newProduct, updateProduct, deleteProduct };
