# Inventory Management System

A web-based inventory system for managing stock, purchase orders, and supply issuance

---

## Stack

Next.js 16 · Prisma · PostgreSQL (Supabase) · Tailwind CSS · shadcn/ui · Recharts · Custom JWT Auth

## What it does

- Manage inventory items with category filtering and stock status
- Create and track purchase orders (pending → approved → received)
- Issue stock to departments — single or bulk, with printable receipts
- Log all stock movements (inbound, outbound, adjustments) with audit trail
- Reports page with date range filter, movement chart, and top issued items
- Custom JWT authentication — no third-party auth library

## Running locally

```bash
npm install
# add DATABASE_URL and JWT_SECRET to .env
npx prisma db push
npm run seed
npm run dev
```
