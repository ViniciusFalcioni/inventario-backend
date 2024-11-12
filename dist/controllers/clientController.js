"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientOrders = exports.deleteClient = exports.updateClient = exports.createClient = exports.getClients = void 0;
const db_1 = __importDefault(require("../database/db"));
const getClients = (req, res) => {
    const { nome, cpf_cnpj } = req.query;
    let query = 'SELECT * FROM Cliente WHERE 1=1';
    const params = [];
    if (nome) {
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (cpf_cnpj) {
        query += ' AND cpf_cnpj = ?';
        params.push(cpf_cnpj);
    }
    db_1.default.all(query, params, (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ clientes: rows });
    });
};
exports.getClients = getClients;
const createClient = (req, res) => {
    const { nome, cpf_cnpj, contato, endereco } = req.body;
    db_1.default.run('INSERT INTO Cliente (nome, cpf_cnpj, contato, endereco) VALUES (?, ?, ?, ?)', [nome, cpf_cnpj, contato, endereco], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Cliente cadastrado com sucesso' });
    });
};
exports.createClient = createClient;
const updateClient = (req, res) => {
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
exports.updateClient = updateClient;
const deleteClient = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Cliente WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json({ message: 'Cliente deletado com sucesso' });
    });
};
exports.deleteClient = deleteClient;
// Endpoint para obter histórico de pedidos de um cliente
const getClientOrders = (req, res) => {
    const { clientId } = req.params;
    const { status } = req.query;
    let query = 'SELECT * FROM Pedido WHERE cliente_id = ?';
    const params = [clientId];
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    db_1.default.all(query, params, (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ pedidos: rows });
    });
};
exports.getClientOrders = getClientOrders;
