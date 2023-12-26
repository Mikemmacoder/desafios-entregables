import { Router } from "express";
import { get, create, update } from "../controllers/users.controllers.js"

const router = Router();

router.get("/", get);
router.post("/", create);
//TODO
router.get("/premium/:uid", update);

export default router;
