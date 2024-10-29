"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const db_1 = __importDefault(require("../database/db"));
// Listar todas as transações
const getTransactions = (req, res) => {
    db_1.default.all('SELECT * FROM Transacao', [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ transacoes: rows });
    });
};
exports.getTransactions = getTransactions;
// Criar uma nova transação
const createTransaction = (req, res) => {
    const { data, tipo, valor, produtoId, pedidoId } = req.body;
    db_1.default.run('INSERT INTO Transacao (data, tipo, valor, produtoId, pedidoId) VALUES (?, ?, ?, ?, ?)', [data, tipo, valor, produtoId, pedidoId], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Transação criada com sucesso' });
    });
};
exports.createTransaction = createTransaction;
// Atualizar uma transação existente
const updateTransaction = (req, res) => {
    const { id } = req.params;
    const { data, tipo, valor, produtoId, pedidoId } = req.body;
    db_1.default.run('UPDATE Transacao SET data = ?, tipo = ?, valor = ?, produtoId = ?, pedidoId = ? WHERE id = ?', [data, tipo, valor, produtoId, pedidoId, id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Transação não encontrada' });
        res.json({ message: 'Transação atualizada com sucesso' });
    });
};
exports.updateTransaction = updateTransaction;
// Deletar uma transação
const deleteTransaction = (req, res) => {
    const { id } = req.params;
    db_1.default.run('DELETE FROM Transacao WHERE id = ?', id, function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        if (this.changes === 0)
            return res.status(404).json({ message: 'Transação não encontrada' });
        res.json({ message: 'Transação deletada com sucesso' });
    });
};
exports.deleteTransaction = deleteTransaction;
