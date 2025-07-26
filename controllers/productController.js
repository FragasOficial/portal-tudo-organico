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

// ✅ NOVA FUNÇÃO: Buscar um produto por ID
exports.getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const pool = await db.getPool();
    const result = await pool.request()
      .input('productId', sql.Int, productId)
      .query('SELECT * FROM Produtos WHERE Id = @productId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar produto.' });
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

// Deletar um produto
exports.deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const user = req.user;

  if (!user || user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Apenas vendedores podem deletar produtos.' });
  }

  try {
    const pool = await db.getPool();

    // ✅ Verifica se o produto pertence ao vendedor antes de deletar
    const checkProduct = await pool.request()
      .input('productId', sql.Int, productId)
      .query('SELECT VendedorId FROM Produtos WHERE Id = @productId');
    
    if (checkProduct.recordset.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    if (checkProduct.recordset[0].VendedorId !== user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este produto.' });
    }

    await pool.request()
      .input('productId', sql.Int, productId)
      .query('DELETE FROM Produtos WHERE Id = @productId');

    res.status(200).json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro ao deletar produto.' });
  }
};

// ✅ NOVA FUNÇÃO: Atualizar um produto
exports.updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, image, city, state, nutritionalInfo } = req.body;
  const user = req.user;

  if (!user || user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Apenas vendedores podem atualizar produtos.' });
  }

  if (!productId) {
    return res.status(400).json({ message: 'ID do produto é obrigatório.' });
  }

  try {
    const pool = await db.getPool();

    // 1. Verificar se o produto existe e pertence ao vendedor logado
    const productCheckResult = await pool.request()
      .input('productId', sql.Int, productId)
      .query('SELECT VendedorId FROM Produtos WHERE Id = @productId');

    if (productCheckResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    if (productCheckResult.recordset[0].VendedorId !== user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este produto.' });
    }

    // 2. Realizar a atualização
    const request = pool.request();
    request.input('productId', sql.Int, productId);
    request.input('name', sql.NVarChar(255), name);
    request.input('price', sql.Decimal(10, 2), price);
    request.input('image', sql.NVarChar(255), image);
    request.input('city', sql.NVarChar(100), city);
    request.input('state', sql.NVarChar(2), state);
    request.input('nutritionalInfo', sql.NVarChar(sql.MAX), nutritionalInfo || ''); // Pode ser nulo/vazio

    const updateResult = await request.query(`
      UPDATE Produtos
      SET name = @name, 
          price = @price, 
          image = @image, 
          city = @city, 
          state = @state,
          nutritionalInfo = @nutritionalInfo
      WHERE Id = @productId
    `);

    if (updateResult.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Produto não encontrado ou nenhum dado para atualizar.' });
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso.' });

  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto.' });
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