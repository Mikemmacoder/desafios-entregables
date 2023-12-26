import { Router } from "express";
import { getProductsController, getProductController, createProductController, modifyProductByIdController, deleteProductByIdController } from "../controllers/products.controllers.js";
import { handlePolicies } from "../middlewares/handlePolicies.js";

const router = Router();
//import multer from "multer";

/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }); */

router.get("/", handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getProductsController);
router.get("/:pid", handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getProductController);
router.post("/", handlePolicies(['ADMIN', 'PREMIUM']), createProductController);
router.put("/:pid", handlePolicies(['ADMIN', 'PREMIUM']), modifyProductByIdController);
router.delete("/:pid", handlePolicies(['ADMIN', 'PREMIUM']), deleteProductByIdController);
export default router;
