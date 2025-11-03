/**
 * GLOBAL-CART.JS — Mít Sấy Vũ Trụ
 * Auto inject: Header (fixed), Mini-cart, Social Floating, Footer, Cart Logic
 * Áp dụng cho MỌI TRANG, kể cả trang mới chưa đồng bộ.
 */

(function () {
  // ──────────────────────────────────────────────────────────────
  // 0) CHỐNG CHÈN TRÙNG
  // ──────────────────────────────────────────────────────────────
  if (window.__MSVT_GLOBAL_READY__) return;
  window.__MSVT_GLOBAL_READY__ = true;

  // ──────────────────────────────────────────────────────────────
  // 1) ĐẢM BẢO TAILWIND + FONT
  // ──────────────────────────────────────────────────────────────
  function ensureTailwindAndFont() {
    // Tailwind CDN
    const hasTW = !!Array.from(document.scripts).find(s =>
      (s.src || '').includes('cdn.tailwindcss.com')
    );
    if (!hasTW) {
      const tw = document.createElement('script');
      tw.src = 'https://cdn.tailwindcss.com';
      tw.defer = true;
      document.head.appendChild(tw);
    }

    // Font Inter
    if (!document.querySelector('link[href*="fonts.googleapis.com"][href*="Inter"]')) {
      const inter = document.createElement('link');
      inter.rel = 'stylesheet';
      inter.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(inter);
    }

    // CSS bổ sung
    const style = document.createElement('style');
    style.id = '__msvt_shared_css';
    style.textContent = `
      body{box-sizing:border-box;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
      .mini-cart{transform:translateX(100%);transition:transform .3s ease}
      .mini-cart.open{transform:translateX(0)}
      .cart-badge{transform:scale(0);transition:transform .2s ease}
      .cart-badge.show{transform:scale(1)}
      .social-float{position:fixed;right:16px;bottom:110px;display:flex;flex-direction:column;gap:14px;z-index:9999}
      .sf-btn{width:56px;height:56px;display:grid;place-items:center;border-radius:50%;color:#fff;text-decoration:none;box-shadow:0 8px 16px rgba(0,0,0,.25);transition:transform .2s,filter .2s}
      .sf-btn:hover{transform:scale(1.05);filter:brightness(1.1)}
      .sf-fb{background:linear-gradient(135deg,#1877f2,#0d5bd6)}
      .sf-call{background:linear-gradient(135deg,#2ecc71,#19ad5a)}
      .sf-tt{background:linear-gradient(135deg,#000,#333)}
      .sf-btn svg{width:26px;height:26px;fill:#fff}
    `;
    if (!document.getElementById('__msvt_shared_css')) {
      document.head.appendChild(style);
    }
  }
  ensureTailwindAndFont();

  // Helper: chèn HTML string
  function appendHTMLToBody(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
    return wrap;
  }

  // ──────────────────────────────────────────────────────────────
  // 2) HEADER (fixed) + MOBILE MENU + CART BUTTON
  // ──────────────────────────────────────────────────────────────
  function injectHeader() {
    if (document.getElementById('__msvt_header')) return;

    const headerHTML = `
<header id="__msvt_header" class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- LOGO -->
    <a href="index.html" class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full overflow-hidden bg-yellow-100 grid place-items-center">
        <img src="images/logo.png" alt="Logo Mít Sấy Vũ Trụ" class="w-full h-full object-contain"/>
      </div>
      <div>
        <h1 class="text-[18px] font-bold text-slate-800 leading-none">Mít Sấy Vũ Trụ</h1>
        <p class="text-[12px] text-slate-600">Giòn thơm quay vị giác</p>
      </div>
    </a>

    <!-- MENU DESKTOP -->
    <nav class="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
      <a href="index.html" class="hover:text-amber-600 transition-colors">Trang chủ</a>
      <a href="san-pham.html" class="hover:text-amber-600 transition-colors">Sản phẩm</a>
      <a href="gioithieu.html" class="hover:text-amber-600 transition-colors">Câu chuyện thương hiệu</a>
      <a href="blog.html" class="hover:text-amber-600 transition-colors">Blog / Tin tức</a>
      <a href="lien-he.html" class="hover:text-amber-600 transition-colors">Liên hệ / Mua sỉ</a>
    </nav>

    <!-- CART + MOBILE BTN -->
    <div class="flex items-center gap-5">
      <button id="cartBtn" class="relative flex items-center bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
          <span>Giỏ hàng</span>
        </span>
        <span id="cartBadge" class="cart-badge absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold w-5 h-5 rounded-full grid place-items-center">0</span>
      </button>

      <button id="mobile-menu-btn" class="md:hidden text-slate-700 hover:text-amber-600 transition-colors flex items-center" aria-label="Mở menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- MENU MOBILE -->
  <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-200 shadow-lg">
    <nav class="flex flex-col text-[15px] font-medium text-slate-700 px-4 py-3">
      <a href="index.html" class="py-2 border-b hover:text-amber-600">Trang chủ</a>
      <a href="san-pham.html" class="py-2 border-b hover:text-amber-600">Sản phẩm</a>
      <a href="gioithieu.html" class="py-2 border-b hover:text-amber-600">Câu chuyện thương hiệu</a>
      <a href="blog.html" class="py-2 border-b hover:text-amber-600">Blog / Tin tức</a>
      <a href="lien-he.html" class="py-2 hover:text-amber-600">Liên hệ / Mua sỉ</a>
    </nav>
  </div>
</header>
    `;
    const wrap = document.createElement('div');
    wrap.innerHTML = headerHTML;
    document.body.prepend(wrap);

    // Đệm tránh che nội dung (theo chiều cao header)
    requestAnimationFrame(() => {
      const h = document.getElementById('__msvt_header');
      const headerH = h ? h.getBoundingClientRect().height : 64;
      const currentPad = parseInt(getComputedStyle(document.body).paddingTop || '0', 10);
      if (currentPad < headerH) document.body.style.paddingTop = headerH + 'px';
    });
  }

  // ──────────────────────────────────────────────────────────────
  // 3) SOCIAL FLOATING
  // ──────────────────────────────────────────────────────────────
  function injectSocialFloat() {
    if (document.getElementById('__msvt_social')) return;
    appendHTMLToBody(`
<div id="__msvt_social" class="social-float">
  <a class="sf-btn sf-fb" href="https://www.facebook.com/profile.php?id=61581606206384" target="_blank" aria-label="Facebook">
    <svg viewBox="0 0 24 24"><path d="M22 12.06C22 6.49 17.52 2 11.95 2S2 6.49 2 12.06c0 5.02 3.66 9.19 8.44 9.98v-7.06H7.9v-2.92h2.54V9.41c0-2.51 1.5-3.9 3.8-3.9 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.92h-2.34v7.06C18.34 21.25 22 17.08 22 12.06z"/></svg>
  </a>
  <a class="sf-btn sf-call" href="tel:0365231819" aria-label="Gọi điện">
    <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.3.57 3.53.57a1 1 0 011 1V21a1 1 0 01-1 1C10.42 22 2 13.58 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.23.2 2.42.57 3.53a1 1 0 01-.25 1.01l-2.2 2.25z"/></svg>
  </a>
  <a class="sf-btn sf-tt" href="https://www.tiktok.com/@mitsayvutru" target="_blank" aria-label="TikTok">
    <svg viewBox="0 0 24 24"><path d="M21 8.5c-2.15 0-4.08-1.23-4.99-3.1V16a6 6 0 11-6-6c.18 0 .36.01.53.03v3.06a3 3 0 10.53 1.71V2h3.04a5.01 5.01 0 004.89 3.97V8.5z"/></svg>
  </a>
</div>`);
  }

  // ──────────────────────────────────────────────────────────────
  // 4) MINI-CART + OVERLAY
  // ──────────────────────────────────────────────────────────────
  function injectMiniCart() {
    if (document.getElementById('miniCart')) return;
    appendHTMLToBody(`
<div id="miniCart" class="mini-cart fixed top-0 right-0 w-80 max-w-[90%] h-full bg-white shadow-2xl z-[9998] overflow-y-auto">
  <div class="p-4 border-b">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Giỏ hàng của bạn</h3>
      <button id="closeCart" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
  <div id="cartItems" class="p-4 flex-1">
    <p class="text-gray-500 text-center py-8">Giỏ hàng trống</p>
  </div>
  <div class="border-t p-4">
    <div class="flex justify-between items-center mb-4">
      <span class="font-semibold">Tổng cộng:</span>
      <span id="cartTotal" class="font-bold text-lg text-amber-600">0₫</span>
    </div>
    <button id="checkoutBtn" class="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50" disabled>Thanh toán</button>
    <div class="mt-4 text-center text-sm">
      <a href="track.html" class="inline-flex items-center gap-2 text-gray-700 hover:text-black">
        <span class="underline">Theo dõi đơn hàng</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</div>
<div id="cartOverlay" class="fixed inset-0 bg-black/50 z-[9997] hidden"></div>
    `);
  }

  // ──────────────────────────────────────────────────────────────
  // 5) FOOTER dùng chung
  // ──────────────────────────────────────────────────────────────
  function injectFooter() {
    if (document.getElementById('__msvt_footer')) return;
    appendHTMLToBody(`
<footer id="__msvt_footer" class="bg-[#1a2536] text-white pt-10 pb-6 mt-16 border-t-4 border-amber-400">
  <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="md:col-span-2 flex flex-col">
      <div class="flex items-start gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shadow">
          <img src="images/logo.png" alt="Logo" class="w-9 h-9 object-contain" />
        </div>
        <div>
          <p class="font-semibold text-lg">Mít Sấy Vũ Trụ</p>
          <p class="text-sm text-gray-300">Giòn thơm quay vị giác</p>
        </div>
      </div>
      <p class="text-gray-300 text-sm leading-relaxed max-w-md">
        Thương hiệu mít sấy cao cấp, cam kết chất lượng và an toàn thực phẩm.
      </p>
    </div>

    <div>
      <p class="font-semibold text-lg mb-4">Liên hệ</p>
      <ul class="space-y-2 text-sm text-gray-300">
        <li class="flex gap-2"><span>📍</span><span>12 Hữu trí Hà Đông Hà Nội</span></li>
        <li class="flex gap-2"><span>📞</span><span>Hotline: 0365231819</span></li>
        <li class="flex gap-2"><span>✉️</span><span>Email: mitsayvutru.infor@gmail.com</span></li>
        <li class="flex gap-2"><span>⏰</span><span>8:00 - 22:00 (Thứ 2 - CN)</span></li>
      </ul>
    </div>

    <div>
      <p class="font-semibold text-lg mb-4">Chính sách</p>
      <ul class="space-y-2 text-sm text-gray-300">
        <li><a href="policy-return.html" class="hover:text-white">Chính sách đổi trả</a></li>
        <li><a href="policy-privacy.html" class="hover:text-white">Chính sách bảo mật</a></li>
        <li><a href="policy-terms.html" class="hover:text-white">Điều khoản sử dụng</a></li>
        <li><a href="policy-guide.html" class="hover:text-white">Hướng dẫn mua hàng</a></li>
      </ul>
    </div>

    <div class="lg:col-span-1">
      <p class="font-semibold text-lg mb-4">Nhận ưu đãi</p>
      <p class="text-sm text-gray-300 mb-3">
        Đăng ký để nhận thông tin khuyến mãi mới nhất
      </p>
      <div class="flex flex-col gap-3">
        <input type="email" class="bg-[#2a3447] text-gray-200 text-sm rounded-md px-3 py-3 outline-none border border-[#3a465f] placeholder-gray-400" placeholder="Email của bạn">
        <button class="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm rounded-md py-3 text-center transition">Đăng ký</button>
      </div>
      <div class="flex items-center gap-3 mt-6">
        <div class="w-3 h-3 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,.8)]"></div>
        <div class="w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_8px_rgba(168,85,247,.8)]"></div>
        <div class="w-3 h-3 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(226,232,240,.5)]"></div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-600 text-center text-gray-400 text-sm">
    © 2024 Mít Sấy Vũ Trụ. Tất cả quyền được bảo lưu.
  </div>
</footer>
    `);
  }

  // ──────────────────────────────────────────────────────────────
  // 6) CART LOGIC + EVENTS
  // ──────────────────────────────────────────────────────────────
  function initCartLogic() {
    // LocalStorage cart
    let cart = JSON.parse(localStorage.getItem('mitSayCart')) || [];

    function persist() {
      localStorage.setItem('mitSayCart', JSON.stringify(cart));
    }

    function updateCartUI() {
      const badge = document.getElementById('cartBadge');
      const list = document.getElementById('cartItems');
      const total = document.getElementById('cartTotal');
      const btn = document.getElementById('checkoutBtn');

      const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
      const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

      if (badge) {
        badge.textContent = totalItems;
        badge.classList.toggle('show', totalItems > 0);
      }

      if (list && total && btn) {
        if (!cart.length) {
          list.innerHTML = '<p class="text-gray-500 text-center py-8">Giỏ hàng trống</p>';
          btn.disabled = true;
        } else {
          list.innerHTML = cart.map(i => `
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <div class="flex-1">
                <h4 class="font-medium text-sm">${i.name}</h4>
                <p class="text-amber-600 font-semibold">${i.price.toLocaleString()}₫</p>
              </div>
              <div class="flex items-center space-x-2">
                <button onclick="__updateQuantity('${i.id}', ${i.quantity - 1})" class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300">-</button>
                <span class="w-8 text-center text-sm">${i.quantity}</span>
                <button onclick="__updateQuantity('${i.id}', ${i.quantity + 1})" class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300">+</button>
              </div>
            </div>
          `).join('');
          btn.disabled = false;
        }
        total.textContent = totalPrice.toLocaleString() + '₫';
      }

      persist();
    }

    function addToCart(id, name, price) {
      const found = cart.find(i => i.id === id);
      if (found) found.quantity++;
      else cart.push({ id, name, price: parseInt(price), quantity: 1 });
      updateCartUI();
    }
    function updateQuantity(id, qty) {
      if (qty <= 0) cart = cart.filter(i => i.id !== id);
      else {
        const it = cart.find(i => i.id === id);
        if (it) it.quantity = qty;
      }
      updateCartUI();
    }

    // Expose helpers (dùng ở bất kỳ trang nào)
    window.addToCart = addToCart;
    window.__updateQuantity = updateQuantity;
    window.buyNow = function (id, name, price) {
      addToCart(id, name, price);
      window.location.href = 'index.html#cart';
    };

    // Open/Close cart
    function openCart() {
      document.getElementById('miniCart')?.classList.add('open');
      document.getElementById('cartOverlay')?.classList.remove('hidden');
    }
    function closeCart() {
      document.getElementById('miniCart')?.classList.remove('open');
      document.getElementById('cartOverlay')?.classList.add('hidden');
    }
    window.openCart = openCart;
    window.closeCart = closeCart;

    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('closeCart')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      if (!cart.length) return alert('Giỏ hàng đang trống');
      window.location.href = 'checkout.html';
    });

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Tự mở cart nếu URL có #cart
    if (location.hash === '#cart') openCart();

    updateCartUI();
  }

  // ──────────────────────────────────────────────────────────────
  // 7) KHỞI CHẠY
  // ──────────────────────────────────────────────────────────────
  function boot() {
    injectHeader();
    injectSocialFloat();
    injectMiniCart();
    injectFooter();
    initCartLogic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();