const cartManager = require("../managers/cartManager");

const cartController = {
  async getCarts(req, res) {
    const carts = await cartManager.getCarts();
    res.json(carts);
  },
  async getCartById(req, res) {
    const cart = await cartManager.getCartById(req.params.id);
    res.json(cart);
  },
  async createCart(req, res) {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  },
  async addProductToCart(req, res) {
    await cartManager.addProductToCart(
      req.params.id,
      req.body.productId,
      req.body.quantity
    );
    res.status(200).json({ message: "Producto añadido al carrito" });
  },
  async removeProductFromCart(req, res) {
    await cartManager.removeProductFromCart(
      req.params.cartId,
      req.params.productId
    );
    res.status(200).json({ message: "Producto eliminado del carrito" });
  },
};

module.exports = cartController;
