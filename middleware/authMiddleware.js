const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

require('dotenv').config(); // Adicionado para carregar variáveis de ambiente
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido. Acesso negado.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Formato de token inválido.' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // Usando variável de ambiente
    req.user = user; // Anexa o payload do token ao objeto da requisição
    next(); // Continua para a próxima função middleware/rota
  } catch (err) {
    console.error("Erro de verificação de token:", err.message);
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};
