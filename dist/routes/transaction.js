"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
// Rota para listar transações
router.get('/', transactionController_1.getTransactions);
// Rota para criar uma transação
router.post('/', transactionController_1.createTransaction);
// Rota para atualizar uma transação específica
router.put('/:id', transactionController_1.updateTransaction);
// Rota para deletar uma transação específica
router.delete('/:id', transactionController_1.deleteTransaction);
exports.default = router;
