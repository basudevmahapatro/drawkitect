import jwt from "jsonwebtoken"
import { config } from "../src/config/config.js";
import { sessionModel } from "../models/session.model.js";

export const authenticationMIddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: "Authentication failed." });
    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.JWT_SECRET);
        const session = await sessionModel.findOne({
            _id: decoded.sessionId,
            user: decoded.id,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({ message: "Authentication failed." });
        }

        req.userId = decoded.id;
        req.sessionId = decoded.session_id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed." });
    }
}
