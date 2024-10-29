import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import supplierRoutes from './routes/supplier';
import customerRoutes from './routes/customer';
import orderRoutes from './routes/order';
import transactionRoutes from './routes/transaction';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota de autenticação
app.use('/auth', authRoutes);

// Rotas de produtos e outras entidades
app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);
app.use('/transactions', transactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
