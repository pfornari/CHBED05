const productManager = require("../managers/productManager");

const productController = {
  async getProducts(req, res) {
    const products = await productManager.getProducts();
    res.json(products);
  },
  async getProductById(req, res) {
    const product = await productManager.getProductById(req.params.id);
    res.json(product);
  },
  async addProduct(req, res) {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  },
  async updateProduct(req, res) {
    await productManager.updateProduct(req.params.id, req.body);
    res.status(200).json({ message: "Producto actualizado" });
  },
  async deleteProduct(req, res) {
    await productManager.deleteProduct(req.params.id);
    res.status(200).json({ message: "Producto eliminado" });
  },
};

module.exports = productController;
