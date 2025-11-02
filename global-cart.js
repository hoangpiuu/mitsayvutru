// global-cart.js
// =====================================
// 1. CSS dùng chung (chúng ta inject thẳng vào <head>)
// =====================================
(function injectSharedStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    body { box-sizing:border-box; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .fade-in{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
    .fade-in.visible{opacity:1;transform:translateY(0)}
    .mini-cart{transform:translateX(100%);transition:transform .3s ease}
    .mini-cart.open{transform:translateX(0)}
    .cart-badge{transform:scale(0);transition:transform .2s ease}
    .cart-badge.show{transform:scale(1)}

    :root{
      --sf-size:56px;
      --sf-gap:14px;
      --sf-right:16px;
      --sf-bottom:110px;
    }
    .social-float{
      position:fixed; right:var(--sf-right); bottom:var(--sf-bottom);
      display:flex; flex-direction:column; gap:var(--sf-gap);
      z-index:9999;
    }
    .sf-btn{
      width:var(--sf-size); height:var(--sf-size);
      display:grid; place-items:center;
      border-radius:50%; color:#fff; text-decoration:none;
      box-shadow:0 8px 16px rgba(0,0,0,.25);
      transition:transform .2s, filter .2s;
    }
    .sf-btn:hover{ transform:scale(1.05); filter:brightness(1.1); }
    .sf-fb{ background:linear-gradient(135deg,#1877f2,#0d5bd6); }
    .sf-call{ background:linear-gradient(135deg,#2ecc71,#19ad5a); }
    .sf-tt{ background:linear-gradient(135deg,#000,#333); }
    .sf-btn svg{ width:26px; height:26px; fill:#fff }
  `;
  document.head.appendChild(style);

  // Google font Inter (giữ đúng brand)
  const interLink = document.createElement('link');
  interLink.rel = "stylesheet";
  interLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(interLink);
})();

// =====================================
// 2. Inject HEADER + MOBILE MENU + CART BUTTON
// =====================================
(function injectHeader() {
  const headerHTML = `
<header class="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- LOGO -->
    <a href="index.html" class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-full overflow-hidden bg-yellow-100 grid place-items-center">
        <img src="images/logo.png" alt="Logo Mít Sấy Vũ Trụ" class="w-full h-full object-contain" />
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

    <!-- GIỎ HÀNG + NÚT MOBILE -->
    <div class="flex items-center gap-5">
      <!-- CART BTN -->
      <button id="cartBtn"
        class="relative flex items-center bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
          <span>Giỏ hàng</span>
        </span>
        <span id="cartBadge"
          class="cart-badge absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
          0
        </span>
      </button>

      <!-- MOBILE MENU TOGGLE -->
      <button id="mobile-menu-btn"
        class="md:hidden text-slate-700 hover:text-amber-600 transition-colors flex items-center"
        aria-label="Mở menu">
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
  const headerWrapper = document.createElement('div');
  headerWrapper.innerHTML = headerHTML;
  document.body.prepend(headerWrapper);
})();

// =====================================
// 3. Inject SOCIAL FLOATING BUTTONS
// =====================================
(function injectSocialFloat() {
  const floatHTML = `
<div class="social-float">
  <a class="sf-btn sf-fb"
     href="https://www.facebook.com/profile.php?id=61581606206384&rdid=k8fxe7fkcWZ8iM2y&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1K1z5fzRUN%2F#"
     target="_blank" aria-label="Facebook">
    <svg viewBox="0 0 24 24"><path d="M22 12.06C22 6.49 17.52 2 11.95 2S2 6.49 2 12.06c0 5.02 3.66 9.19 8.44 9.98v-7.06H7.9v-2.92h2.54V9.41c0-2.51 1.5-3.9 3.8-3.9 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.92h-2.34v7.06C18.34 21.25 22 17.08 22 12.06z"/></svg>
  </a>

  <a class="sf-btn sf-call"
     href="tel:0365231819" aria-label="Gọi điện">
    <svg viewBox="0 0 24 24"><path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.3.57 3.53.57a1 1 0 011 1V21a1 1 0 01-1 1C10.42 22 2 13.58 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.23.2 2.42.57 3.53a1 1 0 01-.25 1.01l-2.2 2.25z"/></svg>
  </a>

  <a class="sf-btn sf-tt"
     href="https://www.tiktok.com/@mitsayvutru" target="_blank" aria-label="TikTok">
    <svg viewBox="0 0 24 24"><path d="M21 8.5c-2.15 0-4.08-1.23-4.99-3.1V16a6 6 0 11-6-6c.18 0 .36.01.53.03v3.06a3 3 0 10.53 1.71V2h3.04a5.01 5.01 0 004.89 3.97V8.5z"/></svg>
  </a>
</div>`;
  const floatWrapper = document.createElement('div');
  floatWrapper.innerHTML = floatHTML;
  document.body.appendChild(floatWrapper);
})();

// =====================================
// 4. Inject MINI-CART SIDEBAR + OVERLAY
// =====================================
(function injectMiniCart() {
  const cartHTML = `
<div id="miniCart"
     class="mini-cart fixed top-0 right-0 w-80 max-w-[90%] h-full bg-white shadow-2xl z-[9998] overflow-y-auto">
  <div class="p-4 border-b">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">Giỏ hàng của bạn</h3>
      <button id="closeCart" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
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

    <button id="checkoutBtn"
            class="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            disabled>
      Thanh toán
    </button>

    <div class="mt-4 text-center text-sm">
      <a href="track.html" class="inline-flex items-center gap-2 text-gray-700 hover:text-black">
        <span class="underline">Theo dõi đơn hàng</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</div>

<div id="cartOverlay"
     class="fixed inset-0 bg-black/50 z-[9997] hidden"></div>
`;
  const cartWrapper = document.createElement('div');
  cartWrapper.innerHTML = cartHTML;
  document.body.appendChild(cartWrapper);
})();

// =====================================
// 5. Logic giỏ hàng + mobile menu + hiệu ứng
// =====================================
(function initCartLogic() {

  let cart = JSON.parse(localStorage.getItem('mitSayCart')) || [];

  function updateCartUI(){
    const cartBadge   = document.getElementById('cartBadge');
    const cartItems   = document.getElementById('cartItems');
    const cartTotal   = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const totalItems = cart.reduce((s,i)=>s+i.quantity,0);
    const totalPrice = cart.reduce((s,i)=>s+i.price*i.quantity,0);

    // Badge
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      if (totalItems > 0) {
        cartBadge.classList.add('show');
        cartBadge.classList.remove('hidden');
      } else {
        cartBadge.classList.remove('show');
      }
    }

    // Cart list
    if (cartItems && cartTotal && checkoutBtn) {
      if (cart.length === 0){
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Giỏ hàng trống</p>';
        checkoutBtn.disabled = true;
      } else {
        cartItems.innerHTML = cart.map(i=>`
          <div class="flex items-center justify-between py-3 border-b border-gray-200">
            <div class="flex-1">
              <h4 class="font-medium text-sm">${i.name}</h4>
              <p class="text-amber-600 font-semibold">${i.price.toLocaleString()}₫</p>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="__updateQuantity('${i.id}', ${i.quantity-1})"
                      class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300">-</button>
              <span class="w-8 text-center text-sm">${i.quantity}</span>
              <button onclick="__updateQuantity('${i.id}', ${i.quantity+1})"
                      class="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300">+</button>
            </div>
          </div>
        `).join('');
        checkoutBtn.disabled = false;
      }
      cartTotal.textContent = totalPrice.toLocaleString() + '₫';
    }

    localStorage.setItem('mitSayCart', JSON.stringify(cart));
  }

  function addToCart(id,name,price){
    const found = cart.find(i=>i.id===id);
    if(found) {
      found.quantity++;
    } else {
      cart.push({id,name,price:parseInt(price),quantity:1});
    }
    updateCartUI();
  }

  function updateQuantity(id,newQty){
    if(newQty <= 0){
        cart = cart.filter(i=>i.id !== id);
    } else {
      const it = cart.find(i=>i.id===id);
      if (it) it.quantity = newQty;
    }
    updateCartUI();
  }

  // expose để nút "-" "+" trong HTML gọi được
  window.__updateQuantity = updateQuantity;
  window.addToCart        = addToCart;

  // mở/đóng cart
  function openCart(){
    const miniCart = document.getElementById('miniCart');
    const overlay  = document.getElementById('cartOverlay');
    if (miniCart) miniCart.classList.add('open');
    if (overlay)  overlay.classList.remove('hidden');
  }
  function closeCart(){
    const miniCart = document.getElementById('miniCart');
    const overlay  = document.getElementById('cartOverlay');
    if (miniCart) miniCart.classList.remove('open');
    if (overlay)  overlay.classList.add('hidden');
  }
  window.openCart = openCart;

  // events cho các nút trên giao diện
  const cartBtnEl      = document.getElementById('cartBtn');
  const closeCartBtnEl = document.getElementById('closeCart');
  const cartOverlayEl  = document.getElementById('cartOverlay');

  if (cartBtnEl)      cartBtnEl.addEventListener('click', openCart);
  if (closeCartBtnEl) closeCartBtnEl.addEventListener('click', closeCart);
  if (cartOverlayEl)  cartOverlayEl.addEventListener('click', closeCart);

  // checkout
  const checkoutBtnEl = document.getElementById('checkoutBtn');
  if (checkoutBtnEl){
    checkoutBtnEl.addEventListener('click', ()=>{
      if (!cart || cart.length === 0) {
        alert('Giỏ hàng đang trống');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  // toggle mobile menu
  const mobileMenuBtn   = document.getElementById('mobile-menu-btn');
  const mobileMenuPanel = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenuPanel){
    mobileMenuBtn.addEventListener('click', ()=>{
      mobileMenuPanel.classList.toggle('hidden');
    });
  }

  // smooth scroll nếu link là anchor #... (ví dụ từ header hoặc mobile menu)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if (target){
        e.preventDefault();
        // đóng menu mobile sau khi chọn
        if (this.closest('#mobile-menu') && mobileMenuPanel){
          mobileMenuPanel.classList.add('hidden');
        }
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // hiệu ứng fade-in nếu trang con cũng dùng class .fade-in
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('visible');
    });
  }, {threshold:.1, rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));

  // init lần đầu
  updateCartUI();

  // nếu URL có #cart -> auto mở
  if (location.hash === '#cart') {
    openCart();
  }

})();
