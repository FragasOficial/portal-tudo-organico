// // Variáveis globais para o frontend
// let cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
// const API_URL = "http://localhost:3000/api";

// // A lista completa de estadosCidades é carregada de estados-cidades.js
// // Certifique-se de que estados-cidades.js esteja incluído ANTES deste script.js no HTML
// // (Seu index.html já faz isso corretamente)

// // Carregar produtos da API
// async function loadProducts(search = "", state = "", city = "") {
//   try {
//     let url = `${API_URL}/products`;
//     const params = [];
//     if (search) params.push(`search=${encodeURIComponent(search)}`);
//     if (state) params.push(`state=${encodeURIComponent(state)}`);
//     if (city) params.push(`city=${encodeURIComponent(city)}`);

//     if (params.length > 0) {
//       url += `?${params.join('&')}`;
//     }

//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const products = await response.json(); // Obtém os produtos da API
//     console.log("Produtos recebidos da API:", products); // Adicionado para depuração
//     renderProducts(products); // Renderiza os produtos obtidos
//   } catch (error) {
//     console.error("Erro ao carregar produtos:", error);
//     const list = document.getElementById("productList");
//     if (list) {
//       list.innerHTML = "<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
//     }
//   }
//   populateFilters(); // Garante que os selects de filtros sejam preenchidos
// }

// // Renderizar produtos na página
// function renderProducts(products) {
//   const productListDiv = document.getElementById("productList");
//   if (!productListDiv) {
//     console.error("Elemento #productList não encontrado no DOM.");
//     return;
//   }
//   productListDiv.innerHTML = ""; // Limpa a lista existente

//   if (products.length === 0) {
//     productListDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
//     return;
//   }

//   products.forEach(product => {
//     // Verifique se as propriedades do produto correspondem ao que o backend envia
//     // O backend envia: id, name, price, image, city, state, vendedorId, createdAt, updatedAt
//     const productCard = document.createElement("div");
//     productCard.className = "product-card";
//     productCard.innerHTML = `
//       <img src="${product.image}" alt="${product.name}" />
//       <h3>${product.name}</h3>
//       <p>R$ ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}</p>
//       <p>${product.city}/${product.state}</p>
//       <button onclick="addToCart({ id: ${product.id}, name: '${product.name}', price: ${product.price}, image: '${product.image}' })">Adicionar ao Carrinho</button>
//     `;
//     productListDiv.appendChild(productCard);
//   });
// }

// // Funções do carrinho
// function addToCart(product) {
//   const existingItemIndex = cart.findIndex(item => item.id === product.id);

//   if (existingItemIndex > -1) {
//     cart[existingItemIndex].quantity += 1;
//   } else {
//     cart.push({ ...product, quantity: 1 });
//   }
//   localStorage.setItem("checkoutCart", JSON.stringify(cart));
//   updateCartDisplay();
//   alert(`${product.name} adicionado ao carrinho!`);
// }

// function updateCartDisplay() {
//   const cartItemsUl = document.getElementById("cartItems");
//   const cartTotalSpan = document.getElementById("cartTotal");

//   if (!cartItemsUl || !cartTotalSpan) return;

//   cartItemsUl.innerHTML = "";
//   let total = 0;

//   cart.forEach(item => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//       ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}
//       <button onclick="removeFromCart(${item.id})">Remover</button>
//     `;
//     cartItemsUl.appendChild(li);
//     total += item.price * item.quantity;
//   });

//   cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
// }

// function removeFromCart(productId) {
//   cart = cart.filter(item => item.id !== productId);
//   localStorage.setItem("checkoutCart", JSON.stringify(cart));
//   updateCartDisplay();
// }

// function toggleCartModal() {
//   const cartModal = document.getElementById("cartModal");
//   if (cartModal) {
//     cartModal.classList.toggle("hidden");
//   }
// }

// function closeCartModal() {
//   const cartModal = document.getElementById("cartModal");
//   if (cartModal) {
//     cartModal.classList.add("hidden");
//   }
// }

// // Funções de filtro
// function populateFilters() {
//   const stateSelect = document.getElementById("stateFilter");
//   const citySelect = document.getElementById("cityFilter");

//   if (!stateSelect || !citySelect) return;

//   // Popula estados
//   stateSelect.innerHTML = '<option value="">Todos os Estados</option>';
//   for (const uf in estadosCidades) {
//     stateSelect.innerHTML += `<option value=\"${uf}\">${uf}</option>`;
//   }

//   // Event listener para mudança de estado
//   stateSelect.addEventListener("change", () => {
//     const uf = stateSelect.value;
//     citySelect.innerHTML = '<option value="">Todas as Cidades</option>';
//     if (uf && estadosCidades[uf]) {
//       estadosCidades[uf].forEach(city => {
//         citySelect.innerHTML += `<option value=\"${city}\">${city}</option>`;
//       });
//     }
//     // Ao mudar o estado, recarrega os produtos com os novos filtros
//     const search = document.getElementById("searchInput")?.value || "";
//     loadProducts(search, stateSelect.value, citySelect.value);
//   });

//   // Event listener para mudança de cidade
//   citySelect.addEventListener("change", () => {
//     const search = document.getElementById("searchInput")?.value || "";
//     const state = document.getElementById("stateFilter")?.value || "";
//     loadProducts(search, state, citySelect.value);
//   });
// }

// // Event listener para busca
// document.getElementById("searchInput")?.addEventListener("input", () => {
//   const search = document.getElementById("searchInput").value;
//   const state = document.getElementById("stateFilter")?.value || "";
//   const city = document.getElementById("cityFilter")?.value || "";
//   loadProducts(search, state, city);
// });


// // Inicializa ao carregar a página
// document.addEventListener("DOMContentLoaded", () => {
//   loadProducts(); // Chama loadProducts sem filtros iniciais
//   updateCartDisplay(); // Garante que o carrinho seja exibido corretamente
//   populateFilters(); // ✅ Adicionado: Garante que os selects de filtros sejam preenchidos
// });

// script.js (PARA O FRONTEND - index.html)

// Variáveis globais para o frontend
let cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
const API_URL = "http://localhost:3000/api";

// A lista completa de estadosCidades é carregada de estados-cidades.js
// Certifique-se de que estados-cidades.js esteja incluído ANTES deste script.js no HTML

// Função principal para carregar e filtrar produtos da API
async function loadProducts(search = "", state = "", city = "") {
  try {
    let url = `${API_URL}/products`;
    const params = [];

    // Adiciona o parâmetro de busca por nome, se houver
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }
    // Adiciona o parâmetro de filtro por estado, se houver
    if (state) {
      params.push(`state=${encodeURIComponent(state)}`);
    }
    // Adiciona o parâmetro de filtro por cidade, se houver
    if (city) {
      params.push(`city=${encodeURIComponent(city)}`);
    }

    // Constrói a URL com os parâmetros de query
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    console.log("Buscando produtos na URL:", url); // Para depuração: veja a URL da requisição

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log("Produtos recebidos da API (filtrados):", products); // Para depuração: veja os produtos retornados
    renderProducts(products); // Renderiza os produtos obtidos
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    const list = document.getElementById("productList");
    if (list) {
      list.innerHTML = "<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>";
    }
  }
  // populateFilters(); // Não chame aqui, pois pode resetar os selects após uma mudança.
                     // populateFilters é chamado apenas uma vez no DOMContentLoaded.
}

// Renderizar produtos na página
function renderProducts(products) {
  const productListDiv = document.getElementById("productList");
  if (!productListDiv) {
    console.error("Elemento #productList não encontrado no DOM.");
    return;
  }
  productListDiv.innerHTML = ""; // Limpa a lista existente

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
      <button onclick="addToCart({ id: ${product.id}, name: '${product.name}', price: ${product.price}, image: '${product.image}' })">Adicionar ao Carrinho</button>
    `;
    productListDiv.appendChild(productCard);
  });
}

// Funções do carrinho (mantidas como estão)
function addToCart(product) {
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  updateCartDisplay();
  alert(`${product.name} adicionado ao carrinho!`);
}

function updateCartDisplay() {
  const cartItemsUl = document.getElementById("cartItems");
  const cartTotalSpan = document.getElementById("cartTotal");

  if (!cartItemsUl || !cartTotalSpan) return;

  cartItemsUl.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}
      <button onclick="removeFromCart(${item.id})">Remover</button>
    `;
    cartItemsUl.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("checkoutCart", JSON.stringify(cart));
  updateCartDisplay();
}

function toggleCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.toggle("hidden");
  }
}

function closeCartModal() {
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.add("hidden");
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

  // Popula estados
  stateSelect.innerHTML = '<option value="">Todos os Estados</option>';
  for (const uf in estadosCidades) {
    stateSelect.innerHTML += `<option value=\"${uf}\">${uf}</option>`;
  }

  // Event listener para mudança de estado
  stateSelect.addEventListener("change", () => {
    const uf = stateSelect.value;
    citySelect.innerHTML = '<option value="">Todas as Cidades</option>'; // Reseta cidades
    if (uf && estadosCidades[uf]) {
      estadosCidades[uf].forEach(city => {
        citySelect.innerHTML += `<option value=\"${city}\">${city}</option>`;
      });
    }
    // Ao mudar o estado, recarrega os produtos com os novos filtros
    const search = document.getElementById("searchInput")?.value || "";
    loadProducts(search, stateSelect.value, ""); // Limpa a cidade ao mudar o estado
  });

  // Event listener para mudança de cidade
  citySelect.addEventListener("change", () => {
    const search = document.getElementById("searchInput")?.value || "";
    const state = document.getElementById("stateFilter")?.value || "";
    loadProducts(search, state, citySelect.value);
  });
}

// Event listener para busca por nome
document.getElementById("searchInput")?.addEventListener("input", () => {
  const search = document.getElementById("searchInput").value;
  const state = document.getElementById("stateFilter")?.value || "";
  const city = document.getElementById("cityFilter")?.value || "";
  loadProducts(search, state, city);
});


// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  populateFilters(); // ✅ Chame populateFilters primeiro para preencher os selects
  loadProducts(); // Chama loadProducts sem filtros iniciais para carregar todos os produtos
  updateCartDisplay(); // Garante que o carrinho seja exibido corretamente
});