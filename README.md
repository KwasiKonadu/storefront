# Sales-Point — storefront

Next.js (App Router) + TypeScript, structured with atomic design.

```
npm run dev        # http://localhost:3001 (SalesPoint uses 3000)
npm run build && npm start
npm run typecheck
```
Demo login: `demo@storefront.com` / `Demo1234!` (data lives in browser localStorage).

## Structure
```
src/
  app/                 one thin page.tsx per route — composes templates/organisms, owns no markup
  components/
    atoms/             Button, Input, Icon, Pill, Brand… (no business knowledge)
    molecules/         FormField, QuantityStepper, PriceTag, OrderCard, Toast… (atoms combined)
    organisms/         SiteHeader, ProductCard, CheckoutFlow, CartDrawer, forms… (may use hooks/api)
    templates/         PageContainer, AuthLayout, AccountLayout, ContentPage, SiteLayout
  context/             StoreContext (session, data version) · UIContext (toasts, modal, overlays)
  hooks/               useCart, useCheckout, useWishlist, useRequireUser…
  lib/                 types, config, seed, db, session, format, validation, checkout rules
    api/               the backend seam — swap internals for HTTP calls, UI is unchanged
    content/           FAQ + policy copy
  styles/              tokens/base → atoms → molecules → organisms → templates → responsive
```
Dependency rule: atoms ← molecules ← organisms ← templates ← pages (never upward).
