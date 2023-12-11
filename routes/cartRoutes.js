const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/", cartController.getCarts);
router.get("/:id", cartController.getCartById);
router.post("/", cartController.createCart);
router.post("/:id/product", cartController.addProductToCart);
router.delete(
  "/:cartId/product/:productId",
  cartController.removeProductFromCart
);

module.exports = router;
