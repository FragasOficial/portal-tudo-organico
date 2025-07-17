const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, config } = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Cadastro
app.post('/api/register', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Usuarios (Nome, Email, Senha, Tipo)
      VALUES (${nome}, ${email}, ${senha}, ${tipo})`;

    res.status(200).send('Usuário cadastrado com sucesso.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM Usuarios WHERE Email = ${email} AND Senha = ${senha}`;

    if (result.recordset.length === 0) {
      res.status(401).send('Credenciais inválidas.');
    } else {
      res.status(200).json(result.recordset[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao fazer login.');
  }
});

// Produtos
app.get('/api/produtos', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Produtos`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos.');
  }
});

// Novo produto
app.post('/api/produtos', async (req, res) => {
  const { nome, preco, imagem, donoEmail } = req.body;

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO Produtos (Nome, Preco, Imagem, DonoEmail)
      VALUES (${nome}, ${preco}, ${imagem}, ${donoEmail})`;

    res.status(200).send('Produto adicionado.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar produto.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
