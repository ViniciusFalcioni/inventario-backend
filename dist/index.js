"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const customer_1 = __importDefault(require("./routes/customer"));
const order_1 = __importDefault(require("./routes/order"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Rota de autenticação
app.use('/auth', auth_1.default);
// Rotas de produtos e outras entidades
app.use('/products', product_1.default);
app.use('/suppliers', supplier_1.default);
app.use('/customers', customer_1.default);
app.use('/orders', order_1.default);
app.use('/transactions', transaction_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
