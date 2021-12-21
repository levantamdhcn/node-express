import express from "express";
import controller from "../controllers/auth.controller";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/validate", extractJWT, controller.validateToken);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/refreshToken", controller.refreshTokenControl);

export default router;
