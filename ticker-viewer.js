
document.addEventListener("DOMContentLoaded", () => {
  const ticker = document.querySelector(".tibe-ticker");
  const header = document.querySelector(".topbar");

  if (!ticker) return;

  // Keep the photo ticker visible while scrolling
  if (header) {
    const updatePosition = () => {
      ticker.style.position = "sticky";
      ticker.style.top =
        Math.ceil(header.getBoundingClientRect().height) + "px";
      ticker.style.zIndex = "9";
    };

    updatePosition();

    if ("ResizeObserver" in window) {
      new ResizeObserver(updatePosition).observe(header);
    } else {
      window.addEventListener("resize", updatePosition);
    }
  }

  // Create photo viewer
  const viewer = document.createElement("div");
  viewer.className = "tibe-photo-viewer";
  viewer.innerHTML = `
    <button class="viewer-close" aria-label="Close">×</button>
    <button class="viewer-prev" aria-label="Previous photo">‹</button>
    <figure>
      <img class="viewer-image" alt="">
      <figcaption class="viewer-caption"></figcaption>
    </figure>
    <button class="viewer-next" aria-label="Next photo">›</button>
    <p class="viewer-help">Tap outside or press ESC to close</p>
  `;

  document.body.appendChild(viewer);

  const image = viewer.querySelector(".viewer-image");
  const caption = viewer.querySelector(".viewer-caption");
  const track = ticker.querySelector(".ticker-track");

  let photos = [];
  let current = 0;
  let previousFocus = null;

  function collectPhotos() {
    const items = [...ticker.querySelectorAll(".ticker-item")];
    const unique = new Map();

    items.forEach(item => {
      const img = item.querySelector("img");
      if (!img || !img.src) return;

      if (!unique.has(img.src)) {
        unique.set(img.src, {
          src: img.src,
          title: item.textContent.trim(),
          alt: img.alt || "TIBE Studio photo"
        });
      }
    });

    return [...unique.values()];
  }

  function showPhoto(index) {
    if (!photos.length) return;

    current = (index + photos.length) % photos.length;
    const photo = photos[current];

    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.title;
  }

  function openViewer(src) {
    photos = collectPhotos();

    if (!photos.length) return;

    current = photos.findIndex(photo => photo.src === src);
    if (current < 0) current = 0;

    previousFocus = document.activeElement;
    showPhoto(current);

    viewer.classList.add("viewer-open");
    document.body.classList.add("viewer-active");

    if (track) track.style.animationPlayState = "paused";

    viewer.querySelector(".viewer-close").focus();
  }

  function closeViewer() {
    viewer.classList.remove("viewer-open");
    document.body.classList.remove("viewer-active");

    if (track) track.style.animationPlayState = "";

    if (previousFocus) previousFocus.focus();
  }

  // Open a photo when it is tapped
  ticker.addEventListener("click", event => {
    const item = event.target.closest(".ticker-item");
    if (!item) return;

    const img = item.querySelector("img");
    if (!img) return;

    event.preventDefault();
    openViewer(img.src);
  });

  viewer.querySelector(".viewer-close")
    .addEventListener("click", closeViewer);

  viewer.querySelector(".viewer-prev")
    .addEventListener("click", () => showPhoto(current - 1));

  viewer.querySelector(".viewer-next")
    .addEventListener("click", () => showPhoto(current + 1));

  viewer.addEventListener("click", event => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener("keydown", event => {
    if (!viewer.classList.contains("viewer-open")) return;

    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft") showPhoto(current - 1);
    if (event.key === "ArrowRight") showPhoto(current + 1);
  });
});

// Photo viewer design
const viewerStyle = document.createElement("style");

viewerStyle.textContent = `
.tibe-photo-viewer {
  position: fixed;
  inset: 0;
  z-index: 100002;
  background: rgba(0,0,0,.95);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 65px 60px;
  backdrop-filter: blur(10px);
}

.tibe-photo-viewer.viewer-open {
  display: flex;
}

.tibe-photo-viewer figure {
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  text-align: center;
}

.viewer-image {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 160px);
  width: auto;
  height: auto;
  object-fit: contain;
  border: 1px solid #d6ad62;
  box-shadow: 0 15px 60px #000;
}

.viewer-caption {
  color: #f5f0e7;
  margin-top: 14px;
  font-size: 14px;
}

.viewer-close,
.viewer-prev,
.viewer-next {
  position: absolute;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid #d6ad62;
  background: #17130e;
  color: #d6ad62;
  font-size: 32px;
  cursor: pointer;
}

.viewer-close {
  top: 18px;
  right: 18px;
}

.viewer-prev {
  left: 12px;
  top: 50%;
}

.viewer-next {
  right: 12px;
  top: 50%;
}

.viewer-help {
  position: absolute;
  bottom: 12px;
  color: #aaa39a;
  font-size: 11px;
}

body.viewer-active {
  overflow: hidden;
}

@media(max-width:600px) {
  .tibe-photo-viewer {
    padding: 60px 42px;
  }

  .viewer-image {
    max-height: calc(100vh - 150px);
  }

  .viewer-close,
  .viewer-prev,
  .viewer-next {
    width: 38px;
    height: 38px;
    font-size: 27px;
  }
}
`;

document.head.appendChild(viewerStyle);
