import express from "express";
import controller from "../controllers/user.controller";

const router = express.Router();

router.get("/get/all", controller.getAllUsers);
router.get("/get/:id", controller.getUserById);

export default router;
