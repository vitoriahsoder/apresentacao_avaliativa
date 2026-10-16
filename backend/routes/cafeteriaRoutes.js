import express from "express";

import {
    listarPedidos,cadastrarPedidos,atualizarPedidos,buscarPedidosPorId,excluirPedidos} from "../controllers/cafeteriaControllers.js";

const router = express.Router();

router.get("/", listarPedidos);
router.post("/", cadastrarPedidos);
router.put("/:id", atualizarPedidos);
router.get("/:id", buscarPedidosPorId);
router.delete("/:id", excluirPedidos);

export default router;