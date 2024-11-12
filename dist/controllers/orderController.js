"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderDetails = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrders = void 0;
const db_1 = __importDefault(require("../database/db"));
// Função auxiliar para criar uma transação
const createTransaction = (data, tipo, valor, pedidoId, produtoId) => {
    return new Promise((resolve, reject) => {
        db_1.default.run('INSERT INTO Transacao (data, tipo, valor, pedidoId, produtoId) VALUES (?, ?, ?, ?, ?)', [data, tipo, valor, pedidoId, produtoId], (err) => {
            if (err)
                reject(err);
            resolve();
        });
    });
};
// Função para listar pedidos
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, status, orderBy } = req.query;
        let query = 'SELECT * FROM Pedido WHERE 1=1';
        const params = [];
        if (data) {
            query += ' AND data = ?';
            params.push(data);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (orderBy) {
            query += ` ORDER BY ${orderBy === 'date' ? 'data' : 'total'} ASC`;
        }
        db_1.default.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ pedidos: rows });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao obter pedidos' });
    }
});
exports.getOrders = getOrders;
// Função para criar um pedido e transação associada
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clienteId, data, status, valor_total, itens } = req.body;
        if (!clienteId || !data || !status || !Array.isArray(itens) || itens.length === 0) {
            res.status(400).json({ error: 'Dados incompletos para criar o pedido' });
            return;
        }
        db_1.default.run('INSERT INTO Pedido (clienteId, data, status, total) VALUES (?, ?, ?, ?)', [clienteId, data, status, valor_total], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            const pedidoId = this.lastID;
            const itemInsertQuery = 'INSERT INTO ItemPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)';
            const itemInsertParams = itens.map((item) => [
                pedidoId,
                item.produtoId,
                item.quantidade,
                item.precoUnitario,
            ]);
            db_1.default.serialize(() => __awaiter(this, void 0, void 0, function* () {
                let errorOccurred = false;
                itemInsertParams.forEach((params, index) => {
                    db_1.default.run(itemInsertQuery, params, (err) => {
                        if (err && !errorOccurred) {
                            errorOccurred = true;
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        if (index === itemInsertParams.length - 1 && !errorOccurred) {
                            // Criar a transação associada ao pedido
                            createTransaction(data, 'Entrada', valor_total, pedidoId, null)
                                .then(() => {
                                res.status(201).json({ id: pedidoId, message: 'Pedido e transação criados com sucesso' });
                            })
                                .catch((error) => {
                                res.status(500).json({ error: error.message });
                            });
                        }
                    });
                });
            }));
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});
exports.createOrder = createOrder;
// Função para atualizar um pedido
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data, status, valor_total, itens } = req.body;
        db_1.default.run('UPDATE Pedido SET data = ?, status = ?, total = ? WHERE id = ?', [data, status, valor_total, id], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Pedido não encontrado' });
                return;
            }
            db_1.default.run('DELETE FROM ItemPedido WHERE pedidoId = ?', id, (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                const itemInsertQuery = 'INSERT INTO ItemPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)';
                const itemInsertParams = itens.map((item) => [
                    id,
                    item.produtoId,
                    item.quantidade,
                    item.precoUnitario,
                ]);
                db_1.default.serialize(() => {
                    let errorOccurred = false;
                    itemInsertParams.forEach((params, index) => {
                        db_1.default.run(itemInsertQuery, params, (err) => {
                            if (err && !errorOccurred) {
                                errorOccurred = true;
                                res.status(500).json({ error: err.message });
                                return;
                            }
                            if (index === itemInsertParams.length - 1 && !errorOccurred) {
                                res.json({ message: 'Pedido atualizado com sucesso' });
                            }
                        });
                    });
                });
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
});
exports.updateOrder = updateOrder;
// Função para deletar um pedido e suas transações
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        db_1.default.run('DELETE FROM Pedido WHERE id = ?', id, function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Pedido não encontrado' });
                return;
            }
            db_1.default.run('DELETE FROM ItemPedido WHERE pedidoId = ?', id, (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                db_1.default.run('DELETE FROM Transacao WHERE pedidoId = ?', id, (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ message: 'Pedido e transações associadas deletados com sucesso' });
                });
            });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
});
exports.deleteOrder = deleteOrder;
// Função para obter detalhes de um pedido
const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const query = `
            SELECT i.*, p.nome AS produto_nome
            FROM ItemPedido i
            JOIN Produto p ON i.produtoId = p.id
            WHERE i.pedidoId = ?
        `;
        db_1.default.all(query, [orderId], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ itens: rows });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao obter detalhes do pedido' });
    }
});
exports.getOrderDetails = getOrderDetails;
