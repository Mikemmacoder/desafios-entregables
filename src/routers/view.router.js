import { Router } from "express";
import { getProductsFromCartController } from "../controllers/carts.controllers.js";
import { realTimeProductsController, homeProductsController } from "../controllers/products.controllers.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
const router = Router();

router.get("/", publicRoutes, handlePolicies(['USER', 'ADMIN']), homeProductsController);
router.get("/realTimeProducts", publicRoutes, handlePolicies(['ADMIN']), realTimeProductsController);
router.get("/:cid", publicRoutes, handlePolicies(['USER']), getProductsFromCartController);

/* router.get("/create", async (req, res) => {
  res.render("create", {});
}); */

export default router;
