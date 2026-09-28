# BOWBOX — Kawaii Claymorphism Reskin

Frontend-only visual reskin to the Claymorphism design system (design.md).
Backend/state untouched: Supabase calls, auth, routing, env vars, data
fetching (fetchInventory / supabase.from(...)) and all onClick logic are
exactly as before.

## Run

1. npm install
2. Create .env.local with your real keys:
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
3. npm run dev   (or: npm run build && npm start)

## What changed (visual only)

- components/Tokens.ts — pastel palette: Soft Peach #FDBCB4 (primary),
  Baby Blue #ADD8E6 (secondary), Mint #98FF98 (tertiary), Lilac #E6E6FA
  (neutral). New CLAY_SHADOW / CLAY_SHADOW_PUFF / CLAY_SPRING constants.
  To retheme the whole site, edit ONLY this file.
- app/globals.css — @theme CSS variables + .clay-shadow / .clay-shadow-puff /
  .clay-shadow-dark utilities (outer 4px 4px 8px + inner inset -2px -2px 8px).
- app/page.tsx, app/shop/page.tsx, app/product/page.tsx, app/cart/page.tsx,
  app/wishlist/page.tsx, app/auth/page.tsx, app/profile/page.tsx,
  app/admin/page.tsx — 3-4px borders (darker shade), rounded-2xl/3xl,
  clay double shadows, spring physics (stiffness 120, damping 20),
  hover scale 1.03, press scale+y:2, Georgia serif removed (system sans).
- components/ProductCardSection.tsx, Toast.tsx, FloatingParticles.tsx —
  chunky clay cards, clay toasts, pastel particles.
