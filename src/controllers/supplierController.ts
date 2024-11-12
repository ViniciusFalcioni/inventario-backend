import { Request, Response } from 'express';
import db from '../database/db';

// Listar todos os fornecedores
export const getSuppliers = (req: Request, res: Response) => {
    db.all('SELECT * FROM Fornecedor', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ fornecedores: rows });
    });
};

// Criar um novo fornecedor
export const createSupplier = (req: Request, res: Response) => {
    const { nome, cnpj, contato, endereco } = req.body;

    // Verificar se o CNPJ já existe no banco de dados
    db.get('SELECT * FROM Fornecedor WHERE cnpj = ?', [cnpj], (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar CNPJ' });
        if (row) {
            return res.status(400).json({ error: 'CNPJ já cadastrado' });
        }

        // Inserir fornecedor caso o CNPJ não exista
        db.run(
            'INSERT INTO Fornecedor (nome, cnpj, contato, endereco) VALUES (?, ?, ?, ?)',
            [nome, cnpj, contato, endereco],
            function (err) {
                if (err) return res.status(500).json({ error: 'Erro ao inserir fornecedor' });
                res.status(201).json({ id: this.lastID, message: 'Fornecedor cadastrado com sucesso' });
            }
        );
    });
};

// Atualizar um fornecedor existente
export const updateSupplier = (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, cnpj, contato, endereco } = req.body;
    db.run(
        'UPDATE Fornecedor SET nome = ?, cnpj = ?, contato = ?, endereco = ? WHERE id = ?',
        [nome, cnpj, contato, endereco, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Fornecedor não encontrado' });
            res.json({ message: 'Fornecedor atualizado com sucesso' });
        }
    );
};

// Deletar um fornecedor
export const deleteSupplier = (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM Fornecedor WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Fornecedor não encontrado' });
        res.json({ message: 'Fornecedor deletado com sucesso' });
    });
};
