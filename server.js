const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // Add this line to link the auth routes

app.get('/', (req, res) => res.send('API Tudo Orgânico rodando 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));