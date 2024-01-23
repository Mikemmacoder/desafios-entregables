import { Router } from "express";
import { get, create, update, deleteByLastConnection } from "../controllers/users.controllers.js"
import { handlePolicies } from "../middlewares/handlePolicies.js";
const router = Router();

router.get("/", /* handlePolicies(['ADMIN']), */ get);
router.post("/", /* handlePolicies(['ADMIN']),  */create);
router.delete("/"/* , handlePolicies(['ADMIN']) */, deleteByLastConnection);
//TODO
router.get("/premium/:uid", /* handlePolicies(['ADMIN']), */ update);

export default router;
