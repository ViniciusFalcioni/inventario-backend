"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
// Rota para listar clientes
router.get('/', customerController_1.getCustomers);
// Rota para criar um cliente
router.post('/', customerController_1.createCustomer);
// Rota para atualizar um cliente específico
router.put('/:id', customerController_1.updateCustomer);
// Rota para deletar um cliente específico
router.delete('/:id', customerController_1.deleteCustomer);
exports.default = router;
