
document.addEventListener("DOMContentLoaded", () => {
  const db = window.supabaseClient;
  const gallery = document.getElementById("galleryGrid");

  if (!gallery) return;

  async function loadGallery() {
    gallery.innerHTML = "<p>Loading gallery...</p>";

    if (!db) {
      gallery.innerHTML =
        "<p>Connection error. Please check Supabase configuration.</p>";
      return;
    }

    const { data, error } = await db
      .from("gallery")
      .select("id, title, category, image_url, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gallery error:", error);
      gallery.innerHTML =
        "<p>Could not load gallery. Please try again later.</p>";
      return;
    }

    if (!data || data.length === 0) {
      gallery.innerHTML =
        "<p>No published photos yet. Please visit again soon.</p>";
      return;
    }

    gallery.innerHTML = "";

    data.forEach(photo => {
      const card = document.createElement("article");
      card.style.cssText =
        "overflow:hidden;border-radius:12px;background:#1b1b1b;margin-bottom:16px;";

      const img = document.createElement("img");
      img.src = photo.image_url;
      img.alt = photo.title || "TIBE Studio photo";
      img.loading = "lazy";
      img.style.cssText =
        "width:100%;height:260px;object-fit:cover;display:block;";

      img.onerror = () => {
        img.alt = "Image could not be loaded";
        img.style.display = "none";
      };

      const info = document.createElement("div");
      info.style.cssText = "padding:14px;";

      const title = document.createElement("h3");
      title.textContent = photo.title || "TIBE Studio";
      title.style.color = "#d9b65c";

      const category = document.createElement("p");
      category.textContent = photo.category || "Photography";
      category.style.color = "#bbb";

      info.append(title, category);
      card.append(img, info);
      gallery.appendChild(card);
    });
  }

  loadGallery();
});
