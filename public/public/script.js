// script.js
let productList = [
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
  },
  {
    id: 6,
    name: "Manteiga de Leite",
    price: 18,
    image: "https://images.tcdn.com.br/img/img_prod/854009/manteiga_de_garrafa_1_litro_amarelinha_de_minas_2730_1_e03b0b956ca8250038658aa2b4e48374.jpg",
    owner: "vendedor2"
  }
];

const cart = {};
const timers = {};
let purchaseHistory = [];
let reviews = {};

function updateCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  for (const id in cart) {
    const item = productList.find(p => p.id == id);
    const quantity = cart[id];
    const subtotal = item.price * quantity;
    totalItems += quantity;
    totalPrice += subtotal;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${quantity} - R$ ${subtotal.toFixed(2)}</span>
      </div>
    `;
  }

  document.getElementById('totalItems').innerText = totalItems;
  document.getElementById('totalPrice').innerHTML = `<strong>Total: R$ ${totalPrice.toFixed(2)}</strong>`;
}

function startTimer(id) {
  const timerSpan = document.getElementById(`timer-${id}`);
  let seconds = 300;

  if (timers[id]) clearInterval(timers[id]);

  timers[id] = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(timers[id]);
      delete cart[id];
      updateCart();
      timerSpan.textContent = 'Expirado!';
      return;
    }
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerSpan.textContent = `⏳ ${m}:${s}`;
    seconds--;
  }, 1000);
}

function addToCart(id) {
  const input = document.getElementById(`qty-${id}`);
  let quantity = parseInt(input.value);
  if (isNaN(quantity) || quantity < 1) quantity = 1;
  if (quantity > 100) quantity = 100;
  cart[id] = (cart[id] || 0) + quantity;
  if (cart[id] > 100) cart[id] = 100;
  updateCart();
  startTimer(id);
  input.value = '';
}

function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';
  const currentUser = localStorage.getItem('userName') || '';
  productList.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
        <button onclick="openReview(${product.id})">⭐ Avaliar</button>
        <div class="timer" id="timer-${product.id}"></div>
        ${product.owner === currentUser ? `<button onclick="editProduct(${product.id})">✏️ Editar</button><button onclick="deleteProduct(${product.id})">🗑️ Remover</button>` : ''}
      </div>
    `;
  });
}

function editProduct(id) {
  const product = productList.find(p => p.id === id);
  const newName = prompt("Novo nome do produto:", product.name);
  const newPrice = parseFloat(prompt("Novo preço:", product.price));
  const newImage = prompt("Nova URL da imagem:", product.image);
  if (newName && !isNaN(newPrice) && newImage) {
    product.name = newName;
    product.price = newPrice;
    product.image = newImage;
    renderProducts();
  }
}

function deleteProduct(id) {
  if (confirm("Deseja realmente excluir este produto?")) {
    productList = productList.filter(p => p.id !== id);
    renderProducts();
  }
}

function confirmPurchase() {
  let total = 0;
  for (const id in cart) {
    const item = productList.find(p => p.id == id);
    total += item.price * cart[id];
  }

  const paymentMethod = document.getElementById('payment').value;
  const message = document.getElementById('confirmationMessage');

  if (total > 0) {
    message.innerHTML = `
      <div style="margin-top:15px; padding:10px; background:#dfffdc; border-radius:6px;">
        <strong>Pagamento simulado com sucesso!</strong><br>
        Total: R$ ${total.toFixed(2)}<br>
        Pagamento via: ${paymentMethod}<br>
        <em>Obrigado por comprar no Tudo Orgânico!</em>
      </div>
    `;
    for (const id in timers) clearInterval(timers[id]);
    purchaseHistory.push({ ...cart });
    for (const id in cart) delete cart[id];
    updateCart();
  } else {
    message.innerHTML = `<span style="color:red">Seu carrinho está vazio.</span>`;
  }
}

function openLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}
function closeLogin() {
  document.getElementById('loginModal').style.display = 'none';
}
function openRegister() {
  document.getElementById('registerModal').style.display = 'flex';
}
function closeRegister() {
  document.getElementById('registerModal').style.display = 'none';
}

function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const userName = email.split("@")[0];
  localStorage.setItem('userName', userName);
  alert(`Login simulado para: ${userName}`);
  closeLogin();
  renderProducts();
}

function registerUser() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const type = document.getElementById('userType').value;
  const userName = email.split("@")[0];
  localStorage.setItem('userName', userName);
  localStorage.setItem('userType', type);
  alert(`Cadastro simulado de ${name} como ${type}`);
  closeRegister();
  renderProducts();
}

function openReview(id) {
  const review = prompt("Deixe sua avaliação para o produto (1 a 5 estrelas):");
  const rating = parseInt(review);
  if (rating >= 1 && rating <= 5) {
    if (!reviews[id]) reviews[id] = [];
    reviews[id].push(rating);
    alert("Avaliação registrada com sucesso!");
  } else {
    alert("Por favor, insira uma nota válida entre 1 e 5.");
  }
}

renderProducts();

const cart = {};
const timers = {};

function startTimer(id) {
  const timerSpan = document.getElementById(`timer-${id}`);
  let seconds = 300;

  if (timers[id]) clearInterval(timers[id]);

  timers[id] = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(timers[id]);
      delete cart[id];
      updateCart();
      timerSpan.textContent = 'Expirado!';
      return;
    }

    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerSpan.textContent = `⏳ ${m}:${s}`;
    seconds--;
  }, 1000);
}

function addToCart(id) {
  const input = document.getElementById(`qty-${id}`);
  let quantity = parseInt(input.value);
  if (isNaN(quantity) || quantity < 1) quantity = 1;
  if (quantity > 100) quantity = 100;

  cart[id] = (cart[id] || 0) + quantity;
  if (cart[id] > 100) cart[id] = 100;

  updateCart();
  startTimer(id);
  input.value = '';
}

function renderProducts() {
  const container = document.getElementById('products');
  productList.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
        <div class="timer" id="timer-${product.id}"></div>
      </div>
    `;
  });
}
// Chamado no login para atualizar visibilidade dos botões
function updateUserUI() {
  const userName = localStorage.getItem('userName');
  const userType = localStorage.getItem('userType');
  const adminBtn = document.getElementById('adminPanelBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.querySelector('button[onclick="openLogin()"]');
  const registerBtn = document.querySelector('button[onclick="openRegister()"]');

  if (userName) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';

    if (userType === 'vendedor') {
      adminBtn.style.display = 'inline-block';
    } else {
      adminBtn.style.display = 'none';
    }
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminBtn.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userType');
  alert('Você saiu da sua conta.');
  updateUserUI();
  renderProducts();
  closeAdminPanel();
}

// Abrir painel administrativo
function openAdminPanel() {
  document.getElementById('adminPanel').style.display = 'block';
  renderAdminProducts();
}

// Fechar painel administrativo
function closeAdminPanel() {
  document.getElementById('adminPanel').style.display = 'none';
}

// Renderizar produtos do vendedor no painel admin
function renderAdminProducts() {
  const adminProductList = document.getElementById('adminProductList');
  adminProductList.innerHTML = '';
  const currentUser = localStorage.getItem('userName');

  const userProducts = productList.filter(p => p.owner === currentUser);
  if (userProducts.length === 0) {
    adminProductList.innerHTML = '<p>Você não possui produtos cadastrados.</p>';
    return;
  }

  userProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'admin-product';

    productDiv.innerHTML = `
      <input type="text" value="${product.name}" data-id="${product.id}" class="admin-name" />
      <input type="number" value="${product.price.toFixed(2)}" min="0" step="0.01" data-id="${product.id}" class="admin-price" />
      <input type="url" value="${product.image}" data-id="${product.id}" class="admin-image" />
      <button class="save-btn" data-id="${product.id}">Salvar</button>
      <button class="delete-btn" data-id="${product.id}">Excluir</button>
    `;

    adminProductList.appendChild(productDiv);
  });

  // Adicionar eventos aos botões Salvar e Excluir
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const nameInput = document.querySelector(`.admin-name[data-id="${id}"]`);
      const priceInput = document.querySelector(`.admin-price[data-id="${id}"]`);
      const imageInput = document.querySelector(`.admin-image[data-id="${id}"]`);

      const newName = nameInput.value.trim();
      const newPrice = parseFloat(priceInput.value);
      const newImage = imageInput.value.trim();

      if (newName && !isNaN(newPrice) && newPrice >= 0 && newImage) {
        const product = productList.find(p => p.id === id);
        product.name = newName;
        product.price = newPrice;
        product.image = newImage;
        alert('Produto atualizado com sucesso!');
        renderProducts();
        renderAdminProducts();
      } else {
        alert('Por favor, preencha todos os campos corretamente.');
      }
    };
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute('data-id'));
      if (confirm('Deseja realmente excluir este produto?')) {
        productList = productList.filter(p => p.id !== id);
        alert('Produto excluído.');
        renderProducts();
        renderAdminProducts();
      }
    };
  });
}

// Adicionar novo produto via formulário
function addNewProduct(event) {
  event.preventDefault();
  const name = document.getElementById('newProdName').value.trim();
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const image = document.getElementById('newProdImage').value.trim();
  const owner = localStorage.getItem('userName');

  if (name && !isNaN(price) && price >= 0 && image) {
    const newId = productList.length > 0 ? Math.max(...productList.map(p => p.id)) + 1 : 1;
    productList.push({ id: newId, name, price, image, owner });
    alert('Produto adicionado com sucesso!');
    document.getElementById('addProductForm').reset();
    renderProducts();
    renderAdminProducts();
  } else {
    alert('Preencha todos os campos corretamente.');
  }
}

// Atualiza UI ao carregar página
window.onload = () => {
  updateUserUI();
  renderProducts();
};
const API_URL = 'http://localhost:3000';

let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));

function updateUserUI() {
  const adminBtn = document.getElementById('adminPanelBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.querySelector('button[onclick="openLogin()"]');
  const registerBtn = document.querySelector('button[onclick="openRegister()"]');

  if (token && currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    if (currentUser.type === 'vendedor') {
      adminBtn.style.display = 'inline-block';
    } else {
      adminBtn.style.display = 'none';
    }
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    adminBtn.style.display = 'none';
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Você saiu da conta.');
  updateUserUI();
  renderProducts();
  closeAdminPanel();
}

// Login
async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no login');

    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));
    alert(`Bem-vindo, ${currentUser.name}!`);
    closeLogin();
    updateUserUI();
    renderProducts();
  } catch (err) {
    alert(`Falha no login: ${err.message}`);
  }
}

// Cadastro
async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const type = document.getElementById('userType').value;

  if (!type) {
    alert('Por favor, selecione um tipo de usuário');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password, type})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no cadastro');

    alert('Cadastro realizado com sucesso! Faça login.');
    closeRegister();
  } catch (err) {
    alert(`Falha no cadastro: ${err.message}`);
  }
}

// Renderiza todos os produtos (público)
async function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();

    products.forEach(product => {
      container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <input id="qty-${product.id}" type="number" min="1" max="100" placeholder="Qtd">
        <button onclick="addToCart(${product.id})">Adicionar</button>
        <button onclick="openReview(${product.id})">⭐ Avaliar</button>
        <div class="timer" id="timer-${product.id}"></div>
      </div>
      `;
    });
  } catch {
    container.innerHTML = '<p>Erro ao carregar produtos.</p>';
  }
}

// Renderizar produtos do vendedor no painel admin com dados reais
async function renderAdminProducts() {
  const adminProductList = document.getElementById('adminProductList');
  adminProductList.innerHTML = '';

  if (!token) {
    adminProductList.innerHTML = '<p>Você precisa estar logado.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const userProducts = products.filter(p => p.ownerUserId === currentUser.id);

    if (userProducts.length === 0) {
      adminProductList.innerHTML = '<p>Você não possui produtos cadastrados.</p>';
      return;
    }

    userProducts.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'admin-product';
      productDiv.innerHTML = `
        <input type="text" value="${product.name}" data-id="${product.id}" class="admin-name" />
        <input type="number" value="${product.price.toFixed(2)}" min="0" step="0.01" data-id="${product.id}" class="admin-price" />
        <input type="url" value="${product.image}" data-id="${product.id}" class="admin-image" />
        <button class="save-btn" data-id="${product.id}">Salvar</button>
        <button class="delete-btn" data-id="${product.id}">Excluir</button>
      `;
      adminProductList.appendChild(productDiv);
    });

    // Salvar
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const nameInput = document.querySelector(`.admin-name[data-id="${id}"]`);
        const priceInput = document.querySelector(`.admin-price[data-id="${id}"]`);
        const imageInput = document.querySelector(`.admin-image[data-id="${id}"]`);

        const newName = nameInput.value.trim();
        const newPrice = parseFloat(priceInput.value);
        const newImage = imageInput.value.trim();

        if (!newName || isNaN(newPrice) || newPrice < 0 || !newImage) {
          alert('Preencha todos os campos corretamente');
          return;
        }

        try {
          const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: newName, price: newPrice, image: newImage })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Erro ao salvar');
          alert('Produto atualizado com sucesso!');
          renderAdminProducts();
          renderProducts();
        } catch (err) {
          alert(`Erro: ${err.message}`);
        }
      };
    });

    // Excluir
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = async () => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
          const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Erro ao deletar');
          alert('Produto excluído com sucesso!');
          renderAdminProducts();
          renderProducts();
        } catch (err) {
          alert(`Erro: ${err.message}`);
        }
      };
    });
  } catch {
    adminProductList.innerHTML = '<p>Erro ao carregar produtos.</p>';
  }
}

// Adicionar novo produto via API
async function addNewProduct(event) {
  event.preventDefault();
  if (!token) {
    alert('Você precisa estar logado como vendedor para adicionar produtos.');
    return;
  }
  const name = document.getElementById('newProdName').value.trim();
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const image = document.getElementById('newProdImage').value.trim();

  if (!name || isNaN(price) || price < 0 || !image) {
    alert('Preencha todos os campos corretamente');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, price, image })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao adicionar produto');

    alert('Produto adicionado com sucesso!');
    document.getElementById('addProductForm').reset();
    renderAdminProducts();
    renderProducts();
  } catch (err) {
    alert(`Erro: ${err.message}`);
  }
}

// Funções de abrir e fechar modais
function openLogin() { document.getElementById('loginModal').style.display = 'flex'; }
function closeLogin() { document.getElementById('loginModal').style.display = 'none'; }
function openRegister() { document.getElementById('registerModal').style.display = 'flex'; }
function closeRegister() { document.getElementById('registerModal').style.display = 'none'; }
function openAdminPanel() { document.getElementById('adminPanel').style.display = 'block'; renderAdminProducts(); }
function closeAdminPanel() { document.getElementById('adminPanel').style.display = 'none'; }

// Reutilize suas funções do carrinho, timer, compra, etc., sem alteração

window.onload = () => {
  updateUserUI();
  renderProducts();
};

