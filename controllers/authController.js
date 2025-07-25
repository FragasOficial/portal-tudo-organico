// // 📁 controllers/authController.js
// const db = require('../models/db');
// const bcrypt = require('bcryptjs');
// const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

// exports.register = async (req, res) => {
//   const { firstName, lastName, email, password, phone, address, city, state, accountType, freeDelivery } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const pool = await db.getPool();
//     const request = pool.request();

//     request.input('firstName', db.sql.NVarChar(100), firstName);
//     request.input('lastName', db.sql.NVarChar(100), lastName);
//     request.input('email', db.sql.NVarChar(255), email);
//     request.input('passwordHash', db.sql.NVarChar(255), hashedPassword);
//     request.input('phone', db.sql.NVarChar(20), phone);
//     request.input('address', db.sql.NVarChar(255), address);
//     request.input('city', db.sql.NVarChar(100), city);
//     request.input('state', db.sql.NVarChar(2), state);
//     request.input('accountType', db.sql.NVarChar(20), accountType);
//     request.input('freeDelivery', db.sql.Bit, freeDelivery);

//     await request.query(`
//       INSERT INTO dbo.Users (firstName, lastName, email, passwordHash, phone, address, city, state, accountType, freeDelivery)
//       VALUES (@firstName, @lastName, @email, @passwordHash, @phone, @address, @city, @state, @accountType, @freeDelivery)
//     `);

//     res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
//   } catch (error) {
//     console.error('Erro ao cadastrar usuário:', error);
//     res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const pool = await db.getPool();
//     const request = pool.request();
//     request.input('email', db.sql.NVarChar(255), email);

//     const result = await request.query(`
//       SELECT id, firstName, lastName, email, passwordHash, phone, address, city, state, accountType, freeDelivery
//       FROM dbo.Users WHERE email = @email
//     `);

//     const user = result.recordset[0];
//     if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) return res.status(401).json({ message: 'Senha inválida.' });

//     const payload = {
//       id: user.id,
//       email: user.email,
//       accountType: user.accountType
//     };

//     const accessToken = generateAccessToken(payload);
//     const refreshToken = generateRefreshToken(payload);

//     const { passwordHash, ...userWithoutHash } = user;
//     res.status(200).json({
//       message: 'Login realizado com sucesso!',
//       token: accessToken,
//       refreshToken: refreshToken,
//       user: userWithoutHash
//     });
//   } catch (error) {
//     console.error('Erro no login:', error);
//     res.status(500).json({ message: 'Erro no login.', error: error.message });
//   }
// };
// 📁 controllers/authController.js
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone, address, city, state, accountType, freeDelivery } = req.body;

  try {
    console.log("📥 [REGISTER] Dados recebidos:", req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await db.getPool();
    const request = pool.request();

    request.input('firstName', db.sql.NVarChar(100), firstName);
    request.input('lastName', db.sql.NVarChar(100), lastName);
    request.input('email', db.sql.NVarChar(255), email);
    request.input('passwordHash', db.sql.NVarChar(255), hashedPassword);
    request.input('phone', db.sql.NVarChar(20), phone);
    request.input('address', db.sql.NVarChar(255), address);
    request.input('city', db.sql.NVarChar(100), city);
    request.input('state', db.sql.NVarChar(2), state);
    request.input('accountType', db.sql.NVarChar(20), accountType);
    request.input('freeDelivery', db.sql.Bit, freeDelivery);

    await request.query(`
      INSERT INTO dbo.Users (firstName, lastName, email, passwordHash, phone, address, city, state, accountType, freeDelivery)
      VALUES (@firstName, @lastName, @email, @passwordHash, @phone, @address, @city, @state, @accountType, @freeDelivery)
    `);

    console.log("✅ [REGISTER] Usuário cadastrado com sucesso:", email);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('❌ [REGISTER] Erro ao cadastrar usuário:', error);
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 [LOGIN] Dados recebidos:", { email, password });

  try {
    const pool = await db.getPool();
    const request = pool.request();
    request.input('email', db.sql.NVarChar(255), email);

    const result = await request.query(`
      SELECT id, firstName, lastName, email, passwordHash, phone, address, city, state, accountType, freeDelivery
      FROM dbo.Users WHERE email = @email
    `);

    console.log("🔍 [LOGIN] Resultado da consulta:", result.recordset);

    const user = result.recordset[0];
    if (!user) {
      console.warn("⚠️ [LOGIN] Usuário não encontrado:", email);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    console.log("🔑 [LOGIN] Comparando senha com hash armazenado...");
    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log("🔑 [LOGIN] Senha válida?", valid);

    if (!valid) return res.status(401).json({ message: 'Senha inválida.' });

    const payload = { id: user.id, email: user.email, accountType: user.accountType };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log("🎫 [LOGIN] Tokens gerados:", { accessToken, refreshToken });

    const { passwordHash, ...userWithoutHash } = user;
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token: accessToken,
      refreshToken: refreshToken,
      user: userWithoutHash
    });
  } catch (error) {
    console.error('❌ [LOGIN] Erro no login:', error);
    res.status(500).json({ message: 'Erro no login.', error: error.message });
  }
};
