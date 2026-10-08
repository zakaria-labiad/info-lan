# INFO-L@N website and administrator CMS

Next.js 16 application with a localized public site (`/fr`, `/en`) and a fleet-dashboard-style administration area under `/admin`.

## Requirements

- Node.js 22+
- SQLite for local development and integration tests
- PostgreSQL for production
- Resend for password resets, invitations, and contact replies
- Cloudinary for signed media uploads

## Local setup

1. Copy `.env.example` to `.env.local` and replace every placeholder. Use a random `JWT_SECRET` of at least 32 characters.
2. Install dependencies and generate Prisma schemas with `npm ci` and `npm run db:generate`.
3. Prepare, migrate, and seed SQLite:

   ```powershell
   $env:DATABASE_URL='file:./prisma/database/development.db'
   npm run db:prepare:sqlite
   npx prisma migrate deploy --schema prisma/schema.sqlite.prisma
   npm run db:seed
   ```

4. Run `npm run dev`, then open `http://localhost:3000/fr` or `http://localhost:3000/admin`.

The seed is idempotent. It imports the existing bilingual blog/catalog records and creates the first administrator only when the user table is empty. The bootstrap administrator must replace the initial password.

## Required environment variables

- `DATABASE_URL`: `file:` locally; `postgres:` or `postgresql:` in production.
- `JWT_SECRET`, `JWT_ACCESS_TOKEN_EXPIRES_IN`, `JWT_REFRESH_TOKEN_EXPIRES_IN`.
- `PUBLIC_SITE_URL`.
- `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` for the first seed only.
- `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Configure Resend events at `/api/webhooks/resend`; the sender must use a verified domain. Cloudinary uploads are server-signed and restricted to JPG, PNG, WebP, and AVIF images up to 8 MB.

## Database platform

`prisma/schema.application.prisma` is the provider-independent source. `npm run db:sync-schemas` creates the SQLite and PostgreSQL schemas. `npm run db:parity` verifies their models, fields, relations, constraints, and indexes.

Production migration and import:

```bash
npx prisma migrate deploy --schema prisma/schema.postgresql.prisma
npm run db:seed
```

Production fails closed if `DATABASE_URL` is missing or unsupported.

## Verification

```bash
npm run db:parity
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The suite covers validation, permissions, authentication, database parity, editorial readiness, email transitions, client UI contracts, browser smoke paths, and accessibility.

## Deployment

The Docker image runs PostgreSQL migrations before starting Next.js. For Vercel, provision PostgreSQL, configure every production secret, and run the migration plus idempotent seed as a controlled release step. Never use SQLite in production.
