# 🌱 Tudo Orgânico – Marketplace de Produtos Naturais

Marketplace completo em Node.js + SQL Server (SSMS) com front-end HTML, CSS, JS e integração por API REST.

---

## 🚀 Funcionalidades

### 👥 Usuários
- Cadastro e login de **clientes** e **vendedores**
- Segurança com **hash de senha** e **JWT**

### 🛍 Produtos
- Vendedores podem **cadastrar**, **listar** e **excluir** seus produtos
- Filtros por **estado**, **cidade** e **nome**

### 🧺 Carrinho & Checkout
- Front-end com carrinho local (localStorage)
- Envio de pedidos reais via API

### 📦 Pedidos
- Clientes acessam seu **histórico de compras**
- Vendedores visualizam **pedidos recebidos**

### ⭐ Avaliações
- Sistema de avaliação com **estrelas (1 a 5)** por produto

---

## 🛠️ Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| Backend | Node.js, Express, JWT, bcrypt, dotenv, MSSQL |
| Frontend | HTML5, CSS3, JavaScript |
| Banco de dados | SQL Server (SSMS) |

---

## 🧰 Instalação

### ✅ Requisitos
- Node.js (v18+)
- SQL Server (SSMS)
- Git

### 📦 Clone o projeto
```bash
git clone https://github.com/seu-usuario/tudo-organico.git
cd tudo-organico
```

### ⚙️ Instale as dependências
```bash
npm install
```

### 🔑 Configure o `.env`
Crie um arquivo `.env` com as informações do seu SQL Server:

```env
PORT=3000
DB_USER=seu_usuario_sql
DB_PASS=sua_senha_sql
DB_SERVER=localhost
DB_NAME=TudoOrganico
JWT_SECRET=sua_chave_jwt_secreta
```

---

## 🗄️ Criação do Banco

Abra o SSMS e execute o script SQL fornecido para criar as tabelas:

```sql
CREATE DATABASE TudoOrganico;
-- USE TudoOrganico;
-- CREATE TABLE Usuarios (...) ...
-- CREATE TABLE Produtos (...) ...
-- CREATE TABLE Pedidos (...) ...
-- etc.
```

---

## 🖥️ Executando a API

### Em modo produção:
```bash
npm start
```

### Em modo desenvolvimento (com recarga):
```bash
npm run dev
```

A API ficará disponível em:

```
http://localhost:3000/api
```

---

## 📚 Documentação das Rotas

- `POST /api/auth/register` – Criação de conta
- `POST /api/auth/login` – Login e retorno de token
- `GET /api/products` – Lista de produtos
- `POST /api/products` – Cadastro de produto (vendedor)
- `DELETE /api/products/:id` – Exclusão de produto
- `POST /api/orders` – Finalização de pedido
- `GET /api/orders/me` – Histórico de compras (cliente)
- `GET /api/orders/seller` – Pedidos recebidos (vendedor)
- `POST /api/orders/avaliar` – Avaliação de produto

---

## 💚 Front-end

Todos os arquivos HTML utilizam `localStorage` + `fetch()` para consumir as rotas da API real.

- `index.html` – Página principal com filtros
- `checkout.html` – Carrinho e pagamento
- `historico.html` – Histórico de compras
- `painel-vendedor.html` – Gerenciar produtos
- `pedidos.html` – Pedidos recebidos
- `login.html` / `register.html` – Autenticação

---

## 🔒 Segurança

- Tokens JWT protegendo rotas privadas
- Criptografia de senhas com bcrypt
- CORS habilitado para front local

---

## 📄 Licença

MIT © 2025 - Tudo Orgânico