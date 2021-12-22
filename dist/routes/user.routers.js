"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const router = express_1.default.Router();
router.get("/get/all", extractJWT_1.default, user_controller_1.default.getAllUsers);
router.get("/get/id/:id", user_controller_1.default.getUserById);
router.get("/get/username/:username", user_controller_1.default.getUserByUsername);
router.put("/:id", user_controller_1.default.updateUser);
router.put("/:username/follow", user_controller_1.default.addFollowing);
router.delete("/:username/follow", user_controller_1.default.unFollow);
exports.default = router;
