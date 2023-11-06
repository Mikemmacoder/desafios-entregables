import { Router } from "express";
const router = Router();
import { getProductsController, getProductByIdController, createProductController, modifyProductByIdController, deleteProductByIdController } from "../controllers/products.controllers.js";
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
router.get("/:pid", getProductByIdController);
router.post("/", createProductController);
router.put("/:pid", modifyProductByIdController);
router.delete("/:pid", deleteProductByIdController);

export default router;
