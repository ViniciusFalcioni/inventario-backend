import { Request, Response } from 'express';
import db from '../database/db';

// Listar todos os clientes
export const getCustomers = (req: Request, res: Response) => {
    db.all('SELECT * FROM Cliente', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ clientes: rows });
    });
};

// Criar um novo cliente
export const createCustomer = (req: Request, res: Response) => {
    const { nome, cpf_cnpj, contato, endereco } = req.body;
    db.run(
        'INSERT INTO Cliente (nome, cpf_cnpj, contato, endereco) VALUES (?, ?, ?, ?)',
        [nome, cpf_cnpj, contato, endereco],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Cliente criado com sucesso' });
        }
    );
};

// Atualizar um cliente existente
export const updateCustomer = (req: Request, res: Response) => {
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

// Deletar um cliente
export const deleteCustomer = (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM Cliente WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Cliente não encontrado' });
        res.json({ message: 'Cliente deletado com sucesso' });
    });
};
