This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Local database (MS SQL Server in Docker)

The catalog and write paths are backed by SQL Server running in Docker.

### One-time setup

1. Copy `.env.example` to `.env.docker` and `.env.local`. Set a strong `MSSQL_SA_PASSWORD` (≥8 chars, upper+lower+digit+symbol). Use the same password in both files' `DATABASE_URL` / `MSSQL_SA_PASSWORD`.
2. `npm run db:up` — starts SQL Server in Docker. Wait for `healthy`.
3. Create the `eighty_five_eleven` database:
   ```powershell
   docker exec eighty-five-eleven-mssql /opt/mssql-tools18/bin/sqlcmd `
     -S localhost -U sa -P "$env:MSSQL_SA_PASSWORD" -C `
     -Q "CREATE DATABASE eighty_five_eleven"
   ```
4. `npm run db:migrate` — apply all migrations.
5. `npm run db:seed` — load brands, products, variants, mock users/orders.

### Daily workflow

```
npm run db:up      # start DB
npm run dev        # start Next.js
# ... work ...
npm run db:down    # stop DB (data persists in the docker volume)
```

### Useful commands

- `npm run db:studio` — open Prisma Studio (browser table viewer) on localhost:5555
- `npm run db:reset` — drop and recreate all tables, then re-seed (destructive)

### Knowledge base

`data/kb.json` stays as the RAG corpus. It is **not** in SQL — embeddings are built from this file by `scripts/embed.ts`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
