const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'sua_chave_secreta_super_segura';
const USERS_FILE = './users.json';
const PRODUCTS_FILE = './products.json';

// Leitura/Gravação arquivos JSON simples (simples persistência)
function readData(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  return JSON.parse(fs.readFileSync(file));
}
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Middleware para verificar token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token faltando' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Cadastro
app.post('/register', async (req, res) => {
  const { name, email, password, type } = req.body;
  if (!name || !email || !password || !type)
    return res.status(400).json({ error: 'Dados incompletos' });

  const users = readData(USERS_FILE);
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email já cadastrado' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword, type };
  users.push(newUser);
  writeData(USERS_FILE, users);
  res.json({ message: 'Cadastro realizado com sucesso' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, type: user.type }, SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, type: user.type } });
});

// Obter todos os produtos públicos
app.get('/products', (req, res) => {
  const products = readData(PRODUCTS_FILE);
  res.json(products);
});

// Criar produto (somente vendedor autenticado)
app.post('/products', authenticateToken, (req, res) => {
  if (req.user.type !== 'vendedor') return res.status(403).json({ error: 'Acesso negado' });

  const { name, price, image } = req.body;
  if (!name || price == null || !image)
    return res.status(400).json({ error: 'Dados incompletos' });

  const products = readData(PRODUCTS_FILE);
  const newProduct = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    image,
    ownerUserId: req.user.id
  };
  products.push(newProduct);
  writeData(PRODUCTS_FILE, products);
  res.json(newProduct);
});

// Atualizar produto (só dono do produto)
app.put('/products/:id', authenticateToken, (req, res) => {
  const products = readData(PRODUCTS_FILE);
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  if (product.ownerUserId !== req.user.id) return res.status(403).json({ error: 'Não autorizado' });

  const { name, price, image } = req.body;
  if (name) product.name = name;
  if (price != null) product.price = parseFloat(price);
  if (image) product.image = image;

  writeData(PRODUCTS_FILE, products);
  res.json(product);
});

// Deletar produto (só dono do produto)
app.delete('/products/:id', authenticateToken, (req, res) => {
  let products = readData(PRODUCTS_FILE);
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  if (product.ownerUserId !== req.user.id) return res.status(403).json({ error: 'Não autorizado' });

  products = products.filter(p => p.id !== id);
  writeData(PRODUCTS_FILE, products);
  res.json({ message: 'Produto excluído com sucesso' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`));
