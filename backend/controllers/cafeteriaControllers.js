import { pool } from "../database/conexao.js";

async function listarPedidos(req, res) {
    try {
        const [cafeteria] = await pool.query("SELECT * FROM cafeteria");
        res.status(200).json(cafeteria);
    }
    catch (erro) {
        console.error("Erro ao listar pedidos:", erro);
        res.status(500).json({ mensagem: "Erro ao listar pedidos" });
    }
}

async function buscarPedidosPorId(req, res) {
    try {
        const id = req.params.id;
        const [cafeteria] = await pool.query("SELECT * FROM cafeteria WHERE id=?", [id]);
        if (livros.length === 0) {
            return res.status(404).json({ mensagem: "Pedido não encontrado" });
        }
        res.status(200).json(cafeteria[0]);
    } catch (erro) {
        console.error("Erro ao buscar pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar pedido" });
    }
}

//Post
async function cadastrarPedido(req, res) {
    const { data_pedido, valor_total } = req.body;
    if (!data_pedido || !valor_total) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }
    try {
        const [resultado] = await pool.query("INSERT INTO livros (data_pedido, valor_total) VALUES (?, ?)", [data_pedido, valor_total]);
        res.status(201).json({ mensagem: "Pedido cadatrado com sucesso", id: resultado.insertId });

    } catch (erro) {
        console.error("Erro ao cadastrar livro:", erro);
        res.status(500).json({ mensagem: "Erro ao cadastrar livro" });
    }
}

async function atualizarPedido(req, res) {
    try {
        const id = req.params.id;
        const { data_pedido, valor_total } = req.body;
        if (!data_pedido || !valor_total) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
        }
        const [resultado] = await pool.query
            ("UPDATE cafeteria SET data_pedido=?, valor_total=? WHERE id=?", [data_pedido, valor_total, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Pedido não encontrado" });
        }
        res.status(200).json({ mensagem: "Pedido atualizado com sucesso" });

    } catch (erro) {
        console.error("Erro ao atualizar pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao atualizar pedido" });
    }
}

async function excluirPedido(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM cafeteria WHERE id=?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Pedido não encontrado" });
        }
        res.status(200).json({ mensagem: "Pedido excluído com sucesso" });
    } catch (erro) {
        console.error("Erro ao excluir pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao excluir pedido" });
    }
}   

export { listarPedidos, cadastrarPedido, atualizarPedido, buscarPedidosPorId, excluirPedido };
cafeteria