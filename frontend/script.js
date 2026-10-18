
const botao = document.getElementById("btnBuscar");
const listarPedidos = document.getElementById("listaPedidos");
const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formPedidos")
const campoCliente = document.getElementById("id_cliente");     
const campoProduto = document.getElementById("id_produtos");   
const campoData = document.getElementById("data_pedido");       
const campoPreco = document.getElementById("valor_total");      
const botaoSalvar = document.getElementById("btnSalvar");


const API = "http://localhost:3000/cafeteria";

let idEdicao = null;

botao.addEventListener("click", buscarPedidos);
formulario.addEventListener("submit", salvarPedido);


async function buscarPedidos() {
    try {
        mensagem.textContent = "Buscando pedidos...";

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const pedidos = await resposta.json();
        console.log("Dados recebidos da API:", pedidos);
        listarPedidos.innerHTML = "";

        if (pedidos.length === 0) {
            mensagem.textContent = "Nenhum pedido cadastrado.";
            return;
        }

        for (let i = 0; i < pedidos.length; i++) {
            listarPedidos.innerHTML += `
                <tr>
                    <td>${pedidos[i].id_pedido}</td>
                    <td>${pedidos[i].nome_cliente}</td>
                    <td>${pedidos[i].nome_produto}</td>
                    <td>${pedidos[i].descricao ?? ""}</td>
                    <td>${pedidos[i].data_pedido}</td>
                    <td>R$ ${pedidos[i].valor_total}</td>
                    <td>
                        <button type="button"
                            onclick="editarPedido(${pedidos[i].id_pedido})">
                            Editar
                        </button>

                        <button type="button"
                            onclick="excluirPedido(${pedidos[i].id_pedido})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        }

        mensagem.textContent = "Pedidos encontrados!";

    } catch (erro) {
        mensagem.textContent = "Erro ao buscar pedidos.";
        console.error("Erro ao buscar pedidos:", erro);
    }
}


async function salvarPedido(evento) {
    evento.preventDefault();

    if (idEdicao === null) {
        await cadastrarPedido();
    } else {
        await atualizarPedido();
    }
}

function obterDadosFormulario() {
    return {
        id_cliente: Number(campoCliente.value),
        id_produtos: Number(campoProduto.value),
        data_pedido: campoData.value,
        valor_total: Number(campoPreco.value)
    };
}

async function cadastrarPedido() {
    try {
        const pedido = obterDadosFormulario();

        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        if (!resposta.ok) throw new Error("Erro HTTP: " + resposta.status);

        const dados = await resposta.json();
        formulario.reset();
        await buscarPedidos();
        mensagem.textContent = dados.mensagem || "Pedido cadastrado com sucesso!";
    } catch (erro) {
        mensagem.textContent = "Não foi possível cadastrar o pedido.";
        console.error("Erro ao cadastrar pedido:", erro);
    }
}

async function editarPedido(id) {
    try {
        const resposta = await fetch(`${API}/${id}`);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const pedido = await resposta.json();

        campoCliente.value = pedido.id_cliente ?? "";
        campoProduto.value = pedido.id_produtos ?? "";
        
        
        if (pedido.data_pedido) {
            if (pedido.data_pedido.includes("/")) {
                const partes = pedido.data_pedido.split("/"); 
                campoData.value = `${partes[2]}-${partes[1]}-${partes[0]}`; 
            } else {
                
                campoData.value = pedido.data_pedido.split("T")[0];
            }
        } else {
            campoData.value = "";
        }
        

        campoPreco.value = pedido.valor_total ?? "";

        idEdicao = pedido.id_pedido;
        botaoSalvar.textContent = "Atualizar";

        mensagem.textContent = `Editando pedido de ID: ${pedido.id_pedido}`;
    } catch (erro) {
        mensagem.textContent = "Erro ao buscar pedido para edição.";
        console.error("Erro ao carregar pedido:", erro);
    }
}

async function atualizarPedido() {
    try {
        const pedido = obterDadosFormulario();

        const resposta = await fetch(`${API}/${idEdicao}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        formulario.reset();
        idEdicao = null;
        botaoSalvar.textContent = "Cadastrar";

        await buscarPedidos();

        mensagem.textContent =
            dados.mensagem || "Pedido atualizado com sucesso!";
    } catch (erro) {
        mensagem.textContent = "Erro ao atualizar pedido.";
        console.error("Erro ao atualizar pedido:", erro);
    }
}

async function excluirPedido(id) {
    if (!confirm(`Tem certeza que deseja excluir o pedido ${id}?`)) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        await buscarPedidos();

        mensagem.textContent =
            dados.mensagem || "Pedido excluído com sucesso!";
    } catch (erro) {
        mensagem.textContent = "Erro ao excluir pedido.";
        console.error("Erro ao excluir pedido:", erro);
    }
}
