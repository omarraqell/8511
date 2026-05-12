# 8511 Backend Reshape — Database Layer Design

**Date:** 2026-05-12
**Status:** Approved for planning

## Goal

Replace the JSON-file data layer (`data/products.json`) with a real SQL database. Establish a full commerce schema (products, variants, users, carts, orders, services, consignment) and a Dockerized local dev workflow. Knowledge base stays as files for the RAG pipeline.

## Stack decisions

- **Database:** Microsoft SQL Server 2022 (Developer edition) in Docker
- **ORM:** Prisma (`sqlserver` provider)
- **Local runtime:** `docker-compose` with persistent named volume
- **Auth:** Schema only — `User` and `Address` tables exist; no Auth.js / NextAuth wiring in this iteration
- **Knowledge base:** Stays as `data/kb.json` (RAG corpus, not a SQL concern)

## Docker setup

`docker-compose.yml` at repo root:

- Image: `mcr.microsoft.com/mssql/server:2022-latest`
- Container name: `eighty-five-eleven-mssql`
- Ports: `1433:1433`
- Env: `ACCEPT_EULA=Y`, `MSSQL_SA_PASSWORD` (from `.env.docker`), `MSSQL_PID=Developer`
- Volume: named volume `mssql-data` → `/var/opt/mssql`
- Healthcheck via `sqlcmd -Q "SELECT 1"`

`.env.local` (app side, gitignored):
```
DATABASE_URL="sqlserver://localhost:1433;database=eighty_five_eleven;user=sa;password=...;trustServerCertificate=true"
```

`.env.example` committed; `.env.docker` and `.env.local` in `.gitignore`.

New `package.json` scripts:
- `db:up` → `docker compose up -d`
- `db:down` → `docker compose down`
- `db:migrate` → `prisma migrate dev`
- `db:seed` → `tsx scripts/seed.ts`
- `db:studio` → `prisma studio`

## Schema (Prisma models)

### Catalog

```prisma
model Brand {
  id        Int       @id @default(autoincrement())
  slug      String    @unique           // "nike", "adidas", "supreme", "hats"
  name      String
  products  Product[]
}

model Product {
  id           Int       @id @default(autoincrement())
  slug         String    @unique
  name         String
  brandId      Int
  brand        Brand     @relation(fields: [brandId], references: [id])
  description  String                    // NVARCHAR(MAX)
  imageUrl     String
  sourceUrl    String
  basePrice    Decimal?  @db.Decimal(10, 2)
  releaseDate  DateTime?
  createdAt    DateTime  @default(now())
  variants     ProductVariant[]
  images       ProductImage[]
  orderItems   OrderItem[]
  cartItems    CartItem[]
}

model ProductImage {
  id         Int     @id @default(autoincrement())
  productId  Int
  product    Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  url        String
  sortOrder  Int     @default(0)
}

model ProductVariant {
  id         Int       @id @default(autoincrement())
  productId  Int
  product    Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  sizeEu     String                       // "40"-"46" for sneakers, "S/M/L/XL" for apparel, "OS" for hats
  sku        String    @unique
  price      Decimal?  @db.Decimal(10, 2) // overrides Product.basePrice when set
  stock      Int       @default(0)
  cartItems  CartItem[]
  orderItems OrderItem[]
  @@unique([productId, sizeEu])
}
```

### Users & addresses (schema only)

```prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String?                  // null until auth lib is wired
  name          String?
  phone         String?
  createdAt     DateTime  @default(now())
  addresses     Address[]
  carts         Cart[]
  orders        Order[]
  consignments  ConsignmentSubmission[]
  bookings      ServiceBooking[]
}

model Address {
  id        Int    @id @default(autoincrement())
  userId    Int
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  line1     String
  line2     String?
  city      String
  country   String
  postal    String?
  isDefault Boolean @default(false)
  orders    Order[]
}
```

### Cart & orders

```prisma
model Cart {
  id        Int        @id @default(autoincrement())
  userId    Int?
  user      User?      @relation(fields: [userId], references: [id])
  sessionId String?                       // for guest carts
  createdAt DateTime   @default(now())
  items     CartItem[]
}

model CartItem {
  id         Int             @id @default(autoincrement())
  cartId     Int
  cart       Cart            @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId  Int
  product    Product         @relation(fields: [productId], references: [id])
  variantId  Int?
  variant    ProductVariant? @relation(fields: [variantId], references: [id])
  quantity   Int             @default(1)
}

model Order {
  id              Int         @id @default(autoincrement())
  orderNumber     String      @unique     // "8511-000123"
  userId          Int
  user            User        @relation(fields: [userId], references: [id])
  addressId       Int
  address         Address     @relation(fields: [addressId], references: [id])
  status          String      @default("pending") // pending|paid|shipped|delivered|cancelled
  subtotal        Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  createdAt       DateTime    @default(now())
  items           OrderItem[]
}

model OrderItem {
  id         Int             @id @default(autoincrement())
  orderId    Int
  order      Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  Int
  product    Product         @relation(fields: [productId], references: [id])
  variantId  Int?
  variant    ProductVariant? @relation(fields: [variantId], references: [id])
  sizeEu     String?
  unitPrice  Decimal         @db.Decimal(10, 2)   // snapshot at purchase
  quantity   Int
}
```

### Services side

```prisma
model ServiceBooking {
  id           Int      @id @default(autoincrement())
  userId       Int?
  user         User?    @relation(fields: [userId], references: [id])
  serviceKey   String                       // plain string, matches kb.json keys e.g. "svc-restoration"
  contactName  String
  contactEmail String
  contactPhone String?
  notes        String?                      // NVARCHAR(MAX)
  status       String   @default("new")     // new|contacted|in_progress|done|cancelled
  createdAt    DateTime @default(now())
}

model ConsignmentSubmission {
  id            Int      @id @default(autoincrement())
  userId        Int?
  user          User?    @relation(fields: [userId], references: [id])
  productName   String
  brand         String
  sizeEu        String?
  conditionNote String?
  askingPrice   Decimal? @db.Decimal(10, 2)
  imageUrls     String                       // JSON-encoded array, stored as NVARCHAR(MAX)
  status        String   @default("submitted") // submitted|reviewing|accepted|rejected|listed|sold
  createdAt     DateTime @default(now())
}
```

### Design notes

- Stock lives on `ProductVariant`. PDP size buttons map directly: `stock === 0` → disabled.
- Money: `Decimal(10, 2)`. Never `Float`.
- `OrderItem.unitPrice` is a price snapshot — past orders stay accurate if product price changes.
- Guest carts use `sessionId`; on login, convert to a user cart.
- SQL Server's Prisma support has no native `Json` type — JSON-shaped fields (`ConsignmentSubmission.imageUrls`) are `NVARCHAR(MAX)` containing a JSON string. We do not query inside them.
- `ServiceBooking.serviceKey` is a plain string referencing `data/kb.json` keys — no FK.

## Data access layer

**`lib/db.ts`** — Prisma client singleton (prevents Next.js dev hot-reload from leaking connections):

```ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**`lib/catalog.ts`** rewritten — same exports, Prisma-backed:
- `loadProducts()` → `prisma.product.findMany({ include: { brand, variants, images } })`
- `getProductBySlug(slug)` → `prisma.product.findUnique(...)`
- `loadKB()` stays as-is, still reads `data/kb.json`

**Page changes** — minimal:
- Add `await` where catalog functions are called
- `p.brand` is now `{ slug, name }` — touch ~5 sites that do `BRAND_LABEL[p.brand]` to use `p.brand.slug`
  - `app/page.tsx`, `app/shop/page.tsx`, `app/shop/[brand]/page.tsx`, `app/product/[slug]/page.tsx`, `components/chat/ProductCard.tsx`
- `app/product/[slug]/page.tsx` size buttons render real variants; `stock === 0` → disabled state

**`app/api/products/route.ts`** keeps the same JSON contract for `ProductCard.tsx`.

## New server operations

6 new operations (mechanism — server action vs. route handler — chosen during implementation):

| Operation | Trigger | Mechanism (preferred) |
|---|---|---|
| Add to cart | PDP button | route handler `POST /api/cart` |
| Read cart | Header/cart page | route handler `GET /api/cart` |
| Remove cart item | Cart page | route handler `DELETE /api/cart/:id` |
| Place order | Checkout form | server action |
| Submit consignment | Consignment form | server action |
| Book service | Service form | server action |

UI for these endpoints is out of scope for this spec.

## Seed data (`scripts/seed.ts`)

Idempotent (uses `upsert` on unique keys). Run via `npm run db:seed`.

- **Brands:** 4 — nike, adidas, supreme, hats
- **Products:** ~25 total
  - Nike: 8 (Air Force 1, Dunk Low, Jordan 1/4/11, Air Max 90, Cortez, Vomero)
  - Adidas: 6 (Yeezy 350/700/Slide, Samba, Gazelle, Campus)
  - Supreme: 6 (Box Logo tees, hoodies, jackets)
  - Hats: 5 (caps, beanies)
- **Variants:** ~140 — 7 sizes per sneaker (40–46), 4 per apparel (S/M/L/XL), 1 per hat (OS); randomized stock 0–8 so some sizes show sold out
- **Users:** 4 mock users with addresses in Amman / Riyadh / Dubai
- **Orders:** 6 across mixed statuses (pending, paid, shipped, delivered)
- **Consignment submissions:** 5 across mixed statuses
- **Service bookings:** 4 (restoration, authentication, laundry, custom art)

Existing `data/products.json` content is folded into the seed as the first 3 products. Prices in JOD, descriptions modeled after existing entries.

## Rollout phases

### Phase 1 — Foundation
1. Add `docker-compose.yml`, `.env.example`
2. `npm i -D prisma @prisma/client`
3. `npx prisma init --datasource-provider sqlserver`
4. Write `prisma/schema.prisma`
5. `npm run db:up` → `npm run db:migrate`
6. Verify: Prisma Studio shows empty tables

### Phase 2 — Seed
7. Write `scripts/seed.ts`
8. `npm run db:seed`
9. Verify: Prisma Studio shows populated data

### Phase 3 — Swap reads
10. Rewrite `lib/catalog.ts`
11. Update 5 consumer files (add `await`, switch `p.brand` → `p.brand.slug`)
12. Update `app/api/products/route.ts` to query DB while preserving JSON shape
13. PDP size buttons read variants
14. Verify: shop, brand pages, PDP, chat product cards all render

### Phase 4 — Write paths
15. Implement the 6 server operations
16. Verify: each endpoint inserts rows when called

### Phase 5 — Cleanup
17. Keep `data/products.json` as seed input only; document this in README
18. Add daily dev workflow docs to README

## Out of scope (this spec)

- Cart/checkout/consignment/booking UI pages
- Auth (login/signup flows, password hashing wiring)
- Admin panel
- Payment integration
- Rebuilding the RAG embed pipeline to read from SQL — KB stays as files
- Production deployment of SQL Server

## Acceptance criteria

- `docker compose up` brings the DB online
- `npm run db:migrate && npm run db:seed` creates schema and loads mock data
- `npm run dev` → home, shop, brand pages, and PDPs render from the database
- Chat widget's product cards still work
- Six new write endpoints exist and insert rows when called
- All existing tests still pass
