import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController';

const router = express.Router();

// Rota para listar transações
router.get('/', getTransactions);

// Rota para criar uma transação
router.post('/', createTransaction);

// Rota para atualizar uma transação específica
router.put('/:id', updateTransaction);

// Rota para deletar uma transação específica
router.delete('/:id', deleteTransaction);

export default router;
