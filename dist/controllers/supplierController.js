"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSuppliers = void 0;
const db_1 = __importDefault(require("../database/db"));
// Listar todos os fornecedores
const getSuppliers = (req, res) => {
    db_1.default.all('SELECT * FROM Fornecedor', [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ fornecedores: rows });
    });
};
exports.getSuppliers = getSuppliers;
// Criar um novo fornecedor
const createSupplier = (req, res) => {
    const { nome, cnpj, contato, endereco } = req.body;
    // Verificar se o CNPJ já existe no banco de dados
    db_1.default.get('SELECT * FROM Fornecedor WHERE cnpj = ?', [cnpj], (err, row) => {
        if (err)
            return res.status(500).json({ error: 'Erro ao verificar CNPJ' });
        if (row) {
            return res.status(400).json({ error: 'CNPJ já cadastrado' });
        }
        // Inserir fornecedor caso o CNPJ não exista
        db_1.default.run('INSERT INTO Fornecedor (nome, cnpj, contato, endereco) VALUES (?, ?, ?, ?)', [nome, cnpj, contato, endereco], function (err) {
            if (err)
                return res.status(500).json({ error: 'Erro ao inserir fornecedor' });
            res.status(201).json({ id: this.lastID, message: 'Fornecedor cadastrado com sucesso' });
        });
    });
};
exports.createSupplier = createSupplier;
// Atualizar um fornecedor existente
const updateSupplier = (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, contato, endereco } = req.body;
    db_1.default.run('UPDATE Fornecedor SET nome = ?, cnpj = ?, contato = ?, endereco = ? WHERE id = ?', [nome, cnpj, contato, endereco, id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        res.json({ message: 'Fornecedor atualizado com sucesso' });
    });
};
exports.updateSupplier = updateSupplier;
// Deletar um fornecedor
const deleteSupplier = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Fornecedor WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        res.json({ message: 'Fornecedor deletado com sucesso' });
    });
};
exports.deleteSupplier = deleteSupplier;
