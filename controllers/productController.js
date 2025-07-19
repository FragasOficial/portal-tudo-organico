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

  const { name, price, image, city, state } = req.body;
  const user = req.user;

  if (!user || user.accountType !== 'vendedor') {
    return res.status(403).json({ message: 'Apenas vendedores podem cadastrar produtos.' });
  }

  try {
    const pool = await db.getPool();

    const request = pool.request();
    request.input('Nome', sql.VarChar, name);
    request.input('Preco', sql.Decimal(10, 2), price);
    request.input('Imagem', sql.VarChar, image);
    request.input('Cidade', sql.VarChar, city);
    request.input('Estado', sql.VarChar, state);
    request.input('VendedorId', sql.Int, user.id);

    await request.query(`
      INSERT INTO Produtos (Nome, Preco, Imagem, Cidade, Estado, VendedorId)
      VALUES (@Nome, @Preco, @Imagem, @Cidade, @Estado, @VendedorId)
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
