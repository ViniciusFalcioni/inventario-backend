import express from 'express';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';

const router = express.Router();

// Rota para listar pedidos
router.get('/', getOrders);

// Rota para criar um pedido
router.post('/', createOrder);

// Rota para atualizar um pedido específico
router.put('/:id', updateOrder);

// Rota para deletar um pedido específico
router.delete('/:id', deleteOrder);

export default router;
