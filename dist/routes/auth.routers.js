"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
const router = express_1.default.Router();
router.get("/validate", extractJWT_1.default, auth_controller_1.default.validateToken);
router.post("/register", auth_controller_1.default.register);
router.post("/login", auth_controller_1.default.login);
exports.default = router;
