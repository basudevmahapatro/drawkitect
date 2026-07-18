import app from "./src/app.js"
import authRouter from "./routes/auth.routes.js"
import canvasRouter from "./routes/canvas.routes.js"
import { connectDB } from "./src/config/database.js"
import cors from "cors"

connectDB();
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/canvas", canvasRouter);
app.listen(3000);