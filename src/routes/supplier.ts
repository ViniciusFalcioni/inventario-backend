import express from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController';

const router = express.Router();

// Rota para listar fornecedores
router.get('/', getSuppliers);

// Rota para criar um fornecedor
router.post('/', createSupplier);

// Rota para atualizar um fornecedor específico
router.put('/:id', updateSupplier);

// Rota para deletar um fornecedor específico
router.delete('/:id', deleteSupplier);

export default router;
