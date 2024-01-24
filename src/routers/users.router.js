import { Router } from "express";
import { get, create, update, deleteByLastConnection, deleteUser } from "../controllers/users.controllers.js"
import { handlePolicies } from "../middlewares/handlePolicies.js";
import passport from "passport";
const router = Router();

router.get("/", handlePolicies(['ADMIN']), get);
router.post("/", handlePolicies(['ADMIN']), create);
router.delete("/", handlePolicies(['ADMIN']), deleteByLastConnection);
router.get("/premium/:uid", handlePolicies(['ADMIN']), update);
router.delete("/:uid", handlePolicies(['ADMIN']), deleteUser);

export default router;
