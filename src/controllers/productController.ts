// src/controllers/productController.ts
import { Request, Response } from 'express';
import db from '../database/db';
import multer from 'multer';

// Configuração do armazenamento de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Garante que as imagens serão armazenadas na pasta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nomeia o arquivo com um timestamp para evitar conflitos
    }
});

export const upload = multer({ storage });

// Função para listar todos os produtos com filtros e ordenação
export const getProducts = (req: Request, res: Response) => {
    const { nome, fornecedorId, orderBy } = req.query;

    let query = 'SELECT * FROM Produto WHERE 1=1';
    const params: any[] = [];

    if (nome) {
        query += ' AND nome LIKE ?';
        params.push(`%${nome}%`);
    }
    if (fornecedorId) {
        query += ' AND fornecedorId = ?';
        params.push(fornecedorId);
    }
    if (orderBy) {
        query += ` ORDER BY preco ${orderBy === 'asc' ? 'ASC' : 'DESC'}`;
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ produtos: rows });
    });
};

// Função para criar um novo produto
export const createProduct = (req: Request, res: Response) => {
    const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null; // Caminho relativo para o frontend acessar

    db.run(
        'INSERT INTO Produto (nome, descricao, preco, quantidade, imagem, fornecedorId) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, descricao, preco, quantidade, imagem, fornecedorId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Produto criado com sucesso' });
        }
    );
};


// Função para atualizar um produto existente
export const updateProduct = (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
    const imagem = req.file ? req.file.path : null; // Caminho da nova imagem, se houver

    db.run(
        'UPDATE Produto SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ?, fornecedorId = ? WHERE id = ?',
        [nome, descricao, preco, quantidade, imagem, fornecedorId, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Produto não encontrado' });
            res.json({ message: 'Produto atualizado com sucesso' });
        }
    );
};

// Função para deletar um produto
export const deleteProduct = (req: Request, res: Response) => {
    const { id } = req.params;

    db.run('DELETE FROM Produto WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Produto não encontrado' });
        res.json({ message: 'Produto deletado com sucesso' });
    });
};
