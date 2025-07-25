// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'C@twaba2024JWT123';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

exports.requireVendedor = (req, res, next) => {
  if (!req.user || req.user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Acesso restrito aos vendedores.' });
  }
  next();
};
