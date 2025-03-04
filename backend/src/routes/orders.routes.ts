import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrderFromRestaurant} from "../controllers/orders.controller";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/restaurant", getOrderFromRestaurant);

export default router;