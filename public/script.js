// Lista de produtos orgânicos fixos
const productList = [
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



