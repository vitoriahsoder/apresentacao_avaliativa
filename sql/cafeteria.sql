create database cafeteria;
use cafeteria;
drop database cafeteria;

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20)
);


CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50)
);


CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_produtos INT NOT NULL,
    data_pedido varchar(100) not null,
    valor_total DECIMAL,

    FOREIGN KEY (id_cliente)
        REFERENCES clientes(id_cliente)
);


CREATE TABLE itens_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_pedido)
        REFERENCES pedidos(id_pedido),

    FOREIGN KEY (id_produto)
        REFERENCES produtos(id_produto)
);



-- INSERTS DE CLIENTES
INSERT INTO clientes (nome, telefone) VALUES
('Ana Silva', '51999990001'),
('Pedro Souza', '51999990002'),
('Mariana Costa', '51999990003'),
('Lucas Oliveira', '51999990004'),
('Julia Santos', '51999990005');


-- INSERTS DE PRODUTOS
INSERT INTO produtos (nome, descricao, preco, categoria) VALUES
('Cafe Expresso', 'Cafe tradicional', 6.00, 'Bebidas'),
('Capuccino', 'Cafe com leite e espuma', 10.00, 'Bebidas'),
('Cafe com Leite', 'Cafe com leite quente', 8.00, 'Bebidas'),
('Bolo de Chocolate', 'Fatia de bolo de chocolate', 9.00, 'Doces'),
('Pao de Queijo', 'Porcao de pao de queijo', 7.00, 'Salgados'),
('Croissant', 'Croissant de manteiga', 8.50, 'Salgados'),
('Chocolate Quente', 'Chocolate quente cremoso', 11.00, 'Bebidas');


-- INSERTS DE PEDIDOS
INSERT INTO pedidos
(id_cliente, id_produtos, data_pedido, valor_total)
VALUES
(1, 1, '09/10/2026', 16.00),
(2, 2, '09/10/2026', 23.00),
(3, 3, '09/10/2026', 17.00),
(1, 4, '09/10/2026', 24.00),
(4, 5, '09/10/2026', 14.00);


-- INSERTS DE ITENS DOS PEDIDOS
INSERT INTO itens_pedido
(id_pedido, id_produto, quantidade, preco_unitario)
VALUES
(1, 1, 1, 6.00),
(1, 2, 1, 10.00),
(2, 2, 1, 10.00),
(2, 5, 1, 7.00),
(2, 1, 1, 6.00),
(3, 3, 1, 8.00),
(3, 4, 1, 9.00),
(4, 4, 2, 9.00),
(4, 1, 1, 6.00),
(5, 5, 2, 7.00);



SELECT * FROM clientes;
SELECT * FROM produtos;
SELECT * FROM pedidos;
SELECT * FROM itens_pedido;
