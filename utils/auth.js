// utils/auth.js
const jwt = require('jsonwebtoken');

// Carrega o segredo do JWT das variáveis de ambiente
// Certifique-se de que process.env.JWT_SECRET está definido em um arquivo .env
const jwtSecret = process.env.JWT_SECRET || 'seuSegredoMuitoSecretoAqui'; // Use uma chave forte em produção!

const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '15m' }); // Token de acesso expira em 15 minutos
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' }); // Refresh token expira em 7 dias
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};