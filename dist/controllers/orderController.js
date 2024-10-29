"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrders = void 0;
const db_1 = __importDefault(require("../database/db"));
// Listar todos os pedidos
const getOrders = (req, res) => {
    db_1.default.all('SELECT * FROM Pedido', [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ pedidos: rows });
    });
};
exports.getOrders = getOrders;
// Criar um novo pedido
const createOrder = (req, res) => {
    const { data, clienteId, status, total } = req.body;
    db_1.default.run('INSERT INTO Pedido (data, clienteId, status, total) VALUES (?, ?, ?, ?)', [data, clienteId, status, total], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Pedido criado com sucesso' });
    });
};
exports.createOrder = createOrder;
// Atualizar um pedido existente
const updateOrder = (req, res) => {
    const { id } = req.params;
    const { data, clienteId, status, total } = req.body;
    db_1.default.run('UPDATE Pedido SET data = ?, clienteId = ?, status = ?, total = ? WHERE id = ?', [data, clienteId, status, total, id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json({ message: 'Pedido atualizado com sucesso' });
    });
};
exports.updateOrder = updateOrder;
// Deletar um pedido
const deleteOrder = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Pedido WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json({ message: 'Pedido deletado com sucesso' });
    });
};
exports.deleteOrder = deleteOrder;
