// const jwt = require('jsonwebtoken');

// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Token não fornecido.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET deve estar no .env
//     req.user = decoded; // O controlador pode agora acessar req.user.id, req.user.accountType, etc.
//     next();
//   } catch (err) {
//     console.error('Erro ao verificar token:', err);
//     return res.status(403).json({ message: 'Token inválido ou expirado.' });
//   }
// };

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(403).json({ message: 'Token inválido.' });
  }
};
