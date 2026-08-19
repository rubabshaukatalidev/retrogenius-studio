# Deploying Scriptorium

The app is a TanStack Start (SSR) project built with Vite + Nitro, so it needs a host
that can run server code — a plain static host will not work.

## Environment variables

Set these on whichever host you use (values are in `.env`):

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_PROJECT_ID
LOVABLE_API_KEY        # required for AI assignment generation
```

## Option 1 — Lovable (easiest, zero config)

Click **Publish** in Lovable. Backend, AI gateway and env vars are already wired.

## Option 2 — GitHub

In Lovable, open **GitHub → Connect** and every change is pushed to your repo.
The repo alone is not a live site; connect it to one of the hosts below.

## Option 3 — Netlify

1. Push the repo to GitHub (see above).
2. In Netlify: **Add new site → Import an existing project** and pick the repo.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/client`
4. Add a `netlify.toml` at the repo root:

```toml
[build]
  command = "npm run build"
  publish = "dist/client"

[build.environment]
  NITRO_PRESET = "netlify"
```

5. Add all environment variables above in **Site settings → Environment variables**.
6. Deploy. Netlify runs the SSR output as a Netlify Function automatically.

## Option 4 — Cloudflare Workers (default preset)

```sh
npm run build
npx wrangler deploy   # uses the generated dist/server/wrangler.json
```

Add the env vars as Worker secrets: `npx wrangler secret put LOVABLE_API_KEY` etc.

## Option 5 — Vercel

Import the GitHub repo, set `NITRO_PRESET=vercel`, keep the default build command,
and add the env vars. Vercel detects the Nitro output automatically.

## Notes

- Videos and images are served from the Lovable CDN (`/__l5e/assets-v1/...`), so they
  keep working on any host without extra storage setup.
- The database, auth and AI generation stay on Lovable Cloud regardless of host.
