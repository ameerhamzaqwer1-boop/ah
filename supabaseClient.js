// ================= SUPABASE CONFIG =================
// Yahan apne Supabase Project ka URL aur ANON PUBLIC KEY daalein.
// Ye aapko Supabase Dashboard -> Project Settings -> API mein milegi.
const SUPABASE_URL = "sb_publishable_8FRa39o9f9N1cyncAM7_4A_CofhW0Up";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYm51cnVtZXZwbW9zaXBnbWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzU3ODIsImV4cCI6MjEwNTQ1MTc4Mn0.RgRuAILu_kJ5Zz0H8PVLY-DP0C-cgLu63okotFiFnQs
";

// Supabase client (library CDN se index.html/admin.html/product.html mein load hoti hai)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Store settings — inhe aasani se yahan se update kar sakte hain
const STORE_NAME = "AH Kitchen Appliances";
const WHATSAPP_NUMBER = "923019088013"; // country code ke sath, bina + ke
