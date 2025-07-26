// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'C@twaba2024JWT123'; // Garanta que este SECRET é o mesmo do seu .env

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Erro de autenticação: Token não fornecido.');
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // ✅ Este é o log que você está vendo: "jwt expired"
      console.error('Erro de verificação do token:', err.message);
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
};

exports.requireVendedor = (req, res, next) => {
  if (!req.user || req.user.accountType !== 'vendedor') {
    console.error('Erro de autorização: Acesso restrito aos vendedores.');
    return res.status(403).json({ message: 'Acesso restrito aos vendedores.' });
  }
  next();
};
