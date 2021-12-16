import express from "express";
import controller from "../controllers/auth.controller";
import extractJWT from "../middleware/extractJWT";
import extracJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/validate", extractJWT, controller.validateToken);
router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
