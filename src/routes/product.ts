// src/routes/product.ts
import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, upload } from '../controllers/productController';

const router = express.Router();

// Rota para listar produtos com filtros e ordenação
router.get('/', getProducts);

// Rota para criar um novo produto com upload de imagem
router.post('/', upload.single('imagem'), createProduct);

// Rota para atualizar um produto existente com upload de imagem
router.put('/:id', upload.single('imagem'), updateProduct);

// Rota para deletar um produto
router.delete('/:id', deleteProduct);

export default router;
