require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/paymentRoutes'); // Importa as rotas de pagamento

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes); // Usa as rotas de pagamento para processar pagamentos

// Rota de teste para a raiz da API
app.get('/', (req, res) => res.send('API Tudo Orgânico rodando 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));