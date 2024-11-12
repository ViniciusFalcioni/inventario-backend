// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import db from '../database/db';

interface QueryResult {
    total: number;
}

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const queries = {
            totalProducts: 'SELECT COUNT(*) as total FROM Produto',
            totalSuppliers: 'SELECT COUNT(*) as total FROM Fornecedor',
            totalOrders: 'SELECT COUNT(*) as total FROM Pedido',
        };

        const results = await Promise.all(
            Object.values(queries).map(query =>
                new Promise<number>((resolve, reject) => {
                    db.get(query, (err, row: QueryResult) => {
                        if (err) reject(err);
                        else resolve(row?.total || 0); // Garantimos que `total` existe
                    });
                })
            )
        );

        res.json({
            totalProducts: results[0],
            totalSuppliers: results[1],
            totalOrders: results[2],
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
    }
};
