"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/clientRoutes.ts
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const router = express_1.default.Router();
// Rota para obter todos os clientes, com filtros opcionais
router.get('/', clientController_1.getClients);
// Rota para adicionar um novo cliente
router.post('/', clientController_1.createClient);
// Rota para atualizar um cliente existente
router.put('/:id', clientController_1.updateClient);
// Rota para deletar um cliente
router.delete('/:id', clientController_1.deleteClient);
// Rota para obter o histórico de pedidos de um cliente específico
router.get('/:clientId/orders', clientController_1.getClientOrders);
exports.default = router;
