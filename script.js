// script.js (PARA O FRONTEND - index.html)

// Variáveis globais para o frontend
let cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
const API_URL = "http://localhost:3000/api";
const itemTimers = {}; // Objeto para armazenar os temporizadores de cada item do carrinho
let currentPaymentMethod = 'pix'; // Método de pagamento padrão

// A lista completa de estadosCidades é carregada de estados-cidades.js
// Certifique-se de que estados-cidades.js esteja incluído ANTES deste script.js no HTML

// Função principal para carregar e filtrar produtos da API
async function loadProducts(search = "", state = "", city = "") {
  try {
    let url = `${API_URL}/products`;
    const params = [];

    if (search) {
      params.push(`name=${encodeURIComponent(search)}`);
    }
    if (state) {
      params.push(`state=${encodeURIComponent(state)}`);
    }
    if (city) {
      params.push(`city=${encodeURIComponent(city)}`);
    }

    if (params.length > 0) {
      url += `/search?${params.join('&')}`;
    }

    console.log("Buscando produtos na URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log("Produtos recebidos da API (filtrados):", products);
    renderProducts(products);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    const list = document.getElementById("productList");
    if (list) {
      list.innerHTML = "<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
  }
}

// Renderizar produtos na página
function renderProducts(products) {
  const productListDiv = document.getElementById("productList");
  if (!productListDiv) {
    console.error("Elemento #productList não encontrado no DOM.");
    return;
  }
  productListDiv.innerHTML = "";

  if (products.length === 0) {
    productListDiv.innerHTML = "<p>Nenhum produto encontrado com os filtros aplicados.</p>";
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>R$ ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</p>
      <p>${product.city}/${product.state}</p>
      <button class="add-to-cart-btn" data-product-id="${product.id}">Adicionar ao Carrinho</button>
    `;
    productListDiv.appendChild(productCard);
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.dataset.productId);
      const productToAdd = products.find(p => p.id === productId);
      if (productToAdd) {
        addToCart(productToAdd);
      }
    });
  });
}

// Adicionar produto ao carrinho
function addToCart(product) {
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1, addedTime: Date.now() }); // Adiciona timestamp
  }
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  updateCartDisplay();
  alert(`${product.name} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  updateCartDisplay();
  if (itemTimers[productId]) {
    clearInterval(itemTimers[productId]);
    delete itemTimers[productId];
  }
}

// Alterar quantidade do produto no carrinho
function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem("checkoutCart", JSON.stringify(cart));
      updateCartDisplay();
    }
  }
}

// Atualizar quantidade diretamente via input
function updateQuantityInput(productId, inputElement) {
  let newQuantity = parseInt(inputElement.value);
  if (isNaN(newQuantity) || newQuantity < 1) {
    newQuantity = 1;
  }

  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    updateCartDisplay();
  }
}

// Iniciar temporizador para um item do carrinho
function startCartItemTimer(productId) {
  if (itemTimers[productId]) {
    clearInterval(itemTimers[productId]);
  }

  const item = cart.find(i => i.id === productId);
  if (!item || !item.addedTime) return;

  itemTimers[productId] = setInterval(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - item.addedTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const timerElement = document.getElementById(`timer-${productId}`);
    if (timerElement) {
      timerElement.textContent = `Tempo no carrinho: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      clearInterval(itemTimers[productId]);
      delete itemTimers[productId];
    }
  }, 1000);
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
  const cartItemsUl = document.getElementById("cartItems");
  const cartTotalSpan = document.getElementById("cartTotal");

  if (!cartItemsUl || !cartTotalSpan) return;

  cartItemsUl.innerHTML = "";
  let total = 0;

  for (const timerId in itemTimers) {
    clearInterval(itemTimers[timerId]);
  }
  Object.keys(itemTimers).forEach(key => delete itemTimers[key]);


  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <span>${item.name} - R$ ${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="quantity-btn minus" onclick="changeQuantity(${item.id}, -1)">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1"
                 onchange="updateQuantityInput(${item.id}, this)">
          <button class="quantity-btn plus" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-from-cart-btn" onclick="removeFromCart(${item.id})">Remover</button>
      </div>
      <div class="cart-item-timer" id="timer-${item.id}"></div>
    `;
    cartItemsUl.appendChild(li);
    total += item.price * item.quantity;

    startCartItemTimer(item.id);
  });

  cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;

  const proceedToPaymentButton = document.getElementById("proceedToPaymentButton");
  if (proceedToPaymentButton) {
    proceedToPaymentButton.disabled = cart.length === 0;
  }
}

// Alternar visibilidade do modal do carrinho
function toggleCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.toggle("hidden");
    if (!cartModal.classList.contains("hidden")) {
      updateCartDisplay();
    }
  }
}

// Fechar modal do carrinho
function closeCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.add("hidden");
  }
}

// --- FUNÇÕES PARA O NOVO MODAL DE PAGAMENTO ---

// Abre o modal de pagamento
function openPaymentModal() {
  const cartTotalSpan = document.getElementById("cartTotal");
  const paymentTotalSpan = document.getElementById("paymentTotal");
  const paymentModal = document.getElementById("paymentModal");

  if (cart.length === 0) {
    alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
    return;
  }

  // Define o total a pagar no modal de pagamento
  paymentTotalSpan.textContent = cartTotalSpan.textContent;

  // Mostra apenas os detalhes do Pix por padrão
  document.getElementById('pixDetails').classList.remove('hidden');
  document.getElementById('cardDetails').classList.add('hidden');
  document.getElementById('cashDetails').classList.add('hidden');
  document.getElementById('paymentPix').checked = true; // Garante que Pix esteja selecionado

  currentPaymentMethod = 'pix'; // Reseta o método selecionado para Pix

  document.getElementById("cartModal").classList.add("hidden"); // Esconde o modal do carrinho
  paymentModal.classList.remove("hidden"); // Mostra o modal de pagamento
}

// Fecha o modal de pagamento
function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
  // Opcional: Você pode reabrir o modal do carrinho aqui se desejar
  // document.getElementById("cartModal").classList.remove("hidden");
}

// Lida com a mudança do método de pagamento (Pix, Cartão, Dinheiro)
function handlePaymentMethodChange(event) {
  currentPaymentMethod = event.target.value;
  const pixDetails = document.getElementById('pixDetails');
  const cardDetails = document.getElementById('cardDetails');
  const cashDetails = document.getElementById('cashDetails');

  pixDetails.classList.add('hidden');
  cardDetails.classList.add('hidden');
  cashDetails.classList.add('hidden');

  if (currentPaymentMethod === 'pix') {
    pixDetails.classList.remove('hidden');
  } else if (currentPaymentMethod === 'creditCard' || currentPaymentMethod === 'debitCard') {
    cardDetails.classList.remove('hidden');
  } else if (currentPaymentMethod === 'cash') {
    cashDetails.classList.remove('hidden');
  }
}

// Copiar código Pix
function copyPixCode() {
  const pixCodeInput = document.getElementById('pixCode');
  pixCodeInput.select();
  pixCodeInput.setSelectionRange(0, 99999); // Para dispositivos móveis
  document.execCommand('copy');
  alert('Código Pix copiado para a área de transferência!');
}

// Calcula troco para pagamento em dinheiro
function calculateChange() {
  const totalAmount = parseFloat(document.getElementById("paymentTotal").textContent.replace('R$ ', '').replace(',', '.'));
  const cashAmountPaid = parseFloat(document.getElementById("cashAmountPaid").value);
  const cashChangeSpan = document.getElementById("cashChange");

  if (isNaN(cashAmountPaid) || cashAmountPaid < 0) {
    cashChangeSpan.textContent = "R$ 0,00";
    return;
  }

  const change = cashAmountPaid - totalAmount;
  cashChangeSpan.textContent = `R$ ${change >= 0 ? change.toFixed(2).replace('.', ',') : '0,00 (Insuficiente)'}`;
}

// Função principal para confirmar o pagamento
async function confirmPayment() {
  const totalAmount = parseFloat(document.getElementById("paymentTotal").textContent.replace('R$ ', '').replace(',', '.'));

  let paymentDetails = {
    method: currentPaymentMethod,
    amount: totalAmount,
    cartItems: cart.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  };

  // Coleta detalhes específicos do método de pagamento
  if (currentPaymentMethod === 'creditCard' || currentPaymentMethod === 'debitCard') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCvv = document.getElementById('cardCvv').value.trim();

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert("Por favor, preencha todos os dados do cartão.");
      return;
    }
    // Adicionar validações mais robustas aqui (número de cartão, validade, CVV)
    if (!/^\d{16}$/.test(cardNumber)) {
        alert("Número do cartão inválido. Deve ter 16 dígitos.");
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert("Formato de validade inválido. Use MM/AA.");
        return;
    }
    if (!/^\d{3,4}$/.test(cardCvv)) {
        alert("CVV inválido. Deve ter 3 ou 4 dígitos.");
        return;
    }


    paymentDetails.card = {
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      cvv: cardCvv
    };
  } else if (currentPaymentMethod === 'cash') {
    const cashAmountPaid = parseFloat(document.getElementById("cashAmountPaid").value);
    if (isNaN(cashAmountPaid) || cashAmountPaid < totalAmount) {
      alert("Valor pago em dinheiro é insuficiente.");
      return;
    }
    paymentDetails.cashPaid = cashAmountPaid;
    paymentDetails.change = cashAmountPaid - totalAmount;
  } else if (currentPaymentMethod === 'pix') {
      // Nenhum dado adicional complexo necessário para a simulação do Pix
  }

  try {
    // --- INÍCIO DA ALTERAÇÃO PARA INCLUIR O TOKEN JWT ---
    const token = localStorage.getItem('token'); // Pega o token do localStorage

    if (!token) {
        alert('Você não está logado. Por favor, faça login para finalizar a compra.');
        console.error('Token JWT não encontrado no localStorage.');
        return; // Sai da função se não houver token
    }

    alert("Processando pagamento via " + currentPaymentMethod + "..."); // Simulação
    const response = await fetch(`${API_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <--- ADIÇÃO DO CABEÇALHO DE AUTORIZAÇÃO
      },
      body: JSON.stringify(paymentDetails),
    });
    // --- FIM DA ALTERAÇÃO ---

    const result = await response.json();

    if (response.ok) {
      alert(`Pagamento de R$ ${totalAmount.toFixed(2).replace('.', ',')} via ${currentPaymentMethod} realizado com sucesso! ${result.message || ''}`);
      cart = []; // Limpa o carrinho
      localStorage.setItem("checkoutCart", JSON.stringify(cart));
      updateCartDisplay();
      closePaymentModal(); // Fecha o modal de pagamento
      closeCartModal(); // Garante que o modal do carrinho também está fechado
    } else {
      alert(`Erro no pagamento: ${result.message || 'Houve um problema ao processar seu pagamento.'}`);
      // Em caso de erro, você pode querer manter o modal aberto ou dar opções ao usuário.
    }
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    alert("Erro de conexão ou servidor ao processar pagamento. Tente novamente.");
  }
}


// Funções de filtro e eventos (mantidas como estão, mas com a adição do novo botão)
function populateFilters() {
  const stateSelect = document.getElementById("stateFilter");
  const citySelect = document.getElementById("cityFilter");

  if (!stateSelect || !citySelect) {
    console.warn("Elementos de filtro (stateFilter ou cityFilter) não encontrados.");
    return;
  }

  stateSelect.innerHTML = '<option value="">Todos os Estados</option>';
  for (const uf in estadosCidades) {
    stateSelect.innerHTML += `<option value=\"${uf}\">${uf}</option>`;
  }

  stateSelect.addEventListener("change", () => {
    const uf = stateSelect.value;
    citySelect.innerHTML = '<option value="">Todas as Cidades</option>';
    if (uf && estadosCidades[uf]) {
      estadosCidades[uf].forEach(city => {
        citySelect.innerHTML += `<option value=\"${city}\">${city}</option>`;
      });
    }
    const search = document.getElementById("searchInput")?.value || "";
    loadProducts(search, stateSelect.value, "");
  });

  citySelect.addEventListener("change", () => {
    const search = document.getElementById("searchInput")?.value || "";
    const state = document.getElementById("stateFilter")?.value || "";
    const city = document.getElementById("cityFilter")?.value || "";
    loadProducts(search, state, city);
  });
}

document.getElementById("searchInput")?.addEventListener("input", () => {
  const search = document.getElementById("searchInput").value;
  const state = document.getElementById("stateFilter")?.value || "";
  const city = document.getElementById("cityFilter")?.value || "";
  loadProducts(search, state, city);
});

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  loadProducts();
  updateCartDisplay();

  // Event listener para o botão "Finalizar compra" do modal do carrinho
  const proceedToPaymentButton = document.getElementById("proceedToPaymentButton");
  if (proceedToPaymentButton) {
    proceedToPaymentButton.addEventListener('click', openPaymentModal);
  }

  // Event listeners para os radio buttons de pagamento
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', handlePaymentMethodChange);
  });

  // Event listener para o campo de valor pago em dinheiro para calcular troco
  document.getElementById('cashAmountPaid')?.addEventListener('input', calculateChange);

  // Event listener para o botão "Confirmar Pagamento" do modal de pagamento
  const confirmPaymentButton = document.getElementById("confirmPaymentButton");
  if (confirmPaymentButton) {
    confirmPaymentButton.addEventListener('click', confirmPayment);
  }
});