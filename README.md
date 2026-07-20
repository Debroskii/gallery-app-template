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

## Deploying to GitHub Pages (automatic)

This repo includes `.github/workflows/deploy.yml`, which builds the site and deploys
it to GitHub Pages every time you push to `main`.

**One-time setup:**

1. Push this project to a new GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).

That's it — the workflow figures out the correct base path from your repository name
automatically, so the built site's asset URLs work at:

```
https://<your-username>.github.io/<repo-name>/
```

**After the one-time setup**, the whole workflow going forward is just:

```bash
# add new photos
cp ~/Pictures/*.jpg src/images/
git add src/images
git commit -m "Add new photos"
git push
```

The push triggers the Action, which builds the site (auto-discovering the new
images) and republishes it — no manual build or deploy step needed.

## Project structure

```
.
├── src/
│   ├── images/        # drop image files here — this is the whole "database"
│   ├── main.js         # discovers images + renders gallery/lightbox
│   └── style.css
├── index.html
├── vite.config.js       # base path is set via VITE_BASE_PATH env var
└── .github/workflows/deploy.yml   # build + deploy on every push to main
```
