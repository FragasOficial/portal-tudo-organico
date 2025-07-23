// productController.js

const sql = require('mssql');
const db = require('../models/db');

// Buscar todos os produtos
exports.getProducts = async (req, res) => {
  try {
    const pool = await db.getPool();
    const result = await pool.request().query('SELECT * FROM Produtos');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
};

// Criar um novo produto
exports.createProduct = async (req, res) => {
  console.log('➡️ Cadastro de produto iniciado:', req.body);

  const { name, price, image, city, state, nutritionalInfo } = req.body;
  const user = req.user;

  if (!user || user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Apenas vendedores podem cadastrar produtos.' });
  }

  try {
    const pool = await db.getPool();

    const request = pool.request();
    request.input('name', sql.NVarChar(255), name);
    request.input('price', sql.Decimal(10, 2), price);
    request.input('image', sql.NVarChar(255), image);
    request.input('city', sql.NVarChar(100), city);
    request.input('state', sql.NVarChar(2), state);
    request.input('vendedorId', sql.Int, user.id);
    request.input('nutritionalInfo', sql.NVarChar(sql.MAX), nutritionalInfo || '');
    
    await request.query(`
      INSERT INTO Produtos (name, price, image, city, state, vendedorId, nutritionalInfo)
      VALUES (@name, @price, @image, @city, @state, @vendedorId, @nutritionalInfo)
    `);

    res.status(201).json({ message: 'Produto cadastrado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao cadastrar produto:', error);
    res.status(500).json({ message: 'Erro ao cadastrar produto.' });
  }
};

// Deletar um produto (caso queira)
exports.deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const user = req.user;

  if (!user || user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Apenas vendedores podem deletar produtos.' });
  }

  try {
    const pool = await db.getPool();

    await pool.request()
      .input('productId', sql.Int, productId)
      .input('vendedorId', sql.Int, user.id)
      .query('DELETE FROM Produtos WHERE Id = @productId AND VendedorId = @vendedorId');

    res.status(200).json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro ao deletar produto.' });
  }
};

// Buscar produtos por filtros (nome, cidade, estado)
exports.searchProducts = async (req, res) => {
  try {
    const { name, city, state } = req.query;
    let query = 'SELECT * FROM Produtos WHERE 1=1'; // Start with a true condition

    const request = (await db.getPool()).request();

    if (name) {
      query += ' AND name LIKE @name';
      request.input('name', sql.NVarChar, `%${name}%`);
    }
    if (city) {
      query += ' AND city LIKE @city';
      request.input('city', sql.NVarChar, `%${city}%`);
    }
    if (state) {
      query += ' AND state LIKE @state';
      request.input('state', sql.NVarChar, `%${state}%`);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar produtos por filtro:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos por filtro.' });
  }
};