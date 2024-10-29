"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/product.ts
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Rota para listar produtos com filtros e ordenação
router.get('/', productController_1.getProducts);
// Rota para criar um novo produto com upload de imagem
router.post('/', productController_1.upload.single('imagem'), productController_1.createProduct);
// Rota para atualizar um produto existente com upload de imagem
router.put('/:id', productController_1.upload.single('imagem'), productController_1.updateProduct);
// Rota para deletar um produto
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
