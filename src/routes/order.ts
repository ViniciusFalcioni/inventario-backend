import express from 'express';
import { getOrders, createOrder, updateOrder, deleteOrder, getOrderDetails } from '../controllers/orderController';

const router = express.Router();

// Rotas
router.get('/', getOrders);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/:orderId/details', getOrderDetails);

export default router;
