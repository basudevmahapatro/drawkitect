import { Router } from "express";
import { getAllCanvases, createCanvas, deleteCanvas } from "../controllers/canvas.controller.js"; 
import { authenticationMIddleware } from "../middlewares/auth.middleware.js";

const canvasRouter = Router();

canvasRouter.get("/", authenticationMIddleware, getAllCanvases);
canvasRouter.post("/createCanvas", authenticationMIddleware, createCanvas);
canvasRouter.delete("/deleteCanvas/:id", authenticationMIddleware, deleteCanvas);

export default canvasRouter;