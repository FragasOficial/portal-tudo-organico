// Removido `let products = [];` e `const currentUser = ...` daqui para serem gerenciados por cada página HTML que os usa
let cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
const API_URL = "http://localhost:3000/api";

// A lista completa de estadosCidades é carregada de estados-cidades.js
// Certifique-se de que estados-cidades.js esteja incluído ANTES deste script.js no HTML

// Carregar produtos da API
async function loadProducts(search = "", state = "", city = "") {
  try {
    let url = `${API_URL}/products`;
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (state) params.push(`state=${encodeURIComponent(state)}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json(); // Obtém os produtos da API
    renderProducts(products); // Renderiza os produtos obtidos
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    const list = document.getElementById("productList");
    if (list) {
      list.innerHTML = "<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
  }
  populateFilters(); // Garante que os filtros sejam populados
}

// Renderizar produtos
function renderProducts(productsToRender) {
  const list = document.getElementById("productList");
  if (!list) return;
  list.innerHTML = ""; // Limpa a lista atual

  if (productsToRender.length === 0) {
    list.innerHTML = "<p>Nenhum produto encontrado com os critérios de busca/filtro.</p>";
    return;
  }

  productsToRender.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>R$ ${product.price.toFixed(2)}</p>
      <p>Local: ${product.city}/${product.state}</p>
      <button onclick="addToCart({ id: ${product.id}, name: '${product.name}', price: ${product.price} })">Adicionar ao Carrinho</button>
    `;
    list.appendChild(div);
  });
  updateCartDisplay(); // Atualiza o display do carrinho
}

// Adicionar produto ao carrinho (ainda local)
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
  alert(`${product.name} adicionado ao carrinho!`);
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
  const list = document.getElementById("cartItems");
  const totalDisplay = document.getElementById("cartTotal");
  if (!list || !totalDisplay) return;

  list.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.quantity * item.price;
    total += subtotal;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} = R$ ${subtotal.toFixed(2)}`;
    list.appendChild(li);
  });
  totalDisplay.textContent = `R$ ${total.toFixed(2)}`;
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
}

// Toggle do modal do carrinho
function toggleCartModal(forceShow = false) {
  const modal = document.getElementById("cartModal");
  if (!modal) return;
  modal.classList.toggle("show", forceShow || !modal.classList.contains("show"));
}

function closeCartModal() {
  document.getElementById("cartModal")?.classList.remove("show");
}

// Popula filtros de estado/cidade
function populateFilters() {
  const stateSelect = document.getElementById("stateFilter");
  const citySelect = document.getElementById("cityFilter");
  if (!stateSelect || !citySelect) return;

  stateSelect.innerHTML = '<option value="">Todos os Estados</option>';
  // estadosCidades é carregado de estados-cidades.js
  for (let uf in estadosCidades) {
    stateSelect.innerHTML += `<option value="${uf}">${uf}</option>`;
  }

  // Event listener para mudança de estado
  stateSelect.addEventListener("change", () => {
    const uf = stateSelect.value;
    citySelect.innerHTML = '<option value="">Todas as Cidades</option>';
    if (uf && estadosCidades[uf]) {
      estadosCidades[uf].forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
      });
    }
    // Ao mudar o estado, recarrega os produtos com os novos filtros
    const search = document.getElementById("searchInput")?.value || "";
    loadProducts(search, stateSelect.value, citySelect.value);
  });

  // Event listener para mudança de cidade
  citySelect.addEventListener("change", () => {
    const search = document.getElementById("searchInput")?.value || "";
    const state = document.getElementById("stateFilter")?.value || "";
    loadProducts(search, state, citySelect.value);
  });
}

// Event listener para busca
document.getElementById("searchInput")?.addEventListener("input", () => {
  const search = document.getElementById("searchInput").value;
  const state = document.getElementById("stateFilter")?.value || "";
  const city = document.getElementById("cityFilter")?.value || "";
  loadProducts(search, state, city);
});


// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  loadProducts(); // Chama loadProducts sem filtros iniciais
  updateCartDisplay(); // Garante que o carrinho seja exibido corretamente
});