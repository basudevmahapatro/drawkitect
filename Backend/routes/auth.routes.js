import {Router} from "express"
import {register, verifyOtp, resendOtp, login, getMe, refreshToken, logout, logoutAll} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verifyOtp", verifyOtp);
authRouter.post("/resendOtp", resendOtp);
authRouter.post("/login", login);
authRouter.get("/getMe", getMe);
authRouter.post("/refreshToken", refreshToken);
authRouter.post("/logout", logout);
authRouter.post("/logoutAll", logoutAll);

export default authRouter;