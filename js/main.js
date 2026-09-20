// ================= Demo / Fallback Products =================
// Jab tak Supabase set up nahi hota (ya table khali hai), ye demo products dikhengay
// taake website turant achi lage. Supabase configure hone ke baad, Admin Panel se
// jo products add karenge wahi yahan show hongay.
const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Super National Pressure Cooker 13L",
    description: "Long-lasting durability, high quality pressure control, improved safety valve system, aur specially designed for desi kitchens. Suitable for all cooktops including gas, induction aur electric.",
    price: 6500,
    image_url: "assets/images/pressure-cooker.jpg",
    category: "Cookware",
    trending: true
  },
  {
    id: "demo-2",
    name: "Kolax Electric Sandwich Maker KSM-12",
    description: "Non-stick plates, cool touch handle, power indicator aur compact design. 4-slice capacity — crispy, healthy aur delicious sandwiches har roz.",
    price: 3200,
    image_url: "assets/images/sandwich-maker.jpg",
    category: "Kitchen Appliances",
    trending: true
  },
  {
    id: "demo-3",
    name: "Panasonic Dry Iron NI-100DX",
    description: "Made in Japan. Lightweight, easy to use, durable body aur fast heating — 1000W powerful performance ke sath. Simple, reliable aur efficient.",
    price: 2800,
    image_url: "assets/images/dry-iron.jpg",
    category: "Ironing",
    trending: true
  },
  {
    id: "demo-4",
    name: "RAF Air Fryer 4.5L — R.510",
    description: "Adjustable temperature 80°C–200°C, timer control up to 60 minutes, 4.5 liter large capacity aur easy to clean non-stick basket. Healthy cooking with less oil.",
    price: 8900,
    image_url: "assets/images/air-fryer.jpg",
    category: "Kitchen Appliances",
    trending: true
  }
];

let ALL_PRODUCTS = [];
let ACTIVE_CATEGORY = "All";
let ACTIVE_SEARCH = "";

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- WhatsApp links ----------
function waLink(message) {
  const text = encodeURIComponent(message || "Hi! Mujhe AH Kitchen Appliances ke products ke baare mein maloomat chahiye.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
["headerWaBtn", "heroWaBtn", "waFloat"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = waLink();
});

// ---------- Fetch products ----------
async function fetchProducts() {
  try {
    if (SUPABASE_URL.includes("PASTE_YOUR")) throw new Error("Supabase not configured yet");
    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("No products in database yet");
    ALL_PRODUCTS = data;
  } catch (err) {
    console.warn("Supabase products load failed, showing demo products:", err.message);
    ALL_PRODUCTS = DEMO_PRODUCTS;
  }
  renderTrending();
  renderCategories();
  renderProducts();
}

// ---------- Trending carousel ----------
function renderTrending() {
  const track = document.getElementById("trendingTrack");
  const trending = ALL_PRODUCTS.filter(p => p.trending);
  const list = trending.length ? trending : ALL_PRODUCTS.slice(0, 4);
  track.innerHTML = list.map(p => `
    <div class="trend-card" onclick="goToProduct('${p.id}')">
      <div class="img-wrap"><img src="${p.image_url}" alt="${escapeHtml(p.name)}" loading="lazy" /></div>
      <div class="info">
        <span class="badge">Trending</span>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">Rs. ${Number(p.price || 0).toLocaleString()}</div>
      </div>
    </div>
  `).join("");
}

document.getElementById("prevBtn").addEventListener("click", () => {
  document.getElementById("trendingTrack").scrollBy({ left: -280, behavior: "smooth" });
});
document.getElementById("nextBtn").addEventListener("click", () => {
  document.getElementById("trendingTrack").scrollBy({ left: 280, behavior: "smooth" });
});

// ---------- Categories ----------
function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  const cats = ["All", ...new Set(ALL_PRODUCTS.map(p => p.category).filter(Boolean))];
  const icons = { "All": "🛍️", "Cookware": "🍲", "Kitchen Appliances": "🔌", "Ironing": "👔" };
  grid.innerHTML = cats.map(c => `
    <div class="category-card ${c === ACTIVE_CATEGORY ? "active" : ""}" onclick="selectCategory('${c.replace(/'/g, "\\'")}')">
      <div class="emoji">${icons[c] || "🧺"}</div>
      <h4>${escapeHtml(c)}</h4>
    </div>
  `).join("");
}

function selectCategory(cat) {
  ACTIVE_CATEGORY = cat;
  renderCategories();
  renderProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// ---------- Product grid ----------
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const sub = document.getElementById("productsSub");
  let list = ALL_PRODUCTS;
  if (ACTIVE_CATEGORY !== "All") list = list.filter(p => p.category === ACTIVE_CATEGORY);
  if (ACTIVE_SEARCH) {
    const q = ACTIVE_SEARCH.toLowerCase();
    list = list.filter(p => (p.name || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
  }
  sub.textContent = ACTIVE_CATEGORY === "All" ? "Hamari poori range dekhein" : `Category: ${ACTIVE_CATEGORY}`;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">Koi product nahi mila. Kuch aur search karein ya category badlein.</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="goToProduct('${p.id}')">
      <div class="img-wrap"><img src="${p.image_url}" alt="${escapeHtml(p.name)}" loading="lazy" /></div>
      <div class="info">
        <span class="cat-tag">${escapeHtml(p.category || "")}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="desc">${escapeHtml((p.description || "").slice(0, 70))}${(p.description || "").length > 70 ? "…" : ""}</p>
        <div class="row">
          <span class="price">Rs. ${Number(p.price || 0).toLocaleString()}</span>
          <span class="btn btn-outline" style="padding:6px 14px;font-size:0.78rem;">View →</span>
        </div>
      </div>
    </div>
  `).join("");
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  ACTIVE_SEARCH = e.target.value.trim();
  renderProducts();
});

// ---------- Navigation ----------
function goToProduct(id) {
  sessionStorage.setItem("ah_products_cache", JSON.stringify(ALL_PRODUCTS));
  window.location.href = `product.html?id=${encodeURIComponent(id)}`;
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

fetchProducts();
