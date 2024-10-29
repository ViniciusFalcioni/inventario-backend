import { Request, Response } from 'express';
import db from '../database/db';

// Listar todas as transações
export const getTransactions = (req: Request, res: Response) => {
    db.all('SELECT * FROM Transacao', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ transacoes: rows });
    });
};

// Criar uma nova transação
export const createTransaction = (req: Request, res: Response) => {
    const { data, tipo, valor, produtoId, pedidoId } = req.body;
    db.run(
        'INSERT INTO Transacao (data, tipo, valor, produtoId, pedidoId) VALUES (?, ?, ?, ?, ?)',
        [data, tipo, valor, produtoId, pedidoId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Transação criada com sucesso' });
        }
    );
};

// Atualizar uma transação existente
export const updateTransaction = (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, tipo, valor, produtoId, pedidoId } = req.body;
    db.run(
        'UPDATE Transacao SET data = ?, tipo = ?, valor = ?, produtoId = ?, pedidoId = ? WHERE id = ?',
        [data, tipo, valor, produtoId, pedidoId, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Transação não encontrada' });
            res.json({ message: 'Transação atualizada com sucesso' });
        }
    );
};

// Deletar uma transação
export const deleteTransaction = (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM Transacao WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Transação não encontrada' });
        res.json({ message: 'Transação deletada com sucesso' });
    });
};
