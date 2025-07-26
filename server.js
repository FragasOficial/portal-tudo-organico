// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/users');
// const orderRoutes = require('./routes/orders');
// const authRoutes = require('./routes/auth');
// const paymentRoutes = require('./routes/paymentRoutes'); // Importa as rotas de pagamento

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// // Rotas da API
// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/payments', paymentRoutes); // Usa as rotas de pagamento para processar pagamentos

// // Rota de teste para a raiz da API
// app.get('/', (req, res) => res.send('API Tudo Orgânico rodando 🚀'));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/paymentRoutes'); // Importa as rotas de pagamento
const db = require('./models/db'); // ✅ Importa o módulo db para conexão com o banco de dados

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

// ✅ Conecta ao banco de dados antes de iniciar o servidor
db.getPool()
  .then(() => {
    console.log('✅ Banco de dados conectado (TudoOrganico)');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Falha ao conectar ao banco de dados e iniciar o servidor:', err);
    process.exit(1); // Encerra o processo se a conexão com o DB falhar
  });
