# Deployment

This project is configured to deploy as a Next.js frontend app on Vercel, with optional Docker support for container-based hosting.

## Vercel

1. Create a Vercel project and connect this repository.
2. Keep the default framework preset as `Next.js`.
3. Use the included commands from `vercel.json`:
   - Install: `npm ci`
   - Build: `npm run build`
   - Dev: `npm run dev`
4. Add these GitHub repository secrets for CI/CD:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Push to `main` or `master` to deploy production.
6. Open a pull request to create a preview deployment.

You can get the Vercel IDs locally after linking the project:

```bash
npx vercel link
npx vercel env pull .env.local
```

Then copy the values from `.vercel/project.json` into GitHub secrets.

## Docker

Build and run the frontend container:

```bash
docker build -t info-lan-frontend .
docker run --rm -p 3000:3000 info-lan-frontend
```

Or use Docker Compose:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.
