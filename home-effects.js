
document.addEventListener("DOMContentLoaded", () => {

  // TIBE INTRO ANIMATION
  const intro = document.createElement("div");
  intro.className = "tibe-site-intro";
  intro.innerHTML = `
    <div class="intro-logo">T</div>
    <h1>TIBE</h1>
    <p>PHOTO & VIDEO STUDIO</p>
    <span>CAPTURE • CREATE • PRESERVE</span>
  `;
  document.body.prepend(intro);

  // TOP ANNOUNCEMENT / PHOTO SCROLLER
  const ticker = document.createElement("section");
  ticker.className = "tibe-ticker";
  ticker.setAttribute("aria-label", "Latest studio photos and announcements");
  ticker.innerHTML = `
    <div class="ticker-label">TIBE UPDATES</div>
    <div class="ticker-window">
      <div class="ticker-track">
        <span class="ticker-fallback">
          Welcome to TIBE Photo & Video Studio •
          New photos and studio updates •
        </span>
      </div>
    </div>
  `;

  const header = document.querySelector(".topbar");
  if (header) header.after(ticker);

  // LOAD PUBLISHED GALLERY PHOTOS
  async function loadTicker() {
    const track = ticker.querySelector(".ticker-track");
    const db = window.supabaseClient;

    if (!db) return;

    const { data, error } = await db
      .from("gallery")
      .select("title, category, image_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) return;

    track.replaceChildren();

    const makeItem = (photo) => {
      const item = document.createElement("a");
      item.className = "ticker-item";
      item.href = "#gallery";

      const img = document.createElement("img");
      img.src = photo.image_url;
      img.alt = photo.title || "TIBE Studio";
      img.loading = "lazy";

      const text = document.createElement("span");
      text.textContent =
        (photo.title || "TIBE Studio") +
        " • " +
        (photo.category || "Latest work");

      item.append(img, text);
      return item;
    };

    data.forEach(photo => track.append(makeItem(photo)));

    // Duplicate items for seamless scrolling
    data.forEach(photo => track.append(makeItem(photo)));
  }

  loadTicker();

  // SERVICE CARDS: OPEN BOOKING
  const serviceMap = {
    "Photography": "Photography Session",
    "Video production": "Video Production",
    "Photo editing": "AI Photo Editing",
    "Passport photos": "Passport Photo",
    "Birthday photos": "Birthday Photo Editing",
    "Wedding coverage": "Wedding Photography"
  };

  document.querySelectorAll(".service-card").forEach(card => {
    const heading = card.querySelector("h3");
    const name = heading?.textContent.trim();
    const service = serviceMap[name];

    if (!service) return;

    card.style.cursor = "pointer";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    function selectService() {
      const select = document.getElementById("bookService");
      const booking = document.getElementById("booking");

      if (!select || !booking) return;

      select.value = service;
      booking.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    card.addEventListener("click", selectService);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectService();
      }
    });
  });

  // REMOVE INTRO AFTER ANIMATION
  setTimeout(() => {
    intro.classList.add("intro-hidden");
    setTimeout(() => intro.remove(), 900);
  }, 1900);

});

// ANIMATION STYLES
const animationStyle = document.createElement("style");

animationStyle.textContent = `
.tibe-intro {
  position:fixed;
  inset:0;
  z-index:99999;
  background:#080808;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:#f5f0e7;
  animation:introBackground 1.2s ease;
}

.intro-logo {
  width:75px;
  height:75px;
  border:2px solid #d6ad62;
  color:#d6ad62;
  display:grid;
  place-items:center;
  font:700 48px Georgia;
  animation:logoReveal 1.1s ease both;
}

.tibe-intro h1 {
  color:#d6ad62;
  font:700 48px Georgia;
  letter-spacing:12px;
  margin:20px 0 5px;
  animation:textReveal 1s .2s both;
}

.tibe-intro p {
  font-size:12px;
  letter-spacing:5px;
  margin:5px;
}

.tibe-intro span {
  color:#aaa39a;
  font-size:9px;
  letter-spacing:3px;
  margin-top:30px;
}

.intro-hidden {
  opacity:0;
  visibility:hidden;
  transition:opacity .8s ease, visibility .8s;
}

@keyframes logoReveal {
  from {transform:scale(.5) rotate(-20deg);opacity:0}
  to {transform:scale(1) rotate(0);opacity:1}
}

@keyframes textReveal {
  from {opacity:0;letter-spacing:25px}
  to {opacity:1;letter-spacing:12px}
}

@keyframes introBackground {
  from {background:#17110a}
  to {background:#080808}
}

.tibe-ticker {
  height:65px;
  display:flex;
  align-items:center;
  overflow:hidden;
  background:#15120d;
  border-bottom:1px solid #594525;
  position:relative;
  z-index:5;
}

.ticker-label {
  flex-shrink:0;
  height:100%;
  display:flex;
  align-items:center;
  padding:0 18px;
  background:#d6ad62;
  color:#111;
  font-size:11px;
  font-weight:800;
  letter-spacing:2px;
}

.ticker-window {
  overflow:hidden;
  flex:1;
}

.ticker-track {
  display:flex;
  align-items:center;
  width:max-content;
  animation:tickerMove 38s linear infinite;
}

.ticker-window:hover .ticker-track {
  animation-play-state:paused;
}

.ticker-item {
  display:flex;
  align-items:center;
  gap:12px;
  padding:0 22px;
  color:#f5f0e7;
  text-decoration:none;
  white-space:nowrap;
  font-size:13px;
  font-weight:600;
}

.ticker-item img {
  width:42px;
  height:42px;
  border-radius:5px;
  object-fit:cover;
  border:1px solid #d6ad62;
}

.ticker-fallback {
  padding:20px;
  color:#d6ad62;
  white-space:nowrap;
}

@keyframes tickerMove {
  from {transform:translateX(0)}
  to {transform:translateX(-50%)}
}

.service-card {
  transition:transform .25s ease,
  border-color .25s ease,
  box-shadow .25s ease;
}

.service-card:hover,
.service-card:focus-visible {
  transform:translateY(-6px);
  border-color:#d6ad62;
  box-shadow:0 12px 30px #d6ad6220;
  outline:none;
}

@media(max-width:600px) {
  .tibe-ticker {height:58px}
  .ticker-label {font-size:9px;padding:0 10px}
  .ticker-item {font-size:11px;padding:0 12px}
  .ticker-item img {width:34px;height:34px}
}

@media(prefers-reduced-motion:reduce) {
  .ticker-track {animation:none}
  .tibe-intro {animation:none}
}
`;

document.head.append(animationStyle);
