const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const productsFilePath = path.join(__dirname, "../data/products.json");

class ProductManager {
  async getProducts() {
    const data = await fs.readFile(productsFilePath, "utf8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = { id: uuidv4(), ...productData };
    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    }
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter((product) => product.id !== id);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  }
}

module.exports = new ProductManager();
