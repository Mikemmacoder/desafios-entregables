import { Router } from "express";
const router = Router();
import { addProductToCartController, createCartController, getCartController, deleteProductInCartController, deleteAllProductsfromCartController, putProductsInCartController, updateQuantityProductFromCartController, purchaseController} from "../controllers/carts.controllers.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

router.post("/", handlePolicies(['USER']), createCartController);
router.get("/:cid", handlePolicies(['USER']), getCartController);
router.post("/:cid/products/:pid",handlePolicies(['USER']), addProductToCartController);
router.delete("/:cid/products/:pid",handlePolicies(['USER']), deleteProductInCartController);
router.delete("/:cid",handlePolicies(['USER']), deleteAllProductsfromCartController);
router.put("/:cid", handlePolicies(['USER']), putProductsInCartController);
router.put("/:cid/products/:pid",handlePolicies(['USER']), updateQuantityProductFromCartController);
router.get('/:cid/purchase',handlePolicies(['USER']), purchaseController)

export default router;
