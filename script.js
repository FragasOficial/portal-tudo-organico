const products = [
  {
    id: 1,
    name: "Banana Orgânica",
    price: 6.50,
    image: "https://via.placeholder.com/200x150?text=Banana",
    state: "SP",
    city: "São Paulo"
  },
  {
    id: 2,
    name: "Tomate Cereja",
    price: 8.99,
    image: "https://via.placeholder.com/200x150?text=Tomate",
    state: "RJ",
    city: "Niterói"
  },
  // +8 produtos aqui com dados similares...
];

let cart = [];

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const state = document.getElementById("stateFilter")?.value || "";
  const city = document.getElementById("cityFilter")?.value || "";

  products
    .filter(p =>
      p.name.toLowerCase().includes(search) &&
      (state === "" || p.state === state) &&
      (city === "" || p.city === city)
    )
    .forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>R$ ${product.price.toFixed(2)}</p>
        <div class="rating" data-id="${product.id}">
            ${renderStars(product.id)}
        </div>
        <label>Qtd:
            <input type="number" min="1" value="1" id="qty-${product.id}" />
        </label>
        <button onclick="addToCart(${product.id})">Adicionar</button>
        `;
    });
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  updateCartModal();
  toggleCartModal(true);
}

function updateCartModal() {
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.qty} = R$ ${subtotal.toFixed(2)}`;
    list.appendChild(li);
  });
  document.getElementById("cartTotal").textContent = `R$ ${total.toFixed(2)}`;
localStorage.setItem("checkoutCart", JSON.stringify(cart));
}


function toggleCartModal(forceShow = false) {
  const modal = document.getElementById("cartModal");
  modal.classList.toggle("show", forceShow || !modal.classList.contains("show"));
}

function closeCartModal() {
  document.getElementById("cartModal").classList.remove("show");
}

function populateFilters() {
  const states = [...new Set(products.map(p => p.state))];
  const stateSelect = document.getElementById("stateFilter");
  stateSelect.innerHTML = `<option value="">Todos Estados</option>` + states.map(s => `<option value="${s}">${s}</option>`).join("");

  stateSelect.addEventListener("change", () => {
    const selected = stateSelect.value;
    const cities = [...new Set(products.filter(p => p.state === selected).map(p => p.city))];
    const citySelect = document.getElementById("cityFilter");
    citySelect.innerHTML = `<option value="">Todas Cidades</option>` + cities.map(c => `<option value="${c}">${c}</option>`).join("");
    renderProducts();
  });

  document.getElementById("cityFilter").addEventListener("change", renderProducts);
}

document.getElementById("searchInput")?.addEventListener("input", renderProducts);
window.onload = () => {
  renderProducts();
  populateFilters();
};

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("star")) {
    const productId = e.target.getAttribute("data-id");
    const value = parseInt(e.target.getAttribute("data-value"));

    const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
    if (!ratings[productId]) ratings[productId] = [];
    ratings[productId].push(value);
    localStorage.setItem("ratings", JSON.stringify(ratings));

    renderProducts(); // re-render para atualizar as estrelas
  }
});

function renderStars(productId) {
  const ratings = JSON.parse(localStorage.getItem("ratings") || "{}");
  const productRatings = ratings[productId] || [];
  const avg = productRatings.length
    ? productRatings.reduce((a, b) => a + b, 0) / productRatings.length
    : 0;

  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<span class="star" data-id="${productId}" data-value="${i}">${i <= avg ? "★" : "☆"}</span>`;
  }
  return starsHtml + ` <small>(${productRatings.length})</small>`;
}


