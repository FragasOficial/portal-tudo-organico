// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../models/db');

// Rota protegida: obter dados do perfil do usuário logado
router.get('/me', auth.verifyToken, async (req, res) => {
  try {
    const pool = await db.getPool();
    const request = pool.request();
    request.input('userId', db.sql.Int, req.user.id);

    const result = await request.query(`
      SELECT id, firstName, lastName, email, phone, address, city, state, accountType, freeDelivery
      FROM Users WHERE id = @userId
    `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil.', error: error.message });
  }
});

// Rota protegida: deletar conta do usuário logado
router.delete('/delete', auth.verifyToken, async (req, res) => {
  try {
    const pool = await db.getPool();
    const request = pool.request();
    request.input('userId', db.sql.Int, req.user.id);

    const result = await request.query(`
      DELETE FROM Users WHERE id = @userId
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado ou já deletado.' });
    }

    res.json({ message: 'Conta deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ message: 'Erro ao deletar conta.', error: error.message });
  }
});

module.exports = router;
