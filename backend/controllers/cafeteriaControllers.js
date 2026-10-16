import { pool } from "../database/conexao.js";



async function listarPedidos(req, res) {
    try {
        const [pedidos] = await pool.query(`
            SELECT
                pe.id_pedido,
                c.nome AS nome_cliente,
                c.telefone,
                pr.nome AS nome_produto,
                pr.descricao,
                pr.categoria,
                pe.data_pedido,
                pe.valor_total
            FROM pedidos pe
            INNER JOIN clientes c
                ON pe.id_cliente = c.id_cliente
            INNER JOIN produtos pr
                ON pe.id_produtos = pr.id_produto
        `);

        res.status(200).json(pedidos);
    } catch (erro) {
        console.error("Erro ao listar pedidos:", erro);

        res.status(500).json({
            mensagem: "Erro ao listar pedidos."
        });
    }
}


async function buscarPedidosPorId(req, res) {
    try {
        const id = req.params.id;

        const [pedidos] = await pool.query(
            "SELECT * FROM pedidos WHERE id_pedido = ?",
            [id]
        );

        if (pedidos.length === 0) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado"
            });
        }

        res.status(200).json(pedidos[0]);
    } catch (erro) {
        console.error("Erro ao buscar pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar pedido" });
    }
}

async function cadastrarPedidos(req, res) {
    try {
        const { data_pedido, valor_total, id_cliente, id_produtos } = req.body;

        if (!data_pedido || !valor_total || !id_cliente || !id_produtos === undefined) {
            return res.status(400).json({
                mensagem: "Data do pedido e valor total são obrigatórios"
            });
        }

        const [resultado] = await pool.query(
            "INSERT INTO pedidos (id_cliente, id_produtos, data_pedido, valor_total) VALUES (?, ?, ?, ?)",
            [id_cliente, id_produtos, data_pedido, valor_total]
        );

        res.status(201).json({
            mensagem: "Pedido cadastrado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao cadastrar pedido" });
    }
}

async function atualizarPedidos(req, res) {
    try {
        const id = req.params.id;
        const { data_pedido, valor_total } = req.body;

        if (!data_pedido || !valor_total === undefined) {
            return res.status(400).json({
                mensagem: "Data do pedido e valor total são obrigatórios"
            });
        }

        const [resultado] = await pool.query(
            "UPDATE pedidos SET data_pedido = ?, valor_total = ? WHERE id_pedido = ?",
            [data_pedido, valor_total, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Pedido atualizado com sucesso"
        });
    } catch (erro) {
        console.error("Erro ao atualizar pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao atualizar pedido" });
    }
}

async function excluirPedidos(req, res) {
    try {
        const id = req.params.id;

        // 1. Apaga primeiro os itens filhos vinculados a esse pedido
        await pool.query("DELETE FROM itens_pedido WHERE id_pedido = ?", [id]);

        // 2. Agora apaga o pedido com segurança
        const [resultado] = await pool.query(
            "DELETE FROM pedidos WHERE id_pedido = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Pedido não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Pedido excluído com sucesso"
        });
    } catch (erro) {
        console.error("Erro ao excluir pedido:", erro);
        res.status(500).json({ mensagem: "Erro ao excluir pedido" });
    }
}

export {
    listarPedidos,
    cadastrarPedidos,
    atualizarPedidos,
    buscarPedidosPorId,
    excluirPedidos
};