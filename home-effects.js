document.addEventListener("DOMContentLoaded", () => {
  // TIBE INTRO - unique class names prevent gallery conflicts
  const intro = document.createElement("div");
  intro.className = "tibe-site-intro";
  intro.innerHTML = `
    <div class="tibe-site-logo">T</div>
    <h1>TIBE</h1>
    <p>PHOTO &amp; VIDEO STUDIO</p>
    <span>CAPTURE • CREATE • PRESERVE</span>
  `;
  document.body.prepend(intro);

  // TOP PHOTO TICKER
  const ticker = document.createElement("section");
  ticker.className = "tibe-ticker";
  ticker.setAttribute("aria-label", "TIBE latest photos");
  ticker.innerHTML = `
    <div class="ticker-label">TIBE UPDATES</div>
    <div class="ticker-window">
      <div class="ticker-track">
        <span class="ticker-fallback">Welcome to TIBE Photo &amp; Video Studio • Latest studio work •</span>
      </div>
    </div>
  `;

  const header = document.querySelector(".topbar");
  if (header) header.after(ticker);

  // PHOTO LIGHTBOX FOR TICKER
  const lightbox = document.createElement("div");
  lightbox.className = "tibe-ticker-lightbox";
  lightbox.innerHTML = `
    <button type="button" class="ticker-lightbox-close" aria-label="Close">×</button>
    <img alt="TIBE Studio photo">
    <p></p>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");

  function closePhoto() {
    lightbox.classList.remove("open");
    lightboxImage.removeAttribute("src");
  }

  function openPhoto(photo) {
    lightboxImage.src = photo.image_url;
    lightboxImage.alt = photo.title || "TIBE Studio";
    lightboxCaption.textContent = photo.title || photo.category || "TIBE Studio";
    lightbox.classList.add("open");
  }

  lightbox.querySelector(".ticker-lightbox-close")
    .addEventListener("click", closePhoto);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closePhoto();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePhoto();
  });

  // LOAD PHOTOS FROM SUPABASE
  async function loadTicker() {
    const track = ticker.querySelector(".ticker-track");
    const db = window.supabaseClient;

    if (!db) return;

    const { data, error } = await db
      .from("gallery")
      .select("id,title,category,image_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("TIBE ticker error:", error);
      return;
    }

    if (!data || !data.length) return;

    track.replaceChildren();

    function createItem(photo) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "ticker-item";
      item.setAttribute("aria-label", "View " + (photo.title || "photo"));

      const img = document.createElement("img");
      img.src = photo.image_url;
      img.alt = photo.title || "TIBE Studio";
      img.loading = "lazy";

      const caption = document.createElement("span");
      caption.textContent = (photo.title || "TIBE Studio") +
        " • " + (photo.category || "Latest work");

      item.append(img, caption);
      item.addEventListener("click", () => openPhoto(photo));
      return item;
    }

    data.forEach(photo => track.appendChild(createItem(photo)));
    data.forEach(photo => track.appendChild(createItem(photo)));

    if (data.length === 1) {
      track.style.animation = "none";
    }
  }

  loadTicker();

  // REMOVE INTRO AFTER ANIMATION
  setTimeout(() => {
    intro.classList.add("tibe-site-intro-hidden");
    setTimeout(() => intro.remove(), 850);
  }, 1900);
});

// ALL STYLES
const tibeStyle = document.createElement("style");

tibeStyle.textContent = `
  .tibe-site-intro {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: #080808;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #f5f0e7;
    animation: tibeSiteBackground 1.2s ease;
  }

  .tibe-site-logo {
    width: 75px;
    height: 75px;
    border: 2px solid #d6ad62;
    color: #d6ad62;
    display: grid;
    place-items: center;
    font: bold 48px Georgia;
    animation: tibeSiteLogo 1.1s ease both;
  }

  .tibe-site-intro h1 {
    color: #d6ad62;
    font: bold 48px Georgia;
    letter-spacing: 12px;
    margin: 20px 0 5px;
    animation: tibeSiteText 1s .2s both;
  }

  .tibe-site-intro p {
    font-size: 12px;
    letter-spacing: 5px;
    margin: 5px;
  }

  .tibe-site-intro span {
    color: #aaa39a;
    font-size: 9px;
    letter-spacing: 3px;
    margin-top: 30px;
  }

  .tibe-site-intro-hidden {
    opacity: 0;
    visibility: hidden;
    transition: opacity .8s ease, visibility .8s;
  }

  @keyframes tibeSiteLogo {
    from { transform: scale(.5) rotate(-20deg); opacity: 0; }
    to { transform: scale(1) rotate(0); opacity: 1; }
  }

  @keyframes tibeSiteText {
    from { opacity: 0; letter-spacing: 25px; }
    to { opacity: 1; letter-spacing: 12px; }
  }

  @keyframes tibeSiteBackground {
    from { background: #17110a; }
    to { background: #080808; }
  }

  /* TICKER */
  .tibe-ticker {
    height: 65px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: #15120d;
    border-bottom: 1px solid #594525;
    position: relative;
    z-index: 5;
  }

  .ticker-label {
    flex-shrink: 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 18px;
    background: #d6ad62;
    color: #111;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
  }

  .ticker-window {
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }

  .ticker-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: tibeTickerMove 38s linear infinite;
  }

  .ticker-window:hover .ticker-track {
    animation-play-state: paused;
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 22px;
    border: 0;
    background: transparent;
    color: #f5f0e7;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .ticker-item img {
    width: 42px;
    height: 42px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #d6ad62;
  }

  .ticker-fallback {
    padding: 20px;
    color: #d6ad62;
    white-space: nowrap;
  }

  @keyframes tibeTickerMove {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* TICKER PHOTO VIEWER */
  .tibe-ticker-lightbox {
    position: fixed;
    inset: 0;
    z-index: 100001;
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background: #050505f2;
    backdrop-filter: blur(12px);
  }

  .tibe-ticker-lightbox.open {
    display: flex;
    animation: tibeViewerFade .3s ease;
  }

  .tibe-ticker-lightbox img {
    max-width: 94vw;
    max-height: 78vh;
    object-fit: contain;
    border-radius: 10px;
    border: 1px solid #d6ad62;
  }

  .tibe-ticker-lightbox p {
    color: #d6ad62;
    text-align: center;
  }

  .ticker-lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #191510;
    border: 1px solid #d6ad62;
    color: #d6ad62;
    font-size: 28px;
    cursor: pointer;
  }

  @keyframes tibeViewerFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* SERVICE CARD DESIGN */
  .service-card {
    transition: transform .3s ease,
      border-color .3s ease,
      box-shadow .3s ease;
  }

  .service-card:hover {
    transform: translateY(-6px);
    border-color: #d6ad62;
    box-shadow: 0 12px 30px #d6ad6220;
  }

  @media(max-width:600px) {
    .tibe-ticker { height: 58px; }
    .ticker-label { font-size: 9px; padding: 0 10px; }
    .ticker-item { font-size: 11px; padding: 0 12px; }
    .ticker-item img { width: 34px; height: 34px; }
  }

  @media(prefers-reduced-motion:reduce) {
    .ticker-track { animation: none; }
    .tibe-site-intro { animation: none; }
  }
`;

document.head.appendChild(tibeStyle);
