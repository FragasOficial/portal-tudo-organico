require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes'); // usa productRoutes.js
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

//Adicionando uma nova linha de códigos
// server.js
// ...
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Adicione esta rota para /api
app.get('/api', (req, res) => {
  res.send('Endpoint principal da API Tudo Orgânico. Acesse /api/products, /api/auth, etc.');
});

app.get('/', (req, res) => res.send('API Tudo Orgânico rodando 🚀'));

// ...

