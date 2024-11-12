// src/controllers/clientController.ts
import { Request, Response } from 'express';
import db from '../database/db';

export const getClients = (req: Request, res: Response) => {
    const { nome, cpf_cnpj } = req.query;

    let query = 'SELECT * FROM Cliente WHERE 1=1';
    const params: any[] = [];

    if (nome) {
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (cpf_cnpj) {
        query += ' AND cpf_cnpj = ?';
        params.push(cpf_cnpj);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ clientes: rows });
    });
};

export const createClient = (req: Request, res: Response) => {
    const { nome, cpf_cnpj, contato, endereco } = req.body;

    db.run(
        'INSERT INTO Cliente (nome, cpf_cnpj, contato, endereco) VALUES (?, ?, ?, ?)',
        [nome, cpf_cnpj, contato, endereco],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Cliente cadastrado com sucesso' });
        }
    );
};

export const updateClient = (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, cpf_cnpj, contato, endereco } = req.body;

    db.run(
        'UPDATE Cliente SET nome = ?, cpf_cnpj = ?, contato = ?, endereco = ? WHERE id = ?',
        [nome, cpf_cnpj, contato, endereco, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Cliente não encontrado' });
            res.json({ message: 'Cliente atualizado com sucesso' });
        }
    );
};

export const deleteClient = (req: Request, res: Response) => {
    const { id } = req.params;

    db.run('DELETE FROM Cliente WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json({ message: 'Cliente deletado com sucesso' });
    });
};

// Endpoint para obter histórico de pedidos de um cliente
export const getClientOrders = (req: Request, res: Response) => {
    const { clientId } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM Pedido WHERE cliente_id = ?';
    const params: any[] = [clientId];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ pedidos: rows });
    });
};
