# Okikiola Electronics Store

A production-ready e-commerce website and admin dashboard for **Okikiola Electronics Store** (brand: OKIKI), based in Ibadan, Nigeria.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Auth:** Clerk
- **Database:** Neon (serverless Postgres) + Drizzle ORM
- **Media:** Cloudinary (signed uploads, auto-optimised delivery)
- **Email:** Nodemailer (SMTP)
- **Payments:** Paystack (Phase 7)
- **Deployment:** Vercel

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd okikistore
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See `.env.example` for descriptions.

**Required for local dev:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — from [clerk.com](https://clerk.com)
- `DATABASE_URL` — Neon pooled connection string
- `DATABASE_URL_UNPOOLED` — Neon direct connection string (for migrations)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from [cloudinary.com](https://cloudinary.com)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — same as `CLOUDINARY_CLOUD_NAME`

### 3. Run database migrations (Phase 2+)

```bash
npm run db:generate   # generate migration files from schema
npm run db:migrate    # apply migrations to Neon
npm run db:studio     # open Drizzle Studio (visual DB browser)
npm run db:seed       # seed sample data (uploads to Cloudinary)
```

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Public storefront (Header, Footer, etc.)
│   ├── (admin)/admin/    # Admin dashboard (Clerk-gated)
│   └── api/              # Route Handlers (Cloudinary sign, search, quotes)
├── components/
│   ├── store/            # Storefront components
│   ├── admin/            # Admin UI components
│   └── ui/               # Primitive UI components (Button, Badge, etc.)
├── db/
│   ├── schema.ts         # Drizzle ORM table definitions
│   ├── index.ts          # Neon + Drizzle client (server-only)
│   └── migrations/       # Generated migration SQL files
├── lib/
│   ├── utils.ts          # cn(), formatPrice(), buildWhatsAppUrl(), etc.
│   ├── cloudinary.ts     # Server-only: signed uploads, URL builder
│   ├── whatsapp.ts       # WhatsApp message formatters
│   ├── data/             # Server-only data access functions
│   ├── actions/          # Next.js Server Actions
│   └── validations/      # Zod schemas
├── types/
│   └── index.ts          # Shared TypeScript types
└── middleware.ts          # Clerk route protection
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations to Neon |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed sample data |

## Build Phases

| Phase | Status | Description |
|---|---|---|
| 0 | ✅ | Design & implementation plan |
| 1 | ✅ | Foundation (this PR) |
| 2 | ⏳ | Database schema & seed |
| 3 | ⏳ | Storefront (home, shop, product pages) |
| 4 | ⏳ | Quotes & WhatsApp handoff |
| 5 | ⏳ | Admin dashboard |
| 6 | ⏳ | Polish & Phase 1 release |
| 7 | ⏳ | Checkout (Paystack) |
| 8 | ⏳ | Orders & reporting |
| 9 | ⏳ | Launch |

## Security Notes

- `DATABASE_URL` is **server-only** — never prefixed with `NEXT_PUBLIC_`
- The browser never talks to the database directly
- Cloudinary uploads use **signed uploads** — the API secret never touches the client
- Every admin route checks Clerk session + the `admins` table on the server
- All inputs are validated with Zod on the server

## Deployment

Push to GitHub and connect to Vercel. Set all environment variables in Vercel project settings.

```bash
git add -A
git commit -m "Phase 1: Foundation"
git push
```
