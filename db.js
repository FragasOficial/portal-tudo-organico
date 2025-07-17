const config = {
  user: 'SEU_USUARIO_SQL',
  password: 'SUA_SENHA',
  server: 'localhost',
  database: 'TudoOrganico',
  options: { encrypt: false, trustServerCertificate: true }
};

// LISTAR produtos
app.get('/api/products', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Produtos');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos');
  }
});

// CADASTRAR novo produto
app.post('/api/products', async (req, res) => {
  const { nome, preco, imagem, dono } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Produtos (Nome, Preco, Imagem, Dono)
      VALUES (${nome}, ${preco}, ${imagem}, ${dono})
    `;
    res.send('Produto cadastrado com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar produto');
  }
});

