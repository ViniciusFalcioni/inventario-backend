// src/index.ts
import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import supplierRoutes from './routes/supplier';
import orderRoutes from './routes/order'; // Certifique-se de que o caminho está correto
import transactionRoutes from './routes/transaction';
import clientRoutes from './routes/client';
import dashboardRoutes from './routes/dashboard'

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de autenticação
app.use('/auth', authRoutes);

// Rotas de produtos e outras entidades
app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/clients', clientRoutes);
app.use('/orders', orderRoutes); // Certifique-se de que "orderRoutes" esteja importado corretamente
app.use('/transactions', transactionRoutes);
app.use('/dashboard', dashboardRoutes)

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
