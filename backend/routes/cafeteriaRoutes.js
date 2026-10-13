import express from "express";
import {listarPedidos, cadastrarPedidos, atualizarPedidos, buscarPedidosPorId, excluirPedidos} from "../controllers/livrosController.js";

const router = express.Router();
router.get("/", listarPedidos);
router.post("/", cadastrarPedidos);
router.put("/:id", atualizarPedido);
router.get("/:id", buscarPedidosPorId);
router.delete("/:id", excluirPedidos);

export default router;
