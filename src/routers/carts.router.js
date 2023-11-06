import { Router } from "express";
const router = Router();
import { addProductToCartController, createCartController, getCartByIdController, deleteProductInCartController, deleteAllProductsfromCartController, putProductsInCartController, updateQuantityProductFromCartController,} from "../controllers/carts.controllers.js";

router.post("/", createCartController);
router.get("/:cid", getCartByIdController);
router.post("/:cid/products/:pid", addProductToCartController);
router.delete("/:cid/products/:pid", deleteProductInCartController);
router.delete("/:cid", deleteAllProductsfromCartController);
router.put("/:cid", putProductsInCartController);
router.put("/:cid/products/:pid", updateQuantityProductFromCartController);

export default router;
