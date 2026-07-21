import { canvasModel } from "../models/canvas.model.js";

export const getAllCanvases = async (req, res) => {
    const { userId } = req;
    try {
        const canvases = await canvasModel.getAllCanvases(userId);
        res.status(200).json(canvases);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createCanvas = async (req, res) => {
    const { userId } = req;
    const canvasName = req.body.name;
    try {
        const newCanvas = await canvasModel.createCanvas(userId, canvasName);
        res.status(200).json(newCanvas);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCanvas = async (req, res) => {
    const { userId } = req;
    const { id } = req.params;
    try {
        const canvas = await canvasModel.findOne({ _id: id, owner: userId });
        if (!canvas) {
            return res.status(404).json({ message: "Canvas not found or you do not have permission to delete it." });
        }
        await canvasModel.deleteOne({ _id: id });
        res.status(200).json({ message: "Canvas deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
