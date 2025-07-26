// script.js (PARA O FRONTEND - index.html)

// Variáveis globais para o frontend
let cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
const API_URL = "http://localhost:3000/api";
const itemTimers = {}; // Objeto para armazenar os temporizadores de cada item do carrinho
let currentPaymentMethod = 'pix'; // Método de pagamento padrão
let currentProductForQuantityModal = null; // Armazena o produto sendo editado no modal de quantidade

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
      <details>
        <summary><strong>Ver Tabela Nutricional</strong></summary>
        <p>${product.nutritionalInfo || 'Não informada.'}</p>
      </details>
      <button class="add-to-cart-btn" data-product-id="${product.id}">Adicionar ao Carrinho</button>
    `;
    productListDiv.appendChild(productCard);
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.dataset.productId);
      const productToAdd = products.find(p => p.id === productId);
      if (productToAdd) {
        const existingItem = cart.find(item => item.id === productToAdd.id);
        if (existingItem) {
          openQuantityModal(productToAdd, existingItem.quantity);
        } else {
          addToCart(productToAdd, 1);
        }
      }
    });
  });
}

// Adicionar produto ao carrinho ou atualizar quantidade
function addToCart(product, quantity) {
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity = quantity;
  } else {
    cart.push({ ...product, quantity: quantity, addedTime: Date.now() });
  }
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  updateCartDisplay();
  alert(`${product.name} adicionado ao carrinho com ${quantity} unidade(s)!`);
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

  // Lógica para habilitar/desabilitar o botão "Finalizar compra"
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
      updateCartDisplay(); // Garante que o display do carrinho é atualizado ao abrir
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

// --- FUNÇÕES PARA O MODAL DE PAGAMENTO ---

// Abre o modal de pagamento
function openPaymentModal() {
  console.log("openPaymentModal() chamada.");
  const cartTotalSpan = document.getElementById("cartTotal");
  const paymentTotalSpan = document.getElementById("paymentTotal");
  const paymentModal = document.getElementById("paymentModal");

  // Verificação de carrinho vazio
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

  // Limpa o QR Code e o código Pix ao abrir o modal, para que sejam gerados novamente
  document.getElementById('pixQrCodeImage').src = "https://via.placeholder.com/150?text=Gerando...";
  document.getElementById('pixCode').value = "Aguardando geração do Pix...";


  document.getElementById("cartModal").classList.add("hidden"); // Esconde o modal do carrinho
  paymentModal.classList.remove("hidden"); // Mostra o modal de pagamento
}

// Fecha o modal de pagamento
function closePaymentModal() {
  document.getElementById("paymentModal").classList.add("hidden");
}

// Lida com a mudança do método de pagamento (Pix, Cartão, Dinheiro)
function handlePaymentMethodChange(event) {
  const pixDetails = document.getElementById('pixDetails');
  const cardDetails = document.getElementById('cardDetails');
  const cashDetails = document.getElementById('cashDetails');

  pixDetails.classList.add('hidden');
  cardDetails.classList.add('hidden');
  cashDetails.classList.add('hidden');

  const selectedMethod = event.target.value;

  if (selectedMethod === 'pix') {
    pixDetails.classList.remove('hidden');
    if (cart.length > 0) {
        confirmPayment();
    }
  } else if (selectedMethod === 'creditCard' || selectedMethod === 'debitCard') {
    cardDetails.classList.remove('hidden');
  } else if (selectedMethod === 'cash') {
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

  // Adicionado log para ver todos os radio buttons de pagamento
  const allPaymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  console.log('Todos os radio buttons de pagamento:', allPaymentRadios);
  allPaymentRadios.forEach((radio, index) => {
      console.log(`Radio ${index}: id=${radio.id}, value=${radio.value}, checked=${radio.checked}`);
  });


  const selectedPaymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked');
  console.log('Radio button de pagamento selecionado (elemento):', selectedPaymentMethodRadio);

  if (!selectedPaymentMethodRadio) {
      alert("Por favor, selecione um método de pagamento.");
      console.error("Nenhum método de pagamento selecionado.");
      return;
  }
  const method = selectedPaymentMethodRadio.value;
  console.log('Método de pagamento obtido:', method);


  let paymentDetails = {
    method: method,
    amount: totalAmount,
    cartItems: cart.map(item => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  };

  console.log('--- Dados da Requisição de Pagamento (Frontend) ---');
  console.log('paymentMethod:', paymentDetails.method);
  console.log('amount:', paymentDetails.amount);
  console.log('cartItems:', paymentDetails.cartItems);
  console.log('--------------------------------------------------');

  // ✅ NOVO LOG: Log do JSON completo que será enviado
  const jsonPayload = JSON.stringify(paymentDetails);
  console.log('JSON Payload enviado para o backend:', jsonPayload);


  if (method === 'creditCard' || method === 'debitCard') {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCvv = document.getElementById('cardCvv').value.trim();

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert("Por favor, preencha todos os dados do cartão.");
      return;
    }
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
    alert("Processando pagamento via Cartão...");
    setTimeout(() => {
        alert("Pagamento via Cartão simulado com sucesso!");
        cart = [];
        localStorage.setItem("checkoutCart", JSON.stringify(cart));
        updateCartDisplay();
        closePaymentModal();
        closeCartModal();
    }, 1500);
    return;
  } else if (method === 'cash') {
    const cashAmountPaid = parseFloat(document.getElementById("cashAmountPaid").value);
    if (isNaN(cashAmountPaid) || cashAmountPaid < totalAmount) {
      alert("Valor pago em dinheiro é insuficiente.");
      return;
    }
    paymentDetails.cashPaid = cashAmountPaid;
    paymentDetails.change = cashAmountPaid - totalAmount;
    alert("Pagamento em Dinheiro confirmado! Aguardando o troco...");
    cart = [];
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    updateCartDisplay();
    closePaymentModal();
    closeCartModal();
    return;
  } else if (method === 'pix') {
      document.getElementById('pixQrCodeImage').src = "https://via.placeholder.com/150?text=Gerando...";
      document.getElementById('pixCode').value = "Gerando código Pix...";
  } else {
      alert("Método de pagamento não suportado ou não selecionado.");
      return;
  }

  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Você não está logado. Por favor, faça login para finalizar a compra.');
        console.error('Token JWT não encontrado no localStorage.');
        return;
    }

    const response = await fetch(`${API_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentDetails),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('pixQrCodeImage').src = `data:image/png;base64,${result.pixData.qr_code_base64}`;
      document.getElementById('pixCode').value = result.pixData.qr_code;
      alert(`Pagamento Pix de R$ ${totalAmount.toFixed(2).replace('.', ',')} via ${method} gerado com sucesso! Escaneie o QR Code ou copie o código.`);
    } else {
      alert(`Erro ao gerar Pix: ${result.message || 'Houve um problema ao gerar seu Pix.'}`);
      document.getElementById('pixQrCodeImage').src = "https://via.placeholder.com/150?text=Erro";
      document.getElementById('pixCode').value = "Erro na geração do Pix.";
      console.error('Erro na resposta da API de pagamento:', result);
    }
  } catch (error) {
    console.error("Erro ao processar pagamento Pix:", error);
    alert("Erro de conexão ou servidor ao processar pagamento Pix. Tente novamente.");
    document.getElementById('pixQrCodeImage').src = "https://via.placeholder.com/150?text=Erro";
    document.getElementById('pixCode').value = "Erro de conexão.";
  }
}

// --- NOVAS FUNÇÕES PARA O MODAL DE QUANTIDADE ---
function openQuantityModal(product, currentQuantity) {
    currentProductForQuantityModal = product;
    const quantityModal = document.getElementById('quantityModal');
    const quantityInput = document.getElementById('quantityInputModal');
    const quantityProductInfo = document.getElementById('quantityProductInfo');

    quantityProductInfo.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
        <h3>${product.name}</h3>
        <p>Preço: R$ ${product.price.toFixed(2)}</p>
        <p>Quantidade atual no carrinho: ${currentQuantity}</p>
    `;
    quantityInput.value = currentQuantity;
    quantityModal.classList.remove('hidden');
}

function closeQuantityModal() {
    document.getElementById('quantityModal').classList.add('hidden');
    currentProductForQuantityModal = null;
}

function changeQuantityModal(delta) {
    const quantityInput = document.getElementById('quantityInputModal');
    let newQuantity = parseInt(quantityInput.value) + delta;
    if (newQuantity < 1) {
        newQuantity = 1;
    }
    quantityInput.value = newQuantity;
}

function confirmQuantityModal() {
    const quantityInput = document.getElementById('quantityInputModal');
    const newQuantity = parseInt(quantityInput.value);

    if (currentProductForQuantityModal && !isNaN(newQuantity) && newQuantity >= 1) {
        addToCart(currentProductForQuantityModal, newQuantity);
        closeQuantityModal();
    } else {
        alert("Por favor, insira uma quantidade válida.");
    }
}


// Funções de filtro e eventos
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
  updateCartDisplay(); // Garante que o estado do carrinho é atualizado e o botão habilitado/desabilitado

  // Event listener para o botão "Finalizar compra" do modal do carrinho
  const proceedToPaymentButton = document.getElementById("proceedToPaymentButton");
  if (proceedToPaymentButton) {
    proceedToPaymentButton.addEventListener('click', openPaymentModal);
    console.log("Evento de clique anexado ao botão 'Finalizar compra'."); // Log para depuração
  } else {
    console.error("Botão 'Finalizar compra' (ID: proceedToPaymentButton) não encontrado no DOM."); // Log se o botão não for encontrado
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
