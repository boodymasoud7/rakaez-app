# Rakaez Real Estate

Next.js 16 + next-intl bilingual (EN/AR) marketing site with a built-in admin panel.

> **Architecture:** No database, no Supabase. All site content lives as JSON in
> `/content` and gets committed back to the repo by the admin panel via the
> GitHub API. Auth uses [`iron-session`](https://github.com/vvo/iron-session) with
> bcrypt-hashed credentials read from an env var. Contact-form submissions are
> emailed via [Resend](https://resend.com).

---

## 1. First-time setup

```bash
npm install
cp .env.example .env.local
```

Then fill in `.env.local`. The two values you must provide for the app to start are:

```bash
# 1. A 32+ char random session secret
npm run generate-secret
# → copy the output into SESSION_SECRET

# 2. At least one admin user (email + bcrypt hash)
npm run hash-password "MyStrongPass123"
# → paste the suggested ADMIN_USERS line into .env.local
```

In **development**, content writes go to local files in `/content` and
`/public/uploads`. Just run `npm run dev` and edit at `http://localhost:3000`.

---

## 2. Production deployment (Vercel / Netlify / Cloudflare Pages)

The admin panel commits content back to the repo, so you need a GitHub token
plus a hosting provider that re-deploys on push.

### Required env vars in production

| Var               | Purpose                                                         |
| ----------------- | --------------------------------------------------------------- |
| `SESSION_SECRET`  | 32+ char random string (encrypts the admin cookie)              |
| `ADMIN_USERS`     | JSON array of `{email, passwordHash, name?, role?}`             |
| `GITHUB_TOKEN`    | Personal access token with `repo` (Contents: read & write)      |
| `GITHUB_REPO`     | `owner/repo`, e.g. `rakaez/rakaez-app`                          |
| `GITHUB_BRANCH`   | Branch to commit to (default: `main`)                           |
| `RESEND_API_KEY`  | API key from https://resend.com                                 |
| `NOTIFY_EMAIL`    | Where contact-form messages are sent                            |
| `NOTIFY_FROM`     | "From" address (must be a verified Resend domain)               |
| `SITE_URL`        | Public canonical URL (used in `sitemap.xml`)                    |

When `GITHUB_TOKEN` + `GITHUB_REPO` are set, every save in the admin panel
creates a single commit on the configured branch. The site re-deploys
automatically and the new content goes live within ~30 seconds.

### Recommended GitHub token scope

Use a [fine-grained PAT](https://github.com/settings/personal-access-tokens/new)
limited to the rakaez-app repo, with **Contents: Read & write** permission.

---

## 3. Migrating from Supabase (one-time)

If you have an existing Supabase database, dump it to local JSON:

```bash
# In .env.local, temporarily add the old Supabase creds:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Optional: also pull every image into public/uploads/migrated/
npm run migrate-from-supabase -- --download-images
# Or just copy the URLs as-is:
npm run migrate-from-supabase
```

The script writes:

- `content/projects.json`
- `content/blog.json`
- `content/services.json`
- `content/faq.json`
- `content/settings.json`
- `content/seo.json`

After verifying the data, commit the `content/` folder and the new images.

---

## 4. Daily admin workflow

1. Sign in at `/<locale>/admin/login` with one of the `ADMIN_USERS`.
2. Edit content. Saving:
   - **Dev:** writes JSON to local `/content/*.json` immediately.
   - **Prod:** commits to GitHub; live site updates after the redeploy (~30s).
3. To add another admin user, generate a hash and append to `ADMIN_USERS`,
   then redeploy. Full instructions live at `/<locale>/admin/users`.

---

## 5. Project layout

```
content/                Site content as JSON (commit this folder!)
public/uploads/         Images and PDFs uploaded via the admin panel
src/app/api/auth        Login / logout / "me"
src/app/api/admin       Authenticated content & media APIs
src/app/api/public      Public read-only endpoints used by the site
src/app/api/notify      Contact-form → Resend
src/lib/auth            iron-session + bcrypt user store
src/lib/content         JSON reader / writer (local fs or GitHub)
src/lib/admin-api.ts    Thin client wrapper used by admin pages
scripts/                Helpers: hash-password, generate-secret, migrate
```

---

## 6. Useful npm scripts

```bash
npm run dev                    # local dev
npm run build                  # production build
npm run start                  # serve production build
npm run lint                   # eslint
npm run generate-secret        # produce SESSION_SECRET
npm run hash-password "pwd"    # produce a bcrypt hash for ADMIN_USERS
npm run migrate-from-supabase  # one-shot Supabase → JSON dump
```

