"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomers = void 0;
const db_1 = __importDefault(require("../database/db"));
// Listar todos os clientes
const getCustomers = (req, res) => {
    db_1.default.all('SELECT * FROM Cliente', [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ clientes: rows });
    });
};
exports.getCustomers = getCustomers;
// Criar um novo cliente
const createCustomer = (req, res) => {
    const { nome, cpf_cnpj, contato, endereco } = req.body;
    db_1.default.run('INSERT INTO Cliente (nome, cpf_cnpj, contato, endereco) VALUES (?, ?, ?, ?)', [nome, cpf_cnpj, contato, endereco], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Cliente criado com sucesso' });
    });
};
exports.createCustomer = createCustomer;
// Atualizar um cliente existente
const updateCustomer = (req, res) => {
    const { id } = req.params;
    const { nome, cpf_cnpj, contato, endereco } = req.body;
    db_1.default.run('UPDATE Cliente SET nome = ?, cpf_cnpj = ?, contato = ?, endereco = ? WHERE id = ?', [nome, cpf_cnpj, contato, endereco, id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
};
exports.updateCustomer = updateCustomer;
// Deletar um cliente
const deleteCustomer = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Cliente WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json({ message: 'Cliente deletado com sucesso' });
    });
};
exports.deleteCustomer = deleteCustomer;
