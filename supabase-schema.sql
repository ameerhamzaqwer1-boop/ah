-- ==========================================================
-- AH Kitchen Appliances — Supabase Database Setup
-- Ye poora SQL script Supabase Dashboard -> SQL Editor mein
-- paste karein aur "Run" dabayein.
-- ==========================================================

-- 1. Products table banayein
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric default 0,
  image_url text,
  category text,
  trending boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. Row Level Security (RLS) enable karein
alter table public.products enable row level security;

-- 3. Har koi (public visitors) products ko READ kar sakein
create policy "Public can view products"
on public.products for select
to anon
using (true);

-- 4. Sirf LOGGED IN user (aap, owner) products add/edit/delete kar sakein
create policy "Authenticated users can insert products"
on public.products for insert
to authenticated
with check (true);

create policy "Authenticated users can update products"
on public.products for update
to authenticated
using (true);

create policy "Authenticated users can delete products"
on public.products for delete
to authenticated
using (true);

-- 5. (Optional) Starter/demo products daalne ke liye — chahein to run karein.
-- Ye same 4 products hain jo GitHub repo ke assets/images folder mein maujood hain.
insert into public.products (name, description, price, image_url, category, trending) values
('Super National Pressure Cooker 13L',
 'Long-lasting durability, high quality pressure control, improved safety valve system, aur specially designed for desi kitchens. Suitable for all cooktops including gas, induction aur electric.',
 6500, 'assets/images/pressure-cooker.jpg', 'Cookware', true),

('Kolax Electric Sandwich Maker KSM-12',
 'Non-stick plates, cool touch handle, power indicator aur compact design. 4-slice capacity — crispy, healthy aur delicious sandwiches har roz.',
 3200, 'assets/images/sandwich-maker.jpg', 'Kitchen Appliances', true),

('Panasonic Dry Iron NI-100DX',
 'Made in Japan. Lightweight, easy to use, durable body aur fast heating — 1000W powerful performance ke sath.',
 2800, 'assets/images/dry-iron.jpg', 'Ironing', true),

('RAF Air Fryer 4.5L — R.510',
 'Adjustable temperature 80°C–200°C, timer control up to 60 minutes, 4.5 liter large capacity aur easy to clean non-stick basket. Healthy cooking with less oil.',
 8900, 'assets/images/air-fryer.jpg', 'Kitchen Appliances', true);
