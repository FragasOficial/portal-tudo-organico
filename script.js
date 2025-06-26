const productList = [
  {
    id: 1,
    name: "Banana Orgânica",
    price: 5,
    image: "https://www.maisquitanda.com.br/image/cache/2-frutas/Banana-Caturra-800x800.jpg"
  },
  {
    id: 2,
    name: "Alface Crespa",
    price: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJUl_MbdePF9x7l9UEEmtTmRYKEJ1iOj7otA&s"
  },
  {
    id: 3,
    name: "Tomate Cereja",
    price: 6,
    image: "https://prezunic.vtexassets.com/arquivos/ids/186979/65678fcf1ef3739680762de3.jpg?v=638368826428330000https://www.pngall.com/wp-content/uploads/5/Cherry-Tomato-PNG-Free-Download.png"
  },
  {
    id: 4,
    name: "Ovos Caipira (dúzia)",
    price: 12,
    image: "https://organicossaocarlos.com.br/wp-content/uploads/2019/11/ovos-caipira.png"
  },
  {
    id: 5,
    name: "Mel de Abelha (500ml)",
    price: 20,
    image: "https://down-br.img.susercontent.com/file/31f6d36358bc57d3c1da9156fe441074"
  },
  {
    id: 6,
    name: "Manteiga de Leite",
    price: 18,
    image: "https://images.tcdn.com.br/img/img_prod/854009/manteiga_de_garrafa_1_litro_amarelinha_de_minas_2730_1_e03b0b956ca8250038658aa2b4e48374.jpg"
  }
];

const cart = {};

function updateCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';
  let totalItems = 0;

  for (const id in cart) {
    const item = productList.find(p => p.id == id);
    totalItems += cart[id];
    cartContainer.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${cart[id]}</span>
      </div>
    `;
  }

  document.getElementById('totalItems').innerText = totalItems;
}

function addToCart(id) {
  const input = document.getElementById(`qty-${id}`);
  let quantity = parseInt(input.value);
  if (isNaN(quantity) || quantity < 1) quantity = 1;
  if (quantity > 100) quantity = 100;
  cart[id] = (cart[id] || 0) + quantity;
  if (cart[id] > 100) cart[id] = 100;
  updateCart();
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
      </div>
    `;
  });
}

renderProducts();
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
        <strong>Obrigado pela sua compra!</strong><br>
        Total: R$ ${total.toFixed(2)}<br>
        Pagamento via: ${paymentMethod}
      </div>
    `;
    cart = {};
    updateCart();
  } else {
    message.innerHTML = `<span style="color:red">Seu carrinho está vazio.</span>`;
  }
}

function filterProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const container = document.getElementById('products');
  container.innerHTML = '';

  const filteredList = productList.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

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