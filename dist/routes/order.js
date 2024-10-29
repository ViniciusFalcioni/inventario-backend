"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// Rota para listar pedidos
router.get('/', orderController_1.getOrders);
// Rota para criar um pedido
router.post('/', orderController_1.createOrder);
// Rota para atualizar um pedido específico
router.put('/:id', orderController_1.updateOrder);
// Rota para deletar um pedido específico
router.delete('/:id', orderController_1.deleteOrder);
exports.default = router;
