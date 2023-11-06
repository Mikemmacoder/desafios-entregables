import { Router } from "express";
import { getProductsFromCartController } from "../controllers/carts.controllers.js";
import { realTimeProductsController, homeProductsController } from "../controllers/products.controllers.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", publicRoutes, homeProductsController);
router.get("/realTimeProducts", publicRoutes, realTimeProductsController);
router.get("/:cid", publicRoutes, getProductsFromCartController);

/* router.get("/create", async (req, res) => {
  res.render("create", {});
}); */

export default router;
