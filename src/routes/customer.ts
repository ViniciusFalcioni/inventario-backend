import express from 'express';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';

const router = express.Router();

// Rota para listar clientes
router.get('/', getCustomers);

// Rota para criar um cliente
router.post('/', createCustomer);

// Rota para atualizar um cliente específico
router.put('/:id', updateCustomer);

// Rota para deletar um cliente específico
router.delete('/:id', deleteCustomer);

export default router;
