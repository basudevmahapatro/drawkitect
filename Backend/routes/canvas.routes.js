import { Router } from "express";
import { getAllCanvases, createCanvas, deleteCanvas, getCanvasById, updateCanvas } from "../controllers/canvas.controller.js"; 
import { authenticationMIddleware } from "../middlewares/auth.middleware.js";

const canvasRouter = Router();

canvasRouter.get("/", authenticationMIddleware, getAllCanvases);
canvasRouter.post("/createCanvas", authenticationMIddleware, createCanvas);
canvasRouter.delete("/deleteCanvas/:id", authenticationMIddleware, deleteCanvas);
canvasRouter.get("/:id", authenticationMIddleware, getCanvasById);
canvasRouter.put("/updateCanvas/:id", authenticationMIddleware, updateCanvas);

export default canvasRouter;