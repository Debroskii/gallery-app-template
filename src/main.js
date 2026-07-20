import './style.css';

// --- Automatic image discovery -------------------------------------------
// Anything you drop into src/images (jpg, jpeg, png, gif, webp, avif, svg)
// is picked up automatically the next time the site builds — no manifest,
// no config, no manual list to maintain.
const modules = import.meta.glob(
  '/src/images/*.{png,jpg,jpeg,gif,webp,avif,svg,PNG,JPG,JPEG}',
  { eager: true, import: 'default' }
);

const images = Object.entries(modules)
  .map(([path, url]) => ({
    url,
    name: path.split('/').pop(),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

const app = document.getElementById('app');

function pad(n, width = 3) {
  return String(n).padStart(width, '0');
}

function render() {
  if (images.length === 0) {
    app.innerHTML = `
      <div class="header">
        <p class="header__eyebrow">Contact Sheet</p>
        <h1 class="header__title">No frames loaded</h1>
      </div>
      <div class="empty">
        <h2 class="empty__title">Nothing to develop yet</h2>
        <p class="empty__body">
          Drop image files into <code>src/images/</code> and restart the dev
          server (or rebuild) — the gallery generates itself from whatever it
          finds there. Supported formats: jpg, jpeg, png, gif, webp, avif, svg.
        </p>
      </div>
      <div class="footer">gallery-app · builds automatically from src/images</div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="header">
      <p class="header__eyebrow">Contact Sheet</p>
      <h1 class="header__title">Gallery</h1>
      <div class="header__meta">
        <span><span class="count">${pad(images.length)}</span> frames</span>
        <span>generated at build time</span>
      </div>
    </div>
    <div class="gallery">
      ${images
        .map(
          (img, i) => `
        <figure class="frame" data-index="${i}">
          <span class="frame__tag">No. ${pad(i + 1)}</span>
          <img src="${img.url}" alt="${img.name}" loading="lazy" />
        </figure>
      `
        )
        .join('')}
    </div>
    <div class="footer">gallery-app · ${images.length} image${
    images.length === 1 ? '' : 's'
  } · built automatically from src/images</div>
    <div class="lightbox" id="lightbox">
      <button class="lightbox__nav lightbox__nav--prev" id="lb-prev" aria-label="Previous image">&larr;</button>
      <figure class="lightbox__figure">
        <img id="lb-img" src="" alt="" />
        <figcaption class="lightbox__caption">
          <span class="accent" id="lb-index"></span> — <span id="lb-name"></span>
        </figcaption>
      </figure>
      <button class="lightbox__nav lightbox__nav--next" id="lb-next" aria-label="Next image">&rarr;</button>
      <button class="lightbox__close" id="lb-close" aria-label="Close">Esc</button>
    </div>
  `;

  setupLightbox();
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbIndex = document.getElementById('lb-index');
  const lbName = document.getElementById('lb-name');
  let current = 0;

  function open(index) {
    current = index;
    update();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function update() {
    const img = images[current];
    lbImg.src = img.url;
    lbImg.alt = img.name;
    lbIndex.textContent = `No. ${pad(current + 1)}`;
    lbName.textContent = img.name;
  }

  function step(delta) {
    current = (current + delta + images.length) % images.length;
    update();
  }

  document.querySelectorAll('.frame').forEach((frame) => {
    frame.addEventListener('click', () => open(Number(frame.dataset.index)));
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', () => step(-1));
  document.getElementById('lb-next').addEventListener('click', () => step(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

render();
