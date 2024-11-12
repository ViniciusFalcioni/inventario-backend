import { Request, Response } from 'express';
import db from '../database/db';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tipo, dataInicio, dataFim } = req.query;
        let query = 'SELECT * FROM Transacao WHERE 1=1';
        const params: any[] = [];

        if (tipo) {
            query += ' AND tipo = ?';
            params.push(tipo);
        }
        if (dataInicio) {
            query += ' AND data >= ?';
            params.push(dataInicio);
        }
        if (dataFim) {
            query += ' AND data <= ?';
            params.push(dataFim);
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ transacoes: rows });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter transações' });
    }
};
