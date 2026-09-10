import { Router } from "express";
import { cadastro, login } from "../controllers/authController.js";
import { asyncRoute } from "../middlewares/errorMiddleware.js";

const router = Router();
router.post("/cadastro", asyncRoute(cadastro));
router.post("/login", asyncRoute(login));
export default router;
