/* ============== Global Brand & SEO Injector ============== */
(function () {
  const BRAND = {
    name: "Mít Sấy Vũ Trụ",
    slogan: "Giòn thơm quay vị giác",
    logoRelPath: "images/logo.png",   // ảnh 884x884 của bạn
    homeUrl: "index.html",
  };

  const ABS_LOGO = new URL(BRAND.logoRelPath, window.location.origin).toString();
  const ABS_HOME = new URL(BRAND.homeUrl, window.location.origin).toString();

  /* ---------- 1) Ghim logo tròn góc trái trên ---------- */
  function injectCornerBadge() {
    if (document.getElementById("brand-badge")) return;

    const wrap = document.createElement("a");
    wrap.id = "brand-badge";
    wrap.href = BRAND.homeUrl;
    wrap.setAttribute("aria-label", BRAND.name);

    wrap.innerHTML = `
      <img id="brand-badge-img" alt="Logo ${BRAND.name}" src="${BRAND.logoRelPath}">
      <span id="brand-badge-text">
        <strong>${BRAND.name}</strong>
        <em>${BRAND.slogan}</em>
      </span>
    `;

    const style = document.createElement("style");
    style.id = "brand-badge-style";
    style.textContent = `
      #brand-badge{
        position:fixed; top:10px; left:10px; z-index:9999;
        display:flex; align-items:center; gap:10px;
        padding:8px 10px; background:#ffffffee; backdrop-filter:saturate(120%) blur(4px);
        border-radius:999px; box-shadow:0 6px 20px rgba(0,0,0,.15);
        text-decoration:none; color:#111; transition:transform .2s ease;
      }
      #brand-badge:hover{ transform:translateY(-1px); }
      #brand-badge-img{
        width:40px; height:40px; border-radius:50%;
        object-fit:cover; object-position:center; display:block;
      }
      #brand-badge-text{ display:flex; flex-direction:column; line-height:1.05; }
      #brand-badge-text strong{ font-size:14px; font-weight:700; }
      #brand-badge-text em{ font-size:11px; font-style:normal; opacity:.8; }
      @media (max-width:480px){
        #brand-badge{ gap:8px; padding:6px 8px; }
        #brand-badge-img{ width:34px; height:34px; }
        #brand-badge-text strong{ font-size:13px; }
        #brand-badge-text em{ display:none; } /* gọn hơn trên màn nhỏ */
      }
    `;
    document.documentElement.appendChild(style);
    document.body.appendChild(wrap);
  }

  /* ---------- 2) Đồng bộ favicon / app icons ---------- */
  function setIcon(rel, sizes, href) {
    // xóa cũ
    [...document.querySelectorAll(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ""}`)]
      .forEach(n => n.remove());
    const link = document.createElement("link");
    link.rel = rel;
    if (sizes) link.sizes = sizes;
    link.href = href;
    document.head.appendChild(link);
  }
  function ensureIcons() {
    // PNG favicon (đa số trình duyệt hiện đại đều hỗ trợ)
    setIcon("icon", "32x32", BRAND.logoRelPath);
    setIcon("icon", "192x192", BRAND.logoRelPath);
    setIcon("apple-touch-icon", "180x180", BRAND.logoRelPath);
    // Safari pinned tab (mặc định dùng png cũng ổn; có thể thay bằng SVG mask sau)
    setIcon("mask-icon", null, BRAND.logoRelPath);
  }

  /* ---------- 3) Open Graph / Twitter Card ---------- */
  function upsertMeta(name, content, attr = "name") {
    let m = document.querySelector(`meta[${attr}="${name}"]`);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute(attr, name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }
  function ensureSocialMeta() {
    const title = document.title || `${BRAND.name} - ${BRAND.slogan}`;
    const desc =
      document.querySelector('meta[name="description"]')?.content ||
      `${BRAND.name} được sản xuất từ những trái mít chín cây tự nhiên, giòn thơm quay vị giác.`;

    // Open Graph
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", desc, "property");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:url", ABS_HOME, "property");
    upsertMeta("og:site_name", BRAND.name, "property");
    upsertMeta("og:image", ABS_LOGO, "property");
    upsertMeta("og:image:width", "884", "property");
    upsertMeta("og:image:height", "884", "property");

    // Twitter
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", desc);
    upsertMeta("twitter:image", ABS_LOGO);
  }

  /* ---------- 4) JSON-LD Organization (Logo cho Google) ---------- */
  function ensureJsonLd() {
    if (document.getElementById("org-jsonld")) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "org-jsonld";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": BRAND.name,
      "url": ABS_HOME,
      "logo": ABS_LOGO,
    });
    document.head.appendChild(script);
  }

  /* ---------- Init ---------- */
  function init() {
    try {
      injectCornerBadge();
      ensureIcons();
      ensureSocialMeta();
      ensureJsonLd();
      // Nếu trang có sẵn phần logo <img id="site-logo"> thì đồng bộ luôn:
      const existed = document.getElementById("site-logo");
      if (existed) {
        existed.src = BRAND.logoRelPath;
        existed.alt = `Logo ${BRAND.name}`;
        existed.style.borderRadius = "50%";
        existed.style.objectFit = "cover";
      }
    } catch (e) {
      console.error("Brand injector error:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
