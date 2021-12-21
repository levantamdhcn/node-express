import express from "express";
import controller from "../controllers/user.controller";
import extractJWT from "../middleware/extractJWT";

const router = express.Router();

router.get("/get/all", extractJWT, controller.getAllUsers);
router.get("/get/id/:id", controller.getUserById);
router.get("/get/username/:username", controller.getUserByUsername);
router.put("/:id", controller.updateUser);
router.put("/:id/follow", controller.addFollowing);
router.delete("/:id/follow", controller.unFollow);

export default router;
