"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const product_1 = __importDefault(require("./routes/product"));
const supplier_1 = __importDefault(require("./routes/supplier"));
const order_1 = __importDefault(require("./routes/order")); // Certifique-se de que o caminho está correto
const transaction_1 = __importDefault(require("./routes/transaction"));
const client_1 = __importDefault(require("./routes/client"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Rota de autenticação
app.use('/auth', auth_1.default);
// Rotas de produtos e outras entidades
app.use('/products', product_1.default);
app.use('/suppliers', supplier_1.default);
app.use('/clients', client_1.default);
app.use('/orders', order_1.default); // Certifique-se de que "orderRoutes" esteja importado corretamente
app.use('/transactions', transaction_1.default);
app.use('/dashboard', dashboard_1.default);
// Servir arquivos estáticos
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
