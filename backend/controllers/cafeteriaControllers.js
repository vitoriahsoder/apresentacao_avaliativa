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

async function atualizarLivro(req, res) {
    try {
        const id = req.params.id;
        const { titulo, autor, ano } = req.body;
        if (!titulo || !autor || !ano) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
        }
        const [resultado] = await pool.query
            ("UPDATE livros SET titulo=?, autor=?, ano=? WHERE id=?", [titulo, autor, ano, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Livro não encontrado" });
        }
        res.status(200).json({ mensagem: "Livro atualizado com sucesso" });

    } catch (erro) {
        console.error("Erro ao atualizar livro:", erro);
        res.status(500).json({ mensagem: "Erro ao atualizar livro" });
    }
}

async function excluirLivro(req, res) {
    try {
        const id = req.params.id;
        const [resultado] = await pool.query("DELETE FROM livros WHERE id=?", [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Livro não encontrado" });
        }
        res.status(200).json({ mensagem: "Livro excluído com sucesso" });
    } catch (erro) {
        console.error("Erro ao excluir livro:", erro);
        res.status(500).json({ mensagem: "Erro ao excluir livro" });
    }
}   

export { listarLivros, cadastrarLivro, atualizarLivro, buscarLivroPorId, excluirLivro };
