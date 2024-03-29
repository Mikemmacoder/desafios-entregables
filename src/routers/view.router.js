import { Router } from "express";
import { getProductsFromCartController} from "../controllers/carts.controllers.js";
import { realTimeProductsController, homeProductsController } from "../controllers/products.controllers.js";
import { getUsersContoller } from "../controllers/users.controllers.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";
const router = Router();

router.get("/", publicRoutes, handlePolicies(['USER', 'ADMIN', 'PREMIUM']), homeProductsController);
router.get("/realTimeProducts", publicRoutes, handlePolicies(['ADMIN', 'PREMIUM']), realTimeProductsController);
router.get("/:cid", publicRoutes, handlePolicies(['USER', 'PREMIUM']), getProductsFromCartController);
router.get("/users", getUsersContoller)

export default router;
