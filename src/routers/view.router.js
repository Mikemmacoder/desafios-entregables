import { Router } from "express";
import { getProductsFromCartController, chekoutController } from "../controllers/carts.controllers.js";
import { realTimeProductsController, homeProductsController } from "../controllers/products.controllers.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
const router = Router();

router.get("/", publicRoutes, handlePolicies(['USER', 'ADMIN', 'PREMIUM']), homeProductsController);
router.get("/realTimeProducts", publicRoutes, handlePolicies(['ADMIN', 'PREMIUM']), realTimeProductsController);
router.get("/:cid", publicRoutes, handlePolicies(['USER', 'PREMIUM']), getProductsFromCartController);
router.get("/checkout", publicRoutes, handlePolicies(['USER', 'PREMIUM']), chekoutController) 

/* router.get("/create", async (req, res) => {
  res.render("create", {});
}); */

export default router;
