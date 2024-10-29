"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierController_1 = require("../controllers/supplierController");
const router = express_1.default.Router();
// Rota para listar fornecedores
router.get('/', supplierController_1.getSuppliers);
// Rota para criar um fornecedor
router.post('/', supplierController_1.createSupplier);
// Rota para atualizar um fornecedor específico
router.put('/:id', supplierController_1.updateSupplier);
// Rota para deletar um fornecedor específico
router.delete('/:id', supplierController_1.deleteSupplier);
exports.default = router;
