const jwt = require('jsonwebtoken');

// 🔐 Mesmo segredo do backend
const secret = 'seuSegredoJWT123'; // Substitua aqui se você alterou no backend

// 📦 Dados do vendedor autenticado
const payload = {
  id: 1,
  email: 'sfptc06@gmail.com',
  accountType: 'vendedor'
};

// ⏱ Tempo de validade do token
const options = {
  expiresIn: '12h' // pode trocar para '1h', '24h' ou '7d'
};

// 🔄 Gerando o token
const token = jwt.sign(payload, secret, options);

// 📤 Exibindo o token
console.log('✅ Token JWT gerado:\n');
console.log(token);
