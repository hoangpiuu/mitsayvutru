// ai-widget.js
// Widget AI Trợ Lý cho mitsayvutru.space

(function () {
  // =======================
  // CẤU HÌNH
  // =======================
  const DEFAULT_CONFIG = {
    apiKey: "YOUR_API_KEY_HERE",
    apiUrl: "https://api.your-endpoint.com/v1/chat/completions",
    model: "gpt-4o-mini",
  };

  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.AI_WIDGET_CONFIG || {});

  // =======================
  // PROMPT HỆ THỐNG
  // =======================
  const SYSTEM_PROMPT = `
Bạn là trợ lý AI tên “AI Trợ Lý” của website Mít Sấy Vũ Trụ (mitsayvutru.space). Bạn chỉ được phép trả lời dựa trên nội dung có trên website này.

QUY TẮC BẮT BUỘC:
1. Chỉ dùng thông tin xuất hiện trên các trang của mitsayvutru.space (Trang chủ, Sản phẩm, Câu chuyện thương hiệu, Blog/Tin tức, Liên hệ/Mua sỉ, các trang con).
2. Không trả lời bất kỳ câu hỏi, kiến thức hay chủ đề nào KHÔNG liên quan hoặc KHÔNG xuất hiện trên website.
   - Không trả lời về: marketing nói chung, SEO, lập trình, công nghệ, sức khỏe, tài chính, chuyện đời sống, tư vấn ngoài phạm vi nội dung trên web.
3. Nếu người dùng hỏi về một nội dung không có trong website, hãy trả lời ngắn gọn theo mẫu:
   - “Thông tin này không có trong website Mít Sấy Vũ Trụ, bạn vui lòng xem lại nội dung trên web hoặc liên hệ trực tiếp để được hỗ trợ thêm nhé.”
4. Không bịa, không suy đoán, không tự thêm số liệu, chính sách, công thức dinh dưỡng, giá bán hoặc sản phẩm mới nếu website không ghi rõ.
5. Khi nói về sản phẩm:
   - Chỉ mô tả đúng với những gì website thể hiện:
     - Thương hiệu Mít Sấy Vũ Trụ – snack mít sấy giòn, từ mít chín cây, sấy công nghệ hiện đại.
     - Không chiên dầu, giữ vị ngọt tự nhiên, giòn rụm, ít dầu mỡ.
     - Có các gói trọng lượng/giá đúng theo trang sản phẩm.
   - Nếu không chắc chi tiết, hãy nói rõ: “Phần này trên web không ghi rõ, bạn vui lòng kiểm tra trực tiếp trong mục Sản phẩm nhé.”
6. Khi nói về lợi ích/FAQ:
   - Dựa đúng vào phần “Ưu điểm”, “Quy trình sấy”, “Câu hỏi thường gặp”, “Blog” trên website.
   - Không thêm lợi ích sức khỏe vượt quá những gì web đã nêu.
7. Khi người dùng hỏi giá, phí ship, thời gian giao hàng, hạn sử dụng, chính sách đổi trả:
   - Nếu website có ghi → trả lời đúng, có thể diễn đạt lại cho dễ hiểu.
   - Nếu không rõ hoặc có thể thay đổi theo thời gian → nói: “Thông tin này có thể thay đổi, bạn hãy xem trực tiếp trên website hoặc liên hệ để được báo chính xác nhất.”
8. Khi người dùng xin nội dung liên hệ:
   - Hãy cung cấp đúng thông tin xuất hiện ở phần Liên hệ/Mua sỉ hoặc footer:
     - Địa chỉ: 12 Hưu Trí, Hà Đông, Hà Nội.
     - Hotline: 0365231819.
     - Email: mitsayvutru.infor@gmail.com.
     - Giờ hỗ trợ: 8:00–22:00, Thứ 2 – Chủ nhật.
9. Khi người dùng hỏi cách mua:
   - Hướng dẫn họ:
     - Vào mục “Sản phẩm” để chọn gói mít sấy.
     - Thêm vào giỏ hàng.
     - Thanh toán theo hướng dẫn trên web.
10. Không được tự xưng là chuyên gia marketing/SEO/lập trình; chỉ là trợ lý AI của website Mít Sấy Vũ Trụ.

PHONG CÁCH TRẢ LỜI:
- Ngắn gọn phần tóm tắt, sau đó chi tiết hơn nếu cần.
- Dùng tiếng Việt thân thiện.
- Trình bày rõ ràng.
- Không đoán nếu web không ghi.

MỤC TIÊU:
- Giúp khách hiểu đúng thông tin về thương hiệu & sản phẩm dựa trên nội dung có sẵn trên website.
`.trim();

  // =======================
  // STYLE
  // =======================
  function injectStyles() {
    const css = `
      .ai-widget-button {
        position: fixed;
        bottom: 2px; /* đưa nút lên trên */
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 999px;
        border: 3px solid rgba(59,130,246,0.9);
        background: #0f172a;
        box-shadow: 0 12px 25px rgba(15,23,42,0.75);
        cursor: pointer;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .ai-widget-button video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 999px;
      }

      .ai-widget-button::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        box-shadow: 0 0 0 0 rgba(59,130,246,0.5);
        animation: ai-pulse 2.4s infinite;
      }

      @keyframes ai-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
        70%  { box-shadow: 0 0 0 16px rgba(59,130,246,0); }
        100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
      }

      .ai-chat-panel {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 360px;
        max-width: calc(100vw - 32px);
        height: 520px;
        background: rgba(15,23,42,0.98);
        border-radius: 18px;
        border: 1px solid rgba(51,65,85,0.9);
        box-shadow: 0 24px 80px rgba(15,23,42,0.9);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 999999;
      }

      .ai-chat-header {
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(51,65,85,0.9);
        background: linear-gradient(135deg,#020617,#0b1120);
      }

      .ai-chat-avatar-mini {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        overflow: hidden;
        border: 2px solid rgba(59,130,246,0.9);
      }
      .ai-chat-avatar-mini video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ai-chat-title { font-size: 13px; color: #e5e7eb; font-weight: 600; }
      .ai-chat-subtitle { font-size: 11px; color: #9ca3af; }
      .ai-chat-close { border: none; background: transparent; color: #9ca3af; cursor: pointer; font-size: 18px; }

      .ai-chat-body {
        flex: 1;
        padding: 10px 12px;
        overflow-y: auto;
        background: radial-gradient(circle at top left,rgba(56,189,248,0.10),transparent 60%);
      }

      .ai-msg { display: flex; margin-bottom: 10px; gap: 6px; font-size: 13px; }
      .ai-msg.user { justify-content: flex-end; }
      .ai-msg.ai { justify-content: flex-start; }
      .ai-msg-bubble {
        max-width: 80%;
        border-radius: 14px;
        padding: 8px 10px;
        white-space: pre-wrap;
      }
      .ai-msg.user .ai-msg-bubble {
        background: linear-gradient(135deg,#4f46e5,#8b5cf6);
        color:#f9fafb;
        border-bottom-right-radius: 4px;
      }
      .ai-msg.ai .ai-msg-bubble {
        background: rgba(15,23,42,0.98);
        border:1px solid rgba(55,65,81,0.9);
        color:#e5e7eb;
        border-bottom-left-radius:4px;
      }

      .ai-chat-input {
        border-top: 1px solid rgba(51,65,85,0.9);
        padding: 8px;
        background: #020617;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .ai-input-row { display:flex; gap:6px; }
      .ai-input-textarea {
        flex:1;
        min-height:40px;
        max-height:90px;
        resize:vertical;
        padding:7px 8px;
        border-radius:10px;
        border:1px solid rgba(55,65,81,0.9);
        background:rgba(15,23,42,0.96);
        color:#e5e7eb;
        font-size:13px;
      }

      .ai-send-btn {
        border:none;
        border-radius:999px;
        padding:0 14px;
        background:linear-gradient(135deg,#22c55e,#16a34a);
        color:#022c22;
        font-size:13px;
        font-weight:600;
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:4px;
      }

      @media (max-width: 640px) {
        .ai-chat-panel {
          right: 8px;
          left: 8px;
          height: 70vh;
          bottom: 90px;
        }
        .ai-widget-button {
          bottom: 16px;
          right: 16px;
        }
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // =======================
  // LOGIC WIDGET
  // =======================
  const conversation = [];
  let isSending = false;

  function createWidget() {
    // NÚT TRÒN (video)
    const btn = document.createElement("button");
    btn.className = "ai-widget-button";

    const vid = document.createElement("video");
    vid.src = "images/AI.mp4";
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    btn.appendChild(vid);

    document.body.appendChild(btn);

    // PANEL CHAT
    const panel = document.createElement("div");
    panel.className = "ai-chat-panel";
    panel.style.display = "none";

    panel.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-chat-avatar-mini">
            <video src="images/AI.mp4" autoplay loop muted playsinline></video>
          </div>
          <div>
            <div class="ai-chat-title">AI Trợ Lý</div>
            <div class="ai-chat-subtitle">Mít Sấy Vũ Trụ</div>
          </div>
        </div>
        <button class="ai-chat-close" title="Đóng">×</button>
      </div>

      <div class="ai-chat-body" id="aiChatBody">
        <div class="ai-msg ai">
          <div class="ai-msg-bubble">
Xin chào 👋
Mình là AI Trợ Lý của Mít Sấy Vũ Trụ.
Mình chỉ trả lời dựa trên nội dung có trong website mitsayvutru.space.

Bạn có thể hỏi:
- Thông tin về sản phẩm mít sấy
- Ưu điểm, cách bảo quản, cách đặt mua
- Chính sách giao hàng, đổi trả
- Thông tin liên hệ, mua sỉ

Mời bạn đặt câu hỏi nhé!
          </div>
        </div>
      </div>

      <div class="ai-chat-input">
        <div class="ai-chat-hint">
          Ví dụ: "Cho mình hỏi các gói sản phẩm mít sấy", "Cách bảo quản mít sấy để luôn giòn", "Số hotline của shop là gì?"...
        </div>
        <div class="ai-input-row">
          <textarea class="ai-input-textarea" id="aiInput" placeholder="Nhập câu hỏi của bạn về Mít Sấy Vũ Trụ..."></textarea>
          <button class="ai-send-btn" id="aiSendBtn">
            <span id="aiSendIcon">🚀</span> Gửi
          </button>
        </div>
        <div class="ai-status" id="aiStatus">Sẵn sàng.</div>
      </div>
    `;

    document.body.appendChild(panel);

    const closeBtn = panel.querySelector(".ai-chat-close");
    const bodyEl = panel.querySelector("#aiChatBody");
    const inputEl = panel.querySelector("#aiInput");
    const sendBtn = panel.querySelector("#aiSendBtn");
    const sendIcon = panel.querySelector("#aiSendIcon");
    const statusEl = panel.querySelector("#aiStatus");

    function setStatus(text, isError) {
      statusEl.textContent = text;
      if (isError) statusEl.classList.add("error");
      else statusEl.classList.remove("error");
    }

    function togglePanel() {
      const visible = panel.style.display !== "none";
      panel.style.display = visible ? "none" : "flex";
      if (!visible) inputEl.focus();
    }

    function appendMessage(role, text) {
      const msg = document.createElement("div");
      msg.className = "ai-msg " + (role === "user" ? "user" : "ai");
      const bubble = document.createElement("div");
      bubble.className = "ai-msg-bubble";
      bubble.textContent = text;
      msg.appendChild(bubble);
      bodyEl.appendChild(msg);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    async function sendMessage() {
      const text = inputEl.value.trim();
      if (!text || isSending) return;

      if (!CONFIG.apiKey || CONFIG.apiKey === "YOUR_API_KEY_HERE") {
        alert("Hãy cấu hình API key trong window.AI_WIDGET_CONFIG trước khi sử dụng.");
        return;
      }

      inputEl.value = "";
      appendMessage("user", text);
      conversation.push({ role: "user", content: text });

      isSending = true;
      sendBtn.disabled = true;
      sendIcon.textContent = "⏳";
      setStatus("Đang hỏi AI, vui lòng chờ...");

      try {
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversation.map((m) => ({ role: m.role, content: m.content })),
        ];

        const res = await fetch(CONFIG.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + CONFIG.apiKey,
          },
          body: JSON.stringify({
            model: CONFIG.model,
            messages: messages,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          appendMessage("ai", "Xin lỗi, mình gặp lỗi khi gọi API. Bạn thử lại sau nhé.");
          setStatus("Lỗi khi gọi API.", true);
          return;
        }

        const data = await res.json();
        let aiText = (data.choices && data.choices[0]?.message?.content) || "";

        if (!aiText) {
          aiText = "Mình không đọc được nội dung trả về từ API.";
        }

        conversation.push({ role: "assistant", content: aiText });
        appendMessage("ai", aiText);
        setStatus("Sẵn sàng.");
      } catch (e) {
        appendMessage("ai", "Có lỗi kết nối: " + e.message);
        setStatus("Lỗi kết nối.", true);
      } finally {
        isSending = false;
        sendBtn.disabled = false;
        sendIcon.textContent = "🚀";
      }
    }

    btn.addEventListener("click", togglePanel);
    closeBtn.addEventListener("click", togglePanel);

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectStyles();
      createWidget();
    });
  } else {
    injectStyles();
    createWidget();
  }
})();
