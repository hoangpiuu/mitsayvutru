// /favicon.js  — tự nhận ảnh /images/logo.png, bo tròn, gắn cho mọi kích thước
(function () {
  const SRC = "/images/logo.png";          // ảnh bạn đã để trong /images/
  const SIZES = [16, 32, 48, 64, 96, 180, 192, 256, 512];

  function ensureLink(rel, size) {
    const sel = size
      ? `link[rel="${rel}"][sizes="${size}x${size}"]`
      : `link[rel="${rel}"]:not([sizes])`;
    let link = document.querySelector(sel);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      if (size) link.sizes = `${size}x${size}`;
      document.head.appendChild(link);
    }
    return link;
  }

  function circleDataURL(img, size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, size, size);

    // bo tròn
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // crop vuông ở giữa, cover theo cạnh ngắn
    const m = Math.min(img.width, img.height);
    const sx = (img.width - m) / 2;
    const sy = (img.height - m) / 2;
    ctx.drawImage(img, sx, sy, m, m, 0, 0, size, size);

    return c.toDataURL("image/png");
  }

  function applyFavicons(img) {
    // các kích thước chuẩn
    SIZES.forEach((sz) => {
      const url = circleDataURL(img, sz);
      const link = ensureLink("icon", sz);
      link.type = "image/png";
      link.href = url;
    });

    // bản mặc định (không sizes) cho trình duyệt cũ
    const main = ensureLink("icon", null);
    main.type = "image/png";
    main.href = circleDataURL(img, 32);

    // iOS
    const apple = ensureLink("apple-touch-icon", 180);
    apple.href = circleDataURL(img, 180);
  }

  // tải ảnh nguồn rồi vẽ
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => applyFavicons(img);
  img.src = SRC;
})();
