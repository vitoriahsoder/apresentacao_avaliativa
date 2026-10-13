const botao = document.getElementById("btnBuscar");
const listarPedidos = document.getElementById("listaPedidos");
const mensagem = document.getElementById("mensagem");

const formulario=document.getElementById("formPedidos");
const campoNome=document.getElementById("nome");
const campoDescriao=document.getElementById("descricao");
const campoPreco=document.getElementById("preco");
const campoCategoria=document.getElementById("categoria");

botao.addEventListener("click", buscarPedidos);

//formulario.addEventListener("submit", cadastrarLivro){;
formulario.addEventListener("submit", salvarPedido);

let idEdicao=null;

const botaoSalvar=document.getElementById("btnSalvar");

formulario.addEventListener("submit", cadastrarPedidos);

async function buscarPedido() {
    try{
        mensagem.textContent = "Buscando pedido...";
        const resposta = await fetch("http://localhost:3000/pedidos");
        if(!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const pedidos = await resposta.json();
        listarPedidos.innerHTML = "";
        if(pedidos.length === 0) {
            mensagem.textContent = "Nenhum pedido cadastrado.";
            return;
        }
        for(let i=0; i<pedidos.length; i++) {
            listarPedidos.innerHTML += `<tr><td>${pedidos[i].id}</td>
            <td>${pedidos[i].nome}</td>
            <td>${pedidos[i].descricao}</td>
            <td>${pedidos[i].preco}</td>
            <td>${pedidos[i].categoria}</td>
            

            <td>
            <button onClick="editarPedido(${pedidos[i].id})">
            Editar</button>

             <button onClick="excluirPedido(${pedidos[i].id})">
            Excluir</button>

            </tr>`;
        }
        mensagem.textContent = "Pedido encontrados!";

    }catch(erro){
        mensagem.textContent = "Erro ao buscar pedido: ";
        console.log("Erro:", erro);

    }
}

async function salvarPedido(evento) {
    evento.preventDefault();
    if(idEdicao===null) {
        await cadastrarPedido(evento);
    } else {
        await atualizarPedido(evento);
    }


//async function cadastrarLivro(evento) {
async function cadastrarPedido() {
    //impede o forms recarregar a página
    //evento.preventDefault();
    try{
        const nome=campoTitulo.value;
        const preco=campoAutor.value;
        const categoria=campoAno.value;
        const descricao=campoAno.value;

        //objeto para armazenar os dados e organizalos
        const pedido={nome: nome, preco: preco, categoria: categoria, descricao: descricao}
        console.log("Pedido enviado:", pedido);

        //enviar para API
        const resposta = await fetch("http://localhost:3000/pedidos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:  JSON.stringify(pedido) //transformar de js para json
        });
        if(!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados=await resposta.json();
        console.log("Resposta da API:", dados);

        formulario.reset();

        await buscarPedidos();

        //mostra a mensagem retorada pela API
        mensagem.textContent = dados.mensagem;
    
    }catch(erro){
        mensagem.textContent = 'Não foi possível cadastrar o pedido.';
        console.log("Erro ao cadastrar pedido:", erro);
    }
}
}

    async function editarPedido (id) {
        try{
            //buscar pelo id o pedido que vai ser editado
            const resposta=await fetch("http://localhost:3000/pedidos/" +id);
            if(!resposta.ok) {
                throw new Error("Erro HTTP: " + resposta.status);
            }

            const pedido=await resposta.json();

            campoTitulo.value=pedido.nome;
            campoAutor.value=pedido.preco;
            campoAno.value=pedido.categoria;
            campoAno.value=pedido.descricao;

            idEdicao=pedido.id;
            botaoSalvar.textContent="Atualizar";
            mensagem.textContent = "Editando pedido de ID: " + pedido.id;
        
        }catch(erro){
            mensagem.textContent = "Erro ao buscar pedido para edição: ";
            console.log("Erro ao carregar pedido:", erro);
        }
    }

    async function atualizarPedido() {
        try{
            const pedido={
                nome: campoTitulo.value,
                preco: campoAutor.value,
                categoria: campoAno.value,
                descricao: campoAno.value
            }
            console.log("Pedido atualizado:", pedido);

            //PUT
            const resposta=await fetch("http://localhost:3000/pedidos/" + idEdicao, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(pedido)
            });
            if(!resposta.ok) {
                throw new Error("Erro HTTP: " + resposta.status);
            }
            const dados=await resposta.json();
            formulario.reset();
            idEdicao=null;
            botaoSalvar.textContent="Cadastrar";
            await buscarPedidos();
            mensagem.textContent = dados.mensagem;
        
        }catch(erro){
            mensagem.textContent = "Erro ao atualizar pedido: ";
            console.log("Erro ao atualizar pedido:", erro);
        }
    }

async function excluirPedido(id) {
    const confirmar = confirm("Tem certeza que deseja excluir este pedido: " + id + "?");
    if (!confirmar) {
        return;
    }
    try {
        const resposta = await fetch("http://localhost:3000/pedidos/" + id, {
            method: "DELETE"
        });
        if(!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }
        const dados = await resposta.json();
        await buscarPedidos();
        mensagem.textContent =dados.mensagem;
    } catch(erro) {
        mensagem.textContent = "Erro ao excluir pedido: ";
        console.log("Erro ao excluir pedido:", erro);
    }
}