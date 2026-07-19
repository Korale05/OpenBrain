
import { Router } from "express";
import { login, logout, register , refreshToken } from "../controllers/auth.controller.js";
import Protect from "../middlewares/protect.middleware.js";

const router = Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",Protect,logout);
router.get("/refreshToken",refreshToken);


export default router;