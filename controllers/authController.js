// controllers/authController.js
const db = require('../models/db'); // Importa o módulo db.js completo
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone, address, city, state, accountType, freeDelivery } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await db.getPool(); // Certifique-se de que getPool está sendo usado
    const request = pool.request();

    request.input('firstName', db.sql.NVarChar(100), firstName);
    request.input('lastName', db.sql.NVarChar(100), lastName);
    request.input('email', db.sql.NVarChar(255), email);
    request.input('passwordHash', db.sql.NVarChar(255), hashedPassword); // Campo do banco de dados
    request.input('phone', db.sql.NVarChar(20), phone);
    request.input('address', db.sql.NVarChar(255), address);
    request.input('city', db.sql.NVarChar(100), city);
    request.input('state', db.sql.NVarChar(2), state);
    request.input('accountType', db.sql.NVarChar(20), accountType);
    request.input('freeDelivery', db.sql.Bit, freeDelivery); // Adicionado freeDelivery

    await request.query(`
      INSERT INTO Users (firstName, lastName, email, passwordHash, phone, address, city, state, accountType, freeDelivery)
      VALUES (@firstName, @lastName, @email, @passwordHash, @phone, @address, @city, @state, @accountType, @freeDelivery)
    `);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error("Erro no registro:", error);
    // Retorne um erro 400 se for um problema de dados (ex: email duplicado)
    if (error.message.includes('UNIQUE KEY constraint')) {
        return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await db.getPool(); // Certifique-se de que getPool está sendo usado
    const request = pool.request();
    request.input('email', db.sql.NVarChar(255), email);

    const result = await request.query(`
      SELECT id, firstName, lastName, email, passwordHash, phone, address, accountType, freeDelivery FROM Users WHERE email = @email
    `);

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Comparar com passwordHash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Senha inválida.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Token expira em 1 hora
    );

    // Retorna o usuário sem o passwordHash
    const { passwordHash, ...userWithoutHash } = user;
    res.status(200).json({ message: 'Login realizado com sucesso!', token, user: userWithoutHash });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro ao tentar fazer login.', error: error.message });
  }
};