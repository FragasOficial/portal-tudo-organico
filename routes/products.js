const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../db');

router.get('/', async (req, res) => {
  await poolConnect;
  try {
    const result = await pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos');
  }
});

module.exports = router;
