
document.addEventListener("DOMContentLoaded", () => {
  const db = window.supabaseClient;
  const serviceCards = document.querySelectorAll(".service-card");

  const categories = [
    { name: "Photography", keys: ["Photography", "Portrait", "Family"] },
    { name: "Video production", keys: ["Video production", "Video"] },
    { name: "Photo editing", keys: ["Photo editing", "Photo Editing"] },
    { name: "Passport photos", keys: ["Passport photos", "Passport"] },
    { name: "Birthday photos", keys: ["Birthday photos", "Birthday"] },
    { name: "Wedding coverage", keys: ["Wedding coverage", "Wedding"] }
  ];

  const style = document.createElement("style");
  style.textContent = `
    .service-card {
      cursor:pointer;
      transition:transform .3s,border-color .3s,box-shadow .3s;
    }
    .service-card:hover {
      transform:translateY(-5px);
      border-color:#d6ad62;
      box-shadow:0 12px 35px #d6ad6230;
    }
    body.tibe-gallery-open { overflow:hidden; }
    .tibe-category-modal,.tibe-photo-lightbox {
      position:fixed;inset:0;z-index:9999;
      display:none;align-items:center;justify-content:center;
      padding:15px;background:#050505ed;
      backdrop-filter:blur(12px);
    }
    .tibe-category-modal.open,.tibe-photo-lightbox.open {
      display:flex;animation:tibeFade .3s ease;
    }
    .tibe-category-panel {
      width:min(100%,1000px);max-height:92vh;overflow:auto;
      background:#111;border:1px solid #8b6b3c;
      border-radius:15px;padding:20px;
      animation:tibeEnter .45s ease;
    }
    .tibe-category-head {
      display:flex;align-items:center;
      justify-content:space-between;gap:12px;
    }
    .tibe-category-head h2 {
      color:#f5f0e7;font-size:27px;margin:0;
    }
    .tibe-close {
      width:42px;height:42px;border-radius:50%;
      background:#191510;color:#e5c17a;
      border:1px solid #b18a4b;font-size:25px;
      cursor:pointer;
    }
    .tibe-intro {
      text-align:center;padding:25px 10px;
    }
    .tibe-intro strong {
      display:block;font: bold 55px Georgia,serif;
      letter-spacing:12px;color:#d6ad62;
      text-shadow:0 0 25px #d6ad6270;
    }
    .tibe-intro small {
      color:#c8b18a;letter-spacing:4px;
    }
    .tibe-intro.play { animation:tibeReveal 1s ease; }
    .tibe-gallery-status {
      color:#d6ad62;text-align:center;
      min-height:25px;
    }
    .tibe-category-grid {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
    }
    .tibe-photo-card {
      display:block;padding:0;overflow:hidden;
      border:1px solid #342b20;border-radius:10px;
      background:#181818;color:#eee;
      text-align:left;cursor:pointer;
    }
    .tibe-photo-card:hover { border-color:#d6ad62; }
    .tibe-photo-card img {
      display:block;width:100%;height:220px;
      object-fit:cover;background:#080808;
    }
    .tibe-photo-card span {
      display:block;padding:12px;font-size:14px;
    }
    .tibe-photo-lightbox { z-index:10000; }
    .tibe-photo-lightbox img {
      max-width:94vw;max-height:85vh;
      object-fit:contain;border-radius:8px;
    }
    .tibe-photo-lightbox .tibe-close {
      position:absolute;top:18px;right:18px;
    }
    @keyframes tibeFade {
      from {opacity:0} to {opacity:1}
    }
    @keyframes tibeEnter {
      from {opacity:0;transform:translateY(25px) scale(.97)}
      to {opacity:1;transform:translateY(0) scale(1)}
    }
    @keyframes tibeReveal {
      0% {opacity:0;transform:scale(.7);filter:blur(8px)}
      60% {opacity:1;transform:scale(1.08);filter:none}
      100% {transform:scale(1)}
    }
    @media(max-width:700px) {
      .tibe-category-grid {
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .tibe-photo-card img {height:165px}
      .tibe-category-panel {padding:14px}
    }
    @media(max-width:380px) {
      .tibe-category-grid {grid-template-columns:1fr}
      .tibe-photo-card img {height:220px}
    }
    @media(prefers-reduced-motion:reduce) {
      .tibe-category-modal.open,.tibe-intro.play {
        animation:none;
      }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "tibe-category-modal";
  modal.innerHTML = `
    <section class="tibe-category-panel" role="dialog"
      aria-modal="true" aria-label="TIBE Photo Gallery">
      <div class="tibe-category-head">
        <h2 id="tibeCategoryTitle">TIBE Gallery</h2>
        <button class="tibe-close" type="button">×</button>
      </div>
      <div class="tibe-intro">
        <div>
          <strong>TIBE</strong>
          <small>PHOTO &amp; VIDEO STUDIO</small>
        </div>
      </div>
      <p class="tibe-gallery-status">Loading gallery...</p>
      <div class="tibe-category-grid"></div>
    </section>
  `;
  document.body.appendChild(modal);

  const lightbox = document.createElement("div");
  lightbox.className = "tibe-photo-lightbox";
  lightbox.innerHTML = `
    <button class="tibe-close" type="button">×</button>
    <img alt="TIBE Studio photo">
  `;
  document.body.appendChild(lightbox);

  const title = modal.querySelector("#tibeCategoryTitle");
  const intro = modal.querySelector(".tibe-intro");
  const status = modal.querySelector(".tibe-gallery-status");
  const grid = modal.querySelector(".tibe-category-grid");
  const photoView = lightbox.querySelector("img");

  const normalize = value =>
    String(value || "").trim().toLowerCase();

  async function openCategory(category) {
    title.textContent = category.name;
    grid.replaceChildren();
    status.textContent = "Loading " + category.name + "...";
    modal.classList.add("open");
    document.body.classList.add("tibe-gallery-open");

    intro.classList.remove("play");
    void intro.offsetWidth;
    intro.classList.add("play");

    if (!db) {
      status.textContent =
        "Gallery connection unavailable. Please refresh.";
      return;
    }

    const { data, error } = await db
      .from("gallery")
      .select("id,title,category,image_url,created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("TIBE Gallery error:", error);
      status.textContent = "Could not load photos. Try again later.";
      return;
    }

    const allowed = category.keys.map(normalize);
    const photos = (data || []).filter(photo =>
      allowed.includes(normalize(photo.category))
    );

    if (!photos.length) {
      status.textContent =
        "New " + category.name + " photos are coming soon.";
      return;
    }

    status.textContent =
      photos.length + (photos.length === 1 ? " photo" : " photos");

    photos.forEach(photo => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "tibe-photo-card";

      const image = document.createElement("img");
      image.src = photo.image_url;
      image.alt = photo.title || category.name;
      image.loading = "lazy";

      const caption = document.createElement("span");
      caption.textContent = photo.title || category.name;

      card.append(image, caption);

      card.addEventListener("click", () => {
        photoView.src = photo.image_url;
        photoView.alt = photo.title || "TIBE Studio photo";
        lightbox.classList.add("open");
      });

      grid.appendChild(card);
    });
  }

  function closeGallery() {
    modal.classList.remove("open");
    document.body.classList.remove("tibe-gallery-open");
  }

  function closePhoto() {
    lightbox.classList.remove("open");
    photoView.removeAttribute("src");
  }

  serviceCards.forEach((card, index) => {
    const category = categories[index];
    if (!category) return;

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", () => openCategory(category));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCategory(category);
      }
    });
  });

  modal.querySelector(".tibe-close")
    .addEventListener("click", closeGallery);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeGallery();
  });

  lightbox.querySelector(".tibe-close")
    .addEventListener("click", closePhoto);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closePhoto();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closePhoto();
      closeGallery();
    }
  });
});
