import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import supplierRoutes from "./routes/suppliers.routes";
import ingredientRoutes from "./routes/ingredients.routes";
import orderRoutes from "./routes/orders.routes";
import inventoryRoutes from "./routes/inventory.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);

export default app;
