"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = exports.upload = void 0;
const db_1 = __importDefault(require("../database/db"));
const multer_1 = __importDefault(require("multer"));
// Configuração do armazenamento de imagens
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Garante que as imagens serão armazenadas na pasta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nomeia o arquivo com um timestamp para evitar conflitos
    }
});
exports.upload = (0, multer_1.default)({ storage });
// Função para listar todos os produtos com filtros e ordenação
const getProducts = (req, res) => {
    const { nome, fornecedorId, orderBy } = req.query;
    let query = 'SELECT * FROM Produto WHERE 1=1';
    const params = [];
    if (nome) {
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (fornecedorId) {
        query += ' AND fornecedorId = ?';
        params.push(fornecedorId);
    }
    if (orderBy) {
        query += ` ORDER BY preco ${orderBy === 'asc' ? 'ASC' : 'DESC'}`;
    }
    db_1.default.all(query, params, (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ produtos: rows });
    });
};
exports.getProducts = getProducts;
// Função para criar um novo produto
const createProduct = (req, res) => {
    const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null; // Caminho relativo para o frontend acessar
    db_1.default.run('INSERT INTO Produto (nome, descricao, preco, quantidade, imagem, fornecedorId) VALUES (?, ?, ?, ?, ?, ?)', [nome, descricao, preco, quantidade, imagem, fornecedorId], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Produto criado com sucesso' });
    });
};
exports.createProduct = createProduct;
// Função para atualizar um produto existente
const updateProduct = (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
    const imagem = req.file ? req.file.path : null; // Caminho da nova imagem, se houver
    db_1.default.run('UPDATE Produto SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ?, fornecedorId = ? WHERE id = ?', [nome, descricao, preco, quantidade, imagem, fornecedorId, id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Produto não encontrado' });
        res.json({ message: 'Produto atualizado com sucesso' });
    });
};
exports.updateProduct = updateProduct;
// Função para deletar um produto
const deleteProduct = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Produto WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Produto não encontrado' });
        res.json({ message: 'Produto deletado com sucesso' });
    });
};
exports.deleteProduct = deleteProduct;
