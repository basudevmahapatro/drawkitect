import cookieParser from "cookie-parser"
import app from "./src/app.js"
import authRouter from "./routes/auth.routes.js"
import canvasRouter from "./routes/canvas.routes.js "
import { connectDB } from "./src/config/database.js"
import cors from "cors"

connectDB();
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/canvas", canvasRouter);
app.listen(3000);