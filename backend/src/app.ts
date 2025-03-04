import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import supplierRoutes from "./routes/suppliers.routes";
import ingredientRoutes from "./routes/ingredients.routes";
import orderRoutes from "./routes/orders.routes";
import inventoryRoutes from "./routes/inventory.routes";
import locationsRoutes from "./routes/locations.routes";
import relationship from "./routes/relationships.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/routes", locationsRoutes);
app.use("/api/relationships", relationship);

export default app;
