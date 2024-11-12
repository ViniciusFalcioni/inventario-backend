import { Request, Response } from 'express';
import db from '../database/db';

// Função auxiliar para criar uma transação
const createTransaction = (data: string, tipo: string, valor: number, pedidoId: number | null, produtoId: number | null) => {
    return new Promise<void>((resolve, reject) => {
        db.run(
            'INSERT INTO Transacao (data, tipo, valor, pedidoId, produtoId) VALUES (?, ?, ?, ?, ?)',
            [data, tipo, valor, pedidoId, produtoId],
            (err) => {
                if (err) reject(err);
                resolve();
            }
        );
    });
};

// Função para listar pedidos
export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, status, orderBy } = req.query;
        let query = 'SELECT * FROM Pedido WHERE 1=1';
        const params: any[] = [];

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

        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ pedidos: rows });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter pedidos' });
    }
};

// Função para criar um pedido e transação associada
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clienteId, data, status, valor_total, itens } = req.body;

        if (!clienteId || !data || !status || !Array.isArray(itens) || itens.length === 0) {
            res.status(400).json({ error: 'Dados incompletos para criar o pedido' });
            return;
        }

        db.run(
            'INSERT INTO Pedido (clienteId, data, status, total) VALUES (?, ?, ?, ?)',
            [clienteId, data, status, valor_total],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }

                const pedidoId = this.lastID;
                const itemInsertQuery = 'INSERT INTO ItemPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)';
                const itemInsertParams: any[] = itens.map((item: { produtoId: number; quantidade: number; precoUnitario: number }) => [
                    pedidoId,
                    item.produtoId,
                    item.quantidade,
                    item.precoUnitario,
                ]);

                db.serialize(async () => {
                    let errorOccurred = false;

                    itemInsertParams.forEach((params, index) => {
                        db.run(itemInsertQuery, params, (err) => {
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
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
};

// Função para atualizar um pedido
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { data, status, valor_total, itens } = req.body;

        db.run(
            'UPDATE Pedido SET data = ?, status = ?, total = ? WHERE id = ?',
            [data, status, valor_total, id],
            function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                if (this.changes === 0) {
                    res.status(404).json({ message: 'Pedido não encontrado' });
                    return;
                }

                db.run('DELETE FROM ItemPedido WHERE pedidoId = ?', id, (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    const itemInsertQuery = 'INSERT INTO ItemPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)';
                    const itemInsertParams: any[] = itens.map((item: { produtoId: number; quantidade: number; precoUnitario: number }) => [
                        id,
                        item.produtoId,
                        item.quantidade,
                        item.precoUnitario,
                    ]);

                    db.serialize(() => {
                        let errorOccurred = false;

                        itemInsertParams.forEach((params, index) => {
                            db.run(itemInsertQuery, params, (err) => {
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
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
};

// Função para deletar um pedido e suas transações
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        db.run('DELETE FROM Pedido WHERE id = ?', id, function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Pedido não encontrado' });
                return;
            }

            db.run('DELETE FROM ItemPedido WHERE pedidoId = ?', id, (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                db.run('DELETE FROM Transacao WHERE pedidoId = ?', id, (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ message: 'Pedido e transações associadas deletados com sucesso' });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
};

// Função para obter detalhes de um pedido
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;

        const query = `
            SELECT i.*, p.nome AS produto_nome
            FROM ItemPedido i
            JOIN Produto p ON i.produtoId = p.id
            WHERE i.pedidoId = ?
        `;

        db.all(query, [orderId], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ itens: rows });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter detalhes do pedido' });
    }
};
