import { canvasModel } from "../models/canvas.model.js";

export const getAllCanvases = async (req, res) => {
    const {userId} = req;
    
    try{
        const canvases = await canvasModel.getAllCanvases(userId);
        res.status(200).json(canvases);
    }catch(error){
        res.status(400).json({message : error.message});
    }
};

export const createCanvas = async (req, res) => {
    const {userId} = req;
    const canvasName = req.body.name;
    try{
        const newCanvas = await canvasModel.createCanvas(userId, canvasName);
        res.status(200).json(newCanvas);
    }catch(error){
        res.status(400).json({message : error.message});
    }
};


