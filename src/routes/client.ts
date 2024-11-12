// src/routes/clientRoutes.ts
import express from 'express';
import {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getClientOrders,
} from '../controllers/clientController';

const router = express.Router();

// Rota para obter todos os clientes, com filtros opcionais
router.get('/', getClients);

// Rota para adicionar um novo cliente
router.post('/', createClient);

// Rota para atualizar um cliente existente
router.put('/:id', updateClient);

// Rota para deletar um cliente
router.delete('/:id', deleteClient);

// Rota para obter o histórico de pedidos de um cliente específico
router.get('/:clientId/orders', getClientOrders);

export default router;
