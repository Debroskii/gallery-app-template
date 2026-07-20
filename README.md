# gallery-app

A Vite site that turns a folder of images into a static gallery — automatically, with
no manifest file or code changes required — and deploys itself to GitHub Pages on
every push.

## How the automatic gallery works

Drop image files into `src/images/` (jpg, jpeg, png, gif, webp, avif, svg). At build
time `src/main.js` uses Vite's `import.meta.glob` to discover every matching file in
that folder and renders it into the gallery grid, sorted by filename. There's nothing
else to configure — add or remove files and rebuild.

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL. Add/remove images in `src/images/` and refresh.

```bash
npm run build      # outputs the static site to dist/
npm run preview    # serve the production build locally
```

## Deploying to Cloudflare Pages (automatic)

There are two ways to wire this up. Pick one.

### Option A — Cloudflare's native Git integration (simplest, no secrets)

Cloudflare builds and deploys the site itself whenever you push — you don't need
the `.github/workflows/deploy.yml` file at all with this option (feel free to delete
it).

1. Push this project to a new GitHub repository.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com) go to **Workers & Pages
   → Create → Pages → Connect to Git**, and pick this repo.
3. Set the build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save and deploy.

That's it. Every future push to `main` triggers a new build + deploy automatically,
and you get preview deployments on other branches/PRs for free.

### Option B — GitHub Actions + Cloudflare (keeps the deploy step in your repo)

This repo's `.github/workflows/deploy.yml` builds the site in GitHub Actions and
pushes the result to Cloudflare Pages using [`cloudflare/pages-action`](https://github.com/cloudflare/pages-action).
Use this if you want the build/deploy logic version-controlled in the repo, or want
CI checks to run before deploying.

**One-time setup:**

1. Push this project to a new GitHub repository.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** *or*
   **Upload assets**, and create a project named `gallery-app` (or update
   `projectName` in `deploy.yml` to match whatever you name it) — this just
   registers the project once, so the Action has somewhere to deploy to. If you
   already created the project via Option A, you can reuse it (just remove the Git
   connection in the project's settings so it doesn't double-deploy).
3. Get a Cloudflare **API token** (Cloudflare dashboard → My Profile → API Tokens →
   Create Token → use the "Edit Cloudflare Workers" template, which includes Pages
   permissions) and your **Account ID** (right sidebar of any domain overview page).
4. In your GitHub repo, go to **Settings → Secrets and variables → Actions** and add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. Push to `main` (or run the workflow manually from the **Actions** tab).

**After the one-time setup**, the whole workflow going forward is just:

```bash
# add new photos
cp ~/Pictures/*.jpg src/images/
git add src/images
git commit -m "Add new photos"
git push
```

The push triggers the Action, which builds the site (auto-discovering the new
images) and republishes it to your `*.pages.dev` URL (or custom domain) — no manual
build or deploy step needed.

## Project structure

```
.
├── src/
│   ├── images/        # drop image files here — this is the whole "database"
│   ├── main.js         # discovers images + renders gallery/lightbox
│   └── style.css
├── index.html
├── vite.config.js
└── .github/workflows/deploy.yml   # optional — builds + deploys to Cloudflare Pages via GitHub Actions (Option B)
```
