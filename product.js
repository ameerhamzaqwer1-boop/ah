document.getElementById("year").textContent = new Date().getFullYear();

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function waLink(message) {
  const text = encodeURIComponent(message || "Hi! Mujhe AH Kitchen Appliances ke products ke baare mein maloomat chahiye.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
document.getElementById("headerWaBtn").href = waLink();
document.getElementById("waFloat").href = waLink();

const DEMO_PRODUCTS = [
  { id: "demo-1", name: "Super National Pressure Cooker 13L", description: "Long-lasting durability, high quality pressure control, improved safety valve system, aur specially designed for desi kitchens. Suitable for all cooktops including gas, induction aur electric.\n\nSpecial features: Innovative safety device for extra protection, prevents excess pressure, aur cook safe & fast.", price: 6500, image_url: "assets/images/pressure-cooker.jpg", category: "Cookware" },
  { id: "demo-2", name: "Kolax Electric Sandwich Maker KSM-12", description: "Non-stick plates, cool touch handle, power indicator aur compact design. 4-slice capacity — crispy, healthy aur delicious sandwiches har roz.\n\nEasy to clean aur space-saving compact design, roz mara istemal ke liye perfect.", price: 3200, image_url: "assets/images/sandwich-maker.jpg", category: "Kitchen Appliances" },
  { id: "demo-3", name: "Panasonic Dry Iron NI-100DX", description: "Made in Japan. Lightweight, easy to use, durable body aur fast heating — 1000W powerful performance ke sath.\n\nSimple operation, long lasting performance, aur minutes mein ready ho jata hai.", price: 2800, image_url: "assets/images/dry-iron.jpg", category: "Ironing" },
  { id: "demo-4", name: "RAF Air Fryer 4.5L — R.510", description: "Adjustable temperature 80°C–200°C, timer control up to 60 minutes, 4.5 liter large capacity aur easy to clean non-stick basket.\n\nHealthy cooking with less oil — fries, wings aur bohat kuch bina zyada tel ke.", price: 8900, image_url: "assets/images/air-fryer.jpg", category: "Kitchen Appliances" }
];

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("detailContainer");

  if (!id) {
    container.innerHTML = `<div class="empty-state">Product nahi mila.</div>`;
    return;
  }

  let product = null;

  // 1. Try Supabase directly
  try {
    if (!SUPABASE_URL.includes("PASTE_YOUR")) {
      const { data, error } = await supabaseClient.from("products").select("*").eq("id", id).single();
      if (!error && data) product = data;
    }
  } catch (e) { /* fall through */ }

  // 2. Try session cache (set by index.html when navigating)
  if (!product) {
    try {
      const cache = JSON.parse(sessionStorage.getItem("ah_products_cache") || "[]");
      product = cache.find(p => String(p.id) === String(id));
    } catch (e) { /* ignore */ }
  }

  // 3. Fallback to demo products
  if (!product) product = DEMO_PRODUCTS.find(p => p.id === id);

  if (!product) {
    container.innerHTML = `<div class="empty-state">Ye product nahi mila. Shayad remove ho gaya ho.</div>`;
    return;
  }

  document.title = `${product.name} — AH Kitchen Appliances`;

  container.innerHTML = `
    <div class="detail-gallery">
      <img src="${product.image_url}" alt="${escapeHtml(product.name)}" />
    </div>
    <div class="detail-info">
      <span class="cat-tag">${escapeHtml(product.category || "")}</span>
      <h1>${escapeHtml(product.name)}</h1>
      <div class="price">Rs. ${Number(product.price || 0).toLocaleString()}</div>
      <p class="desc">${escapeHtml(product.description || "Details jald add ki jayengi.")}</p>
      <div class="detail-actions">
        <a class="btn btn-whatsapp" target="_blank" rel="noopener"
           href="${waLink(`Hi! Mujhe "${product.name}" order karna hai (Price: Rs. ${Number(product.price || 0).toLocaleString()}). Please details bataiye.`)}">
          💬 Order on WhatsApp
        </a>
        <a class="btn btn-outline" href="index.html">← More Products</a>
      </div>
    </div>
  `;
}

loadProduct();
