const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cartsFilePath = path.join(__dirname, "../data/carts.json");

class CartManager {
  async getCarts() {
    const data = await fs.readFile(cartsFilePath, "utf8");
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    const productIndex = cart.products.findIndex(
      (p) => p.productId === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  }

  async removeProductFromCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);
    cart.products = cart.products.filter((p) => p.productId !== productId);
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
  }
}

module.exports = new CartManager();
