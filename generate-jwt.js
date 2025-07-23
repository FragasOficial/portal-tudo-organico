const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// 🔐 Mesmo segredo do backend
const secret = 'C@twabaJWT123'; // Deve ser igual ao usado no backend

// 📦 Dados do vendedor autenticado
const payload = {
  id: 1,
  email: 'sfptc06@gmail.com',
  accountType: 'vendedor'
};

// ⏱ Tempo de validade do token
const options = {
  expiresIn: '12h' // válido por 12 horas
};

// 🔄 Gerando o token
const token = jwt.sign(payload, secret, options);

// 📤 Exibindo o token no terminal
console.log('✅ Token JWT gerado:\n');
console.log(token);

// 📁 Gera um script para injetar no navegador (salvo como authToken)
const localStorageScript = `
  localStorage.setItem("authToken", token);
  console.log("🔐 authToken salvo no localStorage com sucesso.");
`;

const outputPath = path.join(__dirname, 'inject-token.js');
fs.writeFileSync(outputPath, localStorageScript);
console.log('\n📂 Script salvo em: inject-token.js');
console.log('👉 Abra o navegador na página desejada e cole este conteúdo no console do DevTools.');
