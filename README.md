# Supplier Portal Final

Portal modern untuk order Kanban, supplier planning, receiving, force close PO, notification email, forecast upload, daily control, dan monthly performance report.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL / Supabase / Neon
- Resend email
- Vercel deploy ready

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

## Deploy Vercel
1. Push repo ke GitHub.
2. Import project ke Vercel.
3. Set ENV dari `.env.example`.
4. Deploy.

## Main Menu
- Login
- Dashboard
- Orders
- Manual Order
- Receiving
- Suppliers
- Kanban Master
- Calendar
- Forecast Upload
- Daily Control Report
- Monthly Performance Report

## Default Admin (seed)
```bash
npx prisma db push
npm run seed
```
Email: `admin@fii.local`
Password: `admin123`
