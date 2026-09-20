const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginError = document.getElementById("loginError");
let editingId = null;
let PRODUCTS_CACHE = [];

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

function checkConfigured() {
  if (SUPABASE_URL.includes("PASTE_YOUR")) {
    loginScreen.innerHTML = `
      <h2>⚠️ Setup Needed</h2>
      <p style="color:#4a463c;line-height:1.7;font-size:0.92rem;">
        Admin panel abhi kaam nahi karega kyunke Supabase configure nahi hua.<br><br>
        <b>js/supabaseClient.js</b> file kholein aur apna Supabase URL + Anon Key daalein.
        Poori setup guide <b>README.md</b> file mein hai.
      </p>
      <p style="margin-top:16px;"><a href="index.html">← Back to website</a></p>
    `;
    return false;
  }
  return true;
}

// ---------- Auth ----------
async function checkSession() {
  if (!checkConfigured()) return;
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    loginScreen.style.display = "none";
    dashboard.style.display = "block";
    loadProducts();
  } else {
    loginScreen.style.display = "block";
    dashboard.style.display = "none";
  }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  loginError.style.display = "none";
  if (!email || !password) return;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = "Login fail: " + error.message;
    loginError.style.display = "block";
    return;
  }
  checkSession();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  checkSession();
});

// ---------- Load & render products ----------
async function loadProducts() {
  const { data, error } = await supabaseClient.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    showToast("Products load nahi ho sake: " + error.message);
    return;
  }
  PRODUCTS_CACHE = data || [];
  renderTable();
  renderCategorySuggestions();
}

function renderCategorySuggestions() {
  const dl = document.getElementById("categorySuggestions");
  const cats = [...new Set(PRODUCTS_CACHE.map(p => p.category).filter(Boolean))];
  dl.innerHTML = cats.map(c => `<option value="${c}"></option>`).join("");
}

function renderTable() {
  const body = document.getElementById("productsTableBody");
  if (!PRODUCTS_CACHE.length) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#8a8478;">Abhi koi product nahi. Upar form se add karein.</td></tr>`;
    return;
  }
  body.innerHTML = PRODUCTS_CACHE.map(p => `
    <tr>
      <td><img src="${p.image_url || ''}" alt="" /></td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.category || '-')}</td>
      <td>Rs. ${Number(p.price || 0).toLocaleString()}</td>
      <td>${p.trending ? "✅" : "—"}</td>
      <td class="actions">
        <button class="mini-btn edit" onclick="editProduct('${p.id}')">Edit</button>
        <button class="mini-btn danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// ---------- Save (add / update) ----------
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("pName").value.trim();
  const price = parseFloat(document.getElementById("pPrice").value) || 0;
  const category = document.getElementById("pCategory").value.trim();
  const image_url = document.getElementById("pImage").value.trim();
  const description = document.getElementById("pDescription").value.trim();
  const trending = document.getElementById("pTrending").checked;

  if (!name || !image_url) {
    showToast("Product name aur image URL zaroori hain");
    return;
  }

  const payload = { name, price, category, image_url, description, trending };

  let error;
  if (editingId) {
    ({ error } = await supabaseClient.from("products").update(payload).eq("id", editingId));
  } else {
    ({ error } = await supabaseClient.from("products").insert(payload));
  }

  if (error) {
    showToast("Save fail: " + error.message);
    return;
  }

  showToast(editingId ? "Product update ho gaya ✅" : "Product add ho gaya ✅");
  resetForm();
  loadProducts();
});

function editProduct(id) {
  const p = PRODUCTS_CACHE.find(x => String(x.id) === String(id));
  if (!p) return;
  editingId = id;
  document.getElementById("formTitle").textContent = "Edit Product";
  document.getElementById("pName").value = p.name || "";
  document.getElementById("pPrice").value = p.price || "";
  document.getElementById("pCategory").value = p.category || "";
  document.getElementById("pImage").value = p.image_url || "";
  document.getElementById("pDescription").value = p.description || "";
  document.getElementById("pTrending").checked = !!p.trending;
  document.getElementById("cancelEditBtn").style.display = "inline-flex";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("cancelEditBtn").addEventListener("click", resetForm);

function resetForm() {
  editingId = null;
  document.getElementById("formTitle").textContent = "Add New Product";
  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pCategory").value = "";
  document.getElementById("pImage").value = "";
  document.getElementById("pDescription").value = "";
  document.getElementById("pTrending").checked = false;
  document.getElementById("cancelEditBtn").style.display = "none";
}

async function deleteProduct(id) {
  if (!confirm("Kya aap is product ko delete karna chahte hain?")) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    showToast("Delete fail: " + error.message);
    return;
  }
  showToast("Product delete ho gaya 🗑️");
  loadProducts();
}

checkSession();
