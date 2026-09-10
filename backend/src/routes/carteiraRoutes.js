import { Router } from "express";
import { depositar, obterMinhaConta } from "../controllers/carteiraController.js";
import { exigirAutenticacao } from "../middlewares/authMiddleware.js";
import { asyncRoute } from "../middlewares/errorMiddleware.js";
const router = Router();
router.use(exigirAutenticacao);
router.get("/minha", asyncRoute(obterMinhaConta));
router.post("/minha/deposito", asyncRoute(depositar));
export default router;
