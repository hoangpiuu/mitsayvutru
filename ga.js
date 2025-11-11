/* GA4 Universal Tracking for all pages (MPA) */
/* Measurement ID: G-HYNFZGJ80P */

(function () {
  if (window.__GA_UNIVERSAL_LOADED__) return;
  window.__GA_UNIVERSAL_LOADED__ = true;

  // ---- GA4 Bootstrap ----
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied"
  });

  // Load GA4
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-HYNFZGJ80P";
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", "G-HYNFZGJ80P", { send_page_view: false });

  // ---- Page view tracking ----
  function sendPageView() {
    gtag("event", "page_view", {
      page_location: location.href,
      page_title: document.title,
      page_path: location.pathname
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sendPageView);
  } else {
    sendPageView();
  }

  // ---- Outbound link click ----
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || !a.href) return;

    var url = new URL(a.href, location.origin);
    if (url.host !== location.host) {
      gtag("event", "click", {
        event_category: "outbound",
        event_label: a.href,
        link_url: a.href
      });
    }
  });

  // ---- Scroll depth tracking ----
  (function () {
    var marks = [25, 50, 75, 100];
    var fired = {};

    function checkScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight;
      var winHeight = window.innerHeight;

      var percent = Math.min(100, Math.round((scrollTop + winHeight) / docHeight * 100));

      marks.forEach(function (m) {
        if (percent >= m && !fired[m]) {
          fired[m] = true;
          gtag("event", "scroll_depth", { percent_scrolled: m });
        }
      });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
  })();

  // ---- Ecommerce helpers ----
  function normalizeItem(it) {
    return {
      item_id: it.item_id,
      item_name: it.item_name,
      price: it.price,
      quantity: it.quantity || 1
    };
  }

  window.gaAddToCart = function (item) {
    var it = normalizeItem(item);
    gtag("event", "add_to_cart", {
      currency: "VND",
      value: it.price * it.quantity,
      items: [it]
    });
  };

  window.gaBeginCheckout = function (payload) {
    var items = (payload.items || []).map(normalizeItem);
    gtag("event", "begin_checkout", {
      currency: "VND",
      value: payload.value || 0,
      items: items
    });
  };

  window.gaPurchase = function (payload) {
    var items = (payload.items || []).map(normalizeItem);
    gtag("event", "purchase", {
      transaction_id: payload.transaction_id,
      value: payload.value,
      currency: "VND",
      items: items
    });
  };
})();
