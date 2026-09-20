// ================= SUPABASE CONFIG =================
// Yahan apne Supabase Project ka URL aur ANON PUBLIC KEY daalein.
// Ye aapko Supabase Dashboard -> Project Settings -> API mein milegi.
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE";

// Supabase client (library CDN se index.html/admin.html/product.html mein load hoti hai)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Store settings — inhe aasani se yahan se update kar sakte hain
const STORE_NAME = "AH Kitchen Appliances";
const WHATSAPP_NUMBER = "923019088013"; // country code ke sath, bina + ke
