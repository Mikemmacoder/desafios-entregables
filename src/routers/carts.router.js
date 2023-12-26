import { Router } from "express";
const router = Router();
import { addProductToCartController, createCartController, getCartController, deleteProductInCartController, deleteAllProductsfromCartController, putProductsInCartController, updateQuantityProductFromCartController, purchaseController} from "../controllers/carts.controllers.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

router.post("/", handlePolicies(['USER' , 'PREMIUM']), createCartController);
router.get("/:cid", handlePolicies(['USER' , 'PREMIUM']), getCartController);
router.post("/:cid/products/:pid",handlePolicies(['USER' , 'PREMIUM']), addProductToCartController);
router.delete("/:cid/products/:pid",handlePolicies(['USER' , 'PREMIUM']), deleteProductInCartController);
router.delete("/:cid",handlePolicies(['USER' , 'PREMIUM']), deleteAllProductsfromCartController);
router.put("/:cid", handlePolicies(['USER' , 'PREMIUM']), putProductsInCartController);
router.put("/:cid/products/:pid",handlePolicies(['USER' , 'PREMIUM']), updateQuantityProductFromCartController);
router.get('/:cid/purchase',handlePolicies(['USER' , 'PREMIUM']), purchaseController)

export default router;
