import { Router } from "express";
const router = Router();
import { getProductsController, getProductController, createProductController, modifyProductByIdController, deleteProductByIdController } from "../controllers/products.controllers.js";
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

router.get("/", getProductsController);
router.get("/:pid", getProductController);
router.post("/", createProductController);
router.put("/:pid", modifyProductByIdController);
router.delete("/:pid", deleteProductByIdController);

/* router.get("/", handlePolicies(['USER', 'ADMIN']), getProductsController);
router.get("/:pid", handlePolicies(['USER', 'ADMIN']), getProductController);
router.post("/", handlePolicies(['ADMIN']), createProductController);
router.put("/:pid", handlePolicies(['ADMIN']), modifyProductByIdController);
router.delete("/:pid", handlePolicies(['ADMIN']), deleteProductByIdController); */
export default router;
