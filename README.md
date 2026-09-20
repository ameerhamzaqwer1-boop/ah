# AH Kitchen Appliances — Website Setup Guide

Ye website free mein GitHub Pages (hosting) + Supabase (database) ke sath chalti hai.

## Website ka structure
```
index.html        → Home page (hero, trending, categories, products)
product.html       → Single product ki detail page
admin.html          → Chupa hua owner login + product manage karne ka panel
css/style.css       → Poori website ki styling
js/supabaseClient.js → Yahan apni Supabase keys daalni hain
js/main.js          → Home page ki logic
js/product.js        → Product detail page ki logic
js/admin.js          → Admin panel ki logic
assets/logo.png      → Aapka store logo
assets/images/       → Starting 4 products ki tasveerein
supabase-schema.sql  → Database banane ka SQL code
```

---

## Step 1 — Supabase Account banayein (Database ke liye)

1. [supabase.com](https://supabase.com) per jayein aur free account banayein.
2. **New Project** banayein (koi bhi naam de dein, region "Asia" rakhein).
3. Project ban jane ke baad, left menu mein **SQL Editor** kholein.
4. Is repo ki `supabase-schema.sql` file kholein, poora code copy karein, SQL Editor mein paste karke **Run** dabayein.
   - Ye aapke liye `products` table bana dega
   - Security rules (RLS) set kar dega (sirf logged-in owner hi add/edit/delete kar sakega, baaki sab sirf dekh sakenge)
   - 4 starter products (pressure cooker, sandwich maker, iron, air fryer) bhi add kar dega

## Step 2 — Owner Login Account banayein

1. Supabase Dashboard mein left menu se **Authentication → Users** kholein.
2. **Add User** per click karein.
3. Ye email aur password daalein (ye aapka login hoga `admin.html` ke liye):
   - Email: `ameerhamzaqwer1@gmail.com`
   - Password: `@Ah882008`
4. **Auto Confirm User** ka option ON rakhein taake email verify karne ki zaroorat na pare.

> ⚠️ Ye password sirf Supabase Dashboard mein set hota hai — kisi bhi website file mein ye kahin nahi likha hua, is liye GitHub par publicly nazar nahi aayega. Login screen par sirf email field pehle se bhari hui hai taake aap sirf password type karein.

## Step 3 — Apni Supabase Keys website mein daalein

1. Supabase Dashboard mein **Project Settings → API** kholein.
2. Wahan se **Project URL** aur **anon public key** copy karein.
3. `js/supabaseClient.js` file kholein aur ye do lines update karein:

```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJI....";
```

4. File save karein.

> ⚠️ Anon key public hoti hai aur website mein daalna safe hai — ye sirf wahi kaam karne deti hai jo aapne RLS rules mein allow kiya hai. Asli security RLS policies (jo hum ne SQL mein set ki) se aati hai.

## Step 4 — Website ko GitHub par upload karein (Free Hosting)

1. [github.com](https://github.com) par free account banayein.
2. Naya repository banayein, naam dein jaise `ah-kitchen-appliances`.
3. Is poore folder (`index.html`, `css/`, `js/`, `assets/` waghera) ko us repository mein upload kar dein.
   - GitHub website se "Add file → Upload files" se drag & drop kar sakte hain, ya `git` command line se push kar sakte hain.
4. Repository ki **Settings → Pages** mein jayein.
5. "Branch" mein `main` select karein, folder `/ (root)` rakhein, aur **Save** dabayein.
6. Kuch minute baad aapki website is link par live ho jayegi:
   `https://your-username.github.io/ah-kitchen-appliances/`

## Step 5 — Apna WhatsApp number check karein

`js/supabaseClient.js` mein ye line already set hai:
```js
const WHATSAPP_NUMBER = "923019088013";
```
Ye aapka number hai (+92 301 9088013) — agar number change karna ho to yahan update kar dein (country code ke sath, `+` ke bagair).

## Step 6 — Owner Login kahan hai?

Website ke bilkul neeche (footer) mein, copyright line ke sath ek chota sa **"•"** (dot) hai — wahi aapka hidden login link hai. Usse click karke `admin.html` par jayein, apna email/password daal kar login karein.

Admin panel se aap:
- Naye products **Add** kar sakte hain (naam, price, description, category, image, aur trending on/off)
- Purane products **Edit** kar sakte hain
- Products **Delete** kar sakte hain

Naye product ki image ke liye:
- Ya to image ko `assets/images/` folder mein GitHub repo par upload karein aur path likhein jaise `assets/images/naya-product.jpg`
- Ya kisi bhi image hosting (jaise Supabase Storage, imgur) ka full `https://` link paste kar dein

## Noti — Demo Products

Jab tak Supabase set up nahi hota, website apne aap 4 demo products (pressure cooker, sandwich maker, iron, air fryer) dikhati hai taake website khaali na lage. Supabase set up hote hi, aapke asal products automatically show honge.

---

Koi bhi masla ho to Supabase ke error message copy kar ke dekhein — zyada tar masle URL/Key ghalat hone ya SQL run na hone ki wajah se hote hain.
