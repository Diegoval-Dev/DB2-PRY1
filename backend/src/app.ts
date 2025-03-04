import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import supplierRoutes from "./routes/suppliers.routes";
import ingredientRoutes from "./routes/ingredients.routes";
import orderRoutes from "./routes/orders.routes";
import inventoryRoutes from "./routes/inventory.routes";
import locationRoutes from "./routes/location.routes";
import locationsRoutes from "./routes/locations.routes";
import relationship from "./routes/relationships.routes";
import categories from "./routes/categories.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/location", locationRoutes )
app.use("/api/locations", locationsRoutes);
app.use("/api/routes", locationsRoutes);
app.use("/api/relationships", relationship);
app.use("/api/categories", categories);
app.use("/api/dashboard", dashboardRoutes)


export default app;
