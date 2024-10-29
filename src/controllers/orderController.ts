import { Request, Response } from 'express';
import db from '../database/db';

// Listar todos os pedidos
export const getOrders = (req: Request, res: Response) => {
    db.all('SELECT * FROM Pedido', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ pedidos: rows });
    });
};

// Criar um novo pedido
export const createOrder = (req: Request, res: Response) => {
    const { data, clienteId, status, total } = req.body;
    db.run(
        'INSERT INTO Pedido (data, clienteId, status, total) VALUES (?, ?, ?, ?)',
        [data, clienteId, status, total],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Pedido criado com sucesso' });
        }
    );
};

// Atualizar um pedido existente
export const updateOrder = (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, clienteId, status, total } = req.body;
    db.run(
        'UPDATE Pedido SET data = ?, clienteId = ?, status = ?, total = ? WHERE id = ?',
        [data, clienteId, status, total, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Pedido não encontrado' });
            res.json({ message: 'Pedido atualizado com sucesso' });
        }
    );
};

// Deletar um pedido
export const deleteOrder = (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM Pedido WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Pedido não encontrado' });
        res.json({ message: 'Pedido deletado com sucesso' });
    });
};
