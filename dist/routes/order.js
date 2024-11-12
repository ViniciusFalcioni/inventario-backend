"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// Rotas
router.get('/', orderController_1.getOrders);
router.post('/', orderController_1.createOrder);
router.put('/:id', orderController_1.updateOrder);
router.delete('/:id', orderController_1.deleteOrder);
router.get('/:orderId/details', orderController_1.getOrderDetails);
exports.default = router;
