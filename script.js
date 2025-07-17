// Lista de produtos orgânicos fixos
function getAvailableProducts() {
  const base = [
    {
      id: 1,
      name: "Banana Orgânica",
      price: 5,
      image: "https://www.maisquitanda.com.br/image/cache/2-frutas/Banana-Caturra-800x800.jpg",
      owner: "vendedor1"
    },
    {
      id: 2,
      name: "Alface Crespa",
      price: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJUl_MbdePF9x7l9UEEmtTmRYKEJ1iOj7otA&s",
      owner: "vendedor1"
    },
    {
      id: 3,
      name: "Tomate Cereja",
      price: 6,
      image: "https://prezunic.vtexassets.com/arquivos/ids/186979/65678fcf1ef3739680762de3.jpg",
      owner: "vendedor2"
    },
    {
      id: 4,
      name: "Ovos Caipira (dúzia)",
      price: 12,
      image: "https://organicossaocarlos.com.br/wp-content/uploads/2019/11/ovos-caipira.png",
      owner: "vendedor1"
    },
    {
      id: 5,
      name: "Mel de Abelha (500ml)",
      price: 20,
      image: "https://down-br.img.susercontent.com/file/31f6d36358bc57d3c1da9156fe441074",
      owner: "vendedor2"
    }
  ];

  const saved = JSON.parse(localStorage.getItem('products')) || [];
  return base.concat(saved);
}

const productList = getAvailableProducts();


// Carrinho de compras
const cart = {};

// Renderiza os produtos na tela
// Renderiza os produtos na tela (com filtro opcional)
function renderProducts(filteredList = productList) {
  const container = document.getElementById('products');
  if (!container) return;
  container.innerHTML = '';

  if (filteredList.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado.</p>';
    return;
  }

  filteredList.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
      </div>
    `;
  });
}

// Filtra os produtos pelo termo digitado
function filterProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const container = document.getElementById('products');
  container.innerHTML = '';

  const filtered = productList.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Nenhum produto encontrado.</p>`;
    return;
  }

  filtered.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
      </div>
    `;
  });
}


function renderFilteredProducts(list) {
  const container = document.getElementById('products');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Nenhum produto encontrado.</p>`;
    return;
  }

  list.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
      </div>
    `;
  });
}


// Adiciona item ao carrinho
function addToCart(id) {
  const input = document.getElementById(`qty-${id}`);
  let quantity = parseInt(input.value);
  if (isNaN(quantity) || quantity < 1) quantity = 1;
  if (quantity > 100) quantity = 100;

  cart[id] = (cart[id] || 0) + quantity;
  updateCart();
  input.value = '';
}

// Atualiza o conteúdo do carrinho
function updateCart() {
  const cartContainer = document.getElementById('cart');
  const totalItemsEl = document.getElementById('totalItems');
  const totalPriceEl = document.getElementById('totalPrice');

  if (!cartContainer || !totalItemsEl || !totalPriceEl) return;

  cartContainer.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  for (const id in cart) {
    const product = productList.find(p => p.id === parseInt(id));
    const quantity = cart[id];
    const subtotal = product.price * quantity;
    totalItems += quantity;
    totalPrice += subtotal;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <span>${product.name} x${quantity} - R$ ${subtotal.toFixed(2)}</span>
      </div>
    `;
  }

  totalItemsEl.innerText = totalItems;
  totalPriceEl.innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
}

// Confirma a compra (simulação)
function confirmPurchase() {
  const paymentMethod = document.getElementById('payment').value;
  const message = document.getElementById('confirmationMessage');

  if (Object.keys(cart).length === 0) {
    message.innerHTML = `<span style="color:red">Seu carrinho está vazio.</span>`;
    return;
  }

  let total = 0;
  for (const id in cart) {
    const item = productList.find(p => p.id == id);
    total += item.price * cart[id];
  }

  message.innerHTML = `
    <div style="margin-top:15px; padding:10px; background:#dfffdc; border-radius:6px;">
      <strong>Pagamento simulado com sucesso!</strong><br>
      Total: R$ ${total.toFixed(2)}<br>
      Pagamento via: ${paymentMethod}<br>
      <em>Obrigado por comprar no Tudo Orgânico!</em>
    </div>
  `;

  for (const id in cart) delete cart[id];
  updateCart();
}

// Chamada ao carregar a página
window.onload = () => {
  renderProducts();
  updateCart();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterProducts();
    });
  }
};

// Função para registrar o usuário
function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const userType = document.getElementById('userType').value;

  if (!name || !email || !password || !userType) {
    alert("Preencha todos os campos.");
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];

  const userExists = users.some(user => user.email === email);
  if (userExists) {
    alert("Este email já está cadastrado.");
    return;
  }

  const newUser = { name, email, password, userType };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert("Cadastro realizado com sucesso!");
  window.location.href = 'login.html';
}

// Função para login do usuário
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    alert("Email ou senha inválidos.");
    return;
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));

  alert(`Bem-vindo, ${user.name}!`);

  if (user.userType === 'vendedor') {
    window.location.href = 'painel-vendedor.html';
  } else {
    window.location.href = 'index.html';
  }
}

// Função para logout (caso precise usar)
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

// Função para exibir nome do usuário logado (em qualquer página)
function showLoggedUserName() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    const display = document.getElementById('user-name-display');
    if (display) {
      display.textContent = `Olá, ${user.name}`;
    }
  }
}

// Lista global de produtos no localStorage
function getAllProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}

function saveAllProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

// Painel do Vendedor: carregar produtos do usuário logado
function loadVendorPanel() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.userType !== 'vendedor') {
    alert("Acesso negado.");
    window.location.href = "login.html";
    return;
  }

  showLoggedUserName();

  const container = document.getElementById('adminProductList');
  container.innerHTML = "";

  const products = getAllProducts().filter(p => p.owner === user.email);

  if (products.length === 0) {
    container.innerHTML = "<p>Você ainda não cadastrou nenhum produto.</p>";
    return;
  }

  products.forEach(product => {
    container.innerHTML += `
      <div class="admin-product">
        <strong>${product.name}</strong>
        <span>R$ ${product.price.toFixed(2)}</span>
        <img src="${product.image}" style="width:100%; border-radius:5px;">
      </div>
    `;
  });
}

// Adicionar novo produto no painel do vendedor
function addNewProduct(event) {
  event.preventDefault();

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.userType !== 'vendedor') return;

  const name = document.getElementById('newProdName').value.trim();
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const image = document.getElementById('newProdImage').value.trim();

  const allProducts = getAllProducts();
  const newProduct = {
    id: Date.now(),
    name,
    price,
    image,
    owner: user.email
  };

  allProducts.push(newProduct);
  saveAllProducts(allProducts);

  alert("Produto adicionado com sucesso!");
  document.getElementById('addProductForm').reset();
  loadVendorPanel();
}

// Logout geral
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

function initPage() {
  renderProducts();
  updateCart();
  showLoggedUserName();

  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const logoutBtn = document.getElementById('logoutBtn');
  const adminPanelBtn = document.getElementById('adminPanelBtn');

  if (user) {
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (user.userType === 'vendedor' && adminPanelBtn) {
      adminPanelBtn.style.display = 'inline-block';
    }
  }
}

async function registerUser(event) {
  event.preventDefault();

  const nome = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const senha = document.getElementById('regPassword').value;
  const tipo = document.getElementById('userType').value;

  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, tipo })
  });

  const msg = await response.text();
  alert(msg);

  if (response.ok) window.location.href = 'login.html';
}

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginPassword').value;

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  if (response.ok) {
    const user = await response.json();
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    // Redirecionamento
    if (user.Tipo === 'vendedor') {
      window.location.href = 'painel-vendedor.html';
    } else {
      window.location.href = 'index.html';
    }
  } else {
    alert(await response.text());
  }
}


