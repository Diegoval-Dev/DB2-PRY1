import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import supplierRoutes from "./routes/suppliers.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);

export default app;
