// =======================
// CẤU HÌNH CƠ BẢN
// =======================
(function () {
  // Nếu muốn, bạn có thể override từ ngoài:
  // window.AI_WIDGET_CONFIG = { apiKey: '...', apiUrl: '...', model: '...' }

  const DEFAULT_CONFIG = {
    // ⚠️ ĐỂ TEST: dán API key tạm vào đây
    // Khi đưa lên web public, NÊN gọi qua backend / Apps Script để giấu key
    apiKey: "YOUR_API_KEY_HERE",
    // Endpoint OpenAI-compatible (YEScale dùng endpoint tương tự OpenAI)
    apiUrl: "https://api.yescale.io/v1/chat/completions",
    model: "gpt-4o-mini",
  };

  const SYSTEM_PROMPT = `
Bạn là trợ lý AI tên là “AI Trợ Lý” hiển thị dưới dạng nút tròn nhỏ ở góc màn hình trên website của tôi. Nhiệm vụ của bạn là hỗ trợ mọi khách truy cập vào web một cách chủ động, thông minh, thân thiện và dễ hiểu.

MỤC TIÊU CHÍNH
1. Trả lời được hầu hết mọi câu hỏi của khách: kiến thức chung, học tập, kinh doanh, marketing, code, công nghệ…
2. Hỗ trợ riêng cho các tình huống liên quan đến website bán hàng, khóa học, dịch vụ của tôi (ví dụ: đặt hàng, tìm sản phẩm, tư vấn gói, hướng dẫn sử dụng web).
3. Giao tiếp tự nhiên bằng TIẾNG VIỆT là chính, có thể dùng tiếng Anh nếu khách yêu cầu.

PHONG CÁCH TRẢ LỜI
- Luôn:
  - Rõ ràng, ngắn gọn phần chính, có thể chi tiết hơn bên dưới.
  - Chủ động gợi ý bước tiếp theo, ví dụ: “Bạn có muốn mình viết sẵn nội dung / code / kịch bản luôn không?”
  - Giữ giọng điệu thân thiện, chuyên nghiệp, không dùng từ ngữ thiếu tôn trọng.
- Mặc định trả lời bằng tiếng Việt. 
  - Nếu người dùng hỏi bằng tiếng Anh hoặc yêu cầu “trả lời tiếng Anh”, thì trả lời bằng tiếng Anh.
- Ưu tiên trình bày có cấu trúc:
  - Dùng tiêu đề, gạch đầu dòng, đánh số bước.
  - Code thì đặt trong khối code, dễ copy.
- Không bịa về thông tin quan trọng như giá, chính sách, link nếu không chắc; hãy nói rõ: “Mình không có dữ liệu chính xác, bạn hãy kiểm tra trực tiếp trên website / trang quản lý.”

CÁCH HỎI LẠI NGƯỜI DÙNG
- Nếu yêu cầu chưa đủ rõ (ví dụ: “viết content giúp mình” nhưng không nói sản phẩm gì) thì:
  - Hỏi lại tối đa 2 câu ngắn để làm rõ: 
    - “Sản phẩm bạn muốn viết content là gì?”
    - “Bạn muốn đăng lên kênh nào (web, Facebook, TikTok, Zalo)?”
- Nếu vẫn mơ hồ, hãy đưa ra 1–2 phương án mẫu rồi hỏi: “Bạn chọn kiểu nào?”

NĂNG LỰC CHÍNH CỦA BẠN
1. Tư vấn & chăm sóc khách hàng
   - Giải thích:
     - Thông tin sản phẩm / dịch vụ (dạng chung, không bịa số liệu cụ thể nếu hệ thống không cung cấp).
     - Quy trình mua hàng, đặt hàng, thanh toán, nhận hàng.
     - Cách sử dụng web: “Làm sao để tìm sản phẩm?”, “Làm sao để liên hệ admin?”.
   - Giọng điệu: kiên nhẫn, dễ hiểu với người không rành công nghệ.

2. Viết content & marketing
   - Viết:
     - Mô tả sản phẩm chuẩn SEO.
     - Bài blog, outline bài viết, kịch bản video TikTok / Reels / Shorts.
     - Caption Facebook, tiêu đề, lời kêu gọi hành động (CTA).
   - Luôn hỏi rõ:
     - Sản phẩm/dịch vụ.
     - Tông giọng (vui vẻ, sang trọng, hài hước, nghiêm túc, v.v.).
     - Kênh đăng (web, fanpage, TikTok…).
   - Tối ưu:
     - Dùng từ ngữ phù hợp với người Việt.
     - Tránh nhồi nhét từ khóa quá nhiều, ưu tiên tự nhiên.

3. Hỗ trợ học tập, lập kế hoạch & phân tích
   - Giải thích khái niệm: marketing, SEO, KPI, tài chính, kinh doanh, kỹ thuật.
   - Giúp làm dàn ý, checklist, kế hoạch (ngày / tuần / tháng).
   - Phân tích logic dựa trên dữ liệu người dùng đưa (bảng số liệu, tóm tắt, mô tả).

4. Hỗ trợ kỹ thuật & code
   - Hỗ trợ HTML, CSS, JavaScript, Google Apps Script, n8n, API, v.v.
   - Khi viết code:
     - Đưa ví dụ đầy đủ, có thể chạy.
     - Giải thích ngắn: code này làm gì, dán vào đâu.
   - Khi sửa lỗi:
     - Yêu cầu người dùng gửi lỗi / đoạn code liên quan.
     - Phân tích từng bước, đề xuất giải pháp rõ ràng.

GIỚI HẠN & BẢO MẬT
- Không yêu cầu người dùng gửi thông tin nhạy cảm như mật khẩu, OTP, mã bảo mật, số thẻ đầy đủ.
- Nếu người dùng đòi thông tin vượt phạm vi cho phép (ví dụ: truy cập hệ thống nội bộ, dữ liệu không có), hãy từ chối khéo: 
  - “Phần này mình không có quyền truy cập, bạn hãy hỏi trực tiếp admin hoặc bộ phận hỗ trợ.”
- Không khẳng định chắc chắn về dữ liệu thời gian thực (giá, tồn kho, chính sách) nếu hệ thống hiện tại chưa cung cấp cho bạn.

ĐỊNH DẠNG CÂU TRẢ LỜI CHUẨN
Khi trả lời, cố gắng theo khung sau (linh hoạt tùy tình huống):

1. Tóm tắt ngắn gọn ý chính (1–2 câu).
2. Chi tiết theo mục / bước:
   - Mục 1 / Bước 1
   - Mục 2 / Bước 2
   - ...
3. Gợi ý hành động tiếp theo:
   - “Bạn có muốn mình viết luôn nội dung mẫu không?”
   - “Bạn có muốn mình chuyển thành đoạn code để dán vào web không?”
   - “Bạn có muốn mình gợi ý thêm 3 ý tưởng nữa không?”

VÍ DỤ CÁCH PHẢN HỒI
- Nếu người dùng nói: “Viết giúp mình bài quảng cáo cho sản phẩm X đăng Facebook”
  → Hỏi lại ngắn: “Bạn cho mình biết: X là sản phẩm gì, tông giọng bạn muốn (vui, sang, hài, nghiêm túc) và đối tượng khách hàng chính là ai nhé?”
  → Sau khi rõ, viết bài đầy đủ, có tiêu đề, nội dung, CTA.

- Nếu người dùng nói: “Code giúp mình form liên hệ gửi về Google Sheet”
  → Trả lời: giải thích ý tưởng, đưa code HTML + JS / Apps Script, hướng dẫn đặt ở đâu.

MỤC TIÊU TỔNG KẾT
- Hãy luôn coi mỗi người vào web là một khách hàng hoặc học viên tiềm năng.
- Nhiệm vụ của bạn: trả lời nhanh, rõ, hữu ích, giúp họ tiết kiệm thời gian và có cảm giác “wow, web này có AI hỗ trợ rất thông minh”.
- Luôn ưu tiên giúp người dùng đạt kết quả thực tế (viết được nội dung, sửa được code, hiểu được vấn đề, ra được quyết định), không chỉ nói lý thuyết.
`.trim();

  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.AI_WIDGET_CONFIG || {});

  // =======================
  // TẠO GIAO DIỆN WIDGET
  // =======================
  const conversation = []; // {role: "user" | "assistant", content: string}
  let isSending = false;

  function createStyles() {
    const css = `
      .ai-widget-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 64px;
        height: 64px;
        border-radius: 999px;
        border: 3px solid rgba(59,130,246,0.9);
        background: #0f172a url("images/AI.jpg") center/cover no-repeat;
        box-shadow: 0 12px 25px rgba(15,23,42,0.75);
        cursor: pointer;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
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
        0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45);}
        70%{ box-shadow: 0 0 0 16px rgba(59,130,246,0);}
        100%{box-shadow: 0 0 0 0 rgba(59,130,246,0);}
      }

      .ai-chat-panel {
        position: fixed;
        bottom: 100px;
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
      .ai-chat-header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ai-chat-avatar-mini {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: url("images/AI.jpg") center/cover no-repeat;
        border: 2px solid rgba(59,130,246,0.9);
      }
      .ai-chat-title {
        font-size: 13px;
        color: #e5e7eb;
        font-weight: 600;
      }
      .ai-chat-subtitle {
        font-size: 11px;
        color: #9ca3af;
      }
      .ai-chat-close {
        border: none;
        background: transparent;
        color: #9ca3af;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        padding: 2px 6px;
      }
      .ai-chat-body {
        flex: 1;
        padding: 10px 12px;
        overflow-y: auto;
        background: radial-gradient(circle at top left,rgba(56,189,248,0.10),transparent 60%);
      }
      .ai-msg {
        display: flex;
        margin-bottom: 10px;
        gap: 6px;
        font-size: 13px;
      }
      .ai-msg.ai {
        justify-content: flex-start;
      }
      .ai-msg.user {
        justify-content: flex-end;
      }
      .ai-msg-bubble {
        max-width: 80%;
        border-radius: 14px;
        padding: 8px 10px;
        white-space: pre-wrap;
        word-wrap: break-word;
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
      .ai-chat-hint {
        font-size: 10px;
        color:#9ca3af;
      }
      .ai-input-row {
        display:flex;
        gap:6px;
      }
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
        white-space:nowrap;
      }
      .ai-send-btn:disabled {
        opacity:0.6;
        cursor:not-allowed;
      }
      .ai-status {
        font-size:10px;
        color:#6b7280;
      }
      .ai-status.error {
        color:#f97373;
      }

      @media (max-width: 640px) {
        .ai-chat-panel {
          right: 8px;
          left: 8px;
          width: auto;
          height: 70vh;
          bottom: 90px;
        }
        .ai-widget-button {
          bottom: 16px;
          right: 16px;
          width: 56px;
          height: 56px;
        }
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createWidget() {
    // Nút tròn
    const btn = document.createElement("button");
    btn.className = "ai-widget-button";
    btn.setAttribute("aria-label", "Mở AI Trợ Lý");
    document.body.appendChild(btn);

    // Panel chat
    const panel = document.createElement("div");
    panel.className = "ai-chat-panel";
    panel.style.display = "none";

    panel.innerHTML = `
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <div class="ai-chat-avatar-mini"></div>
          <div>
            <div class="ai-chat-title">AI Trợ Lý</div>
            <div class="ai-chat-subtitle">Hỏi gì cũng hỗ trợ được</div>
          </div>
        </div>
        <button class="ai-chat-close" title="Đóng">×</button>
      </div>
      <div class="ai-chat-body" id="aiChatBody">
        <div class="ai-msg ai">
          <div class="ai-msg-bubble">
Xin chào 👋  
Mình là AI Trợ Lý trên website này.  
Bạn có thể hỏi mình về:
- Viết content, ý tưởng marketing
- Tư vấn sản phẩm / dịch vụ
- Hỗ trợ học tập, lập kế hoạch
- Hỗ trợ code: HTML, JS, Apps Script, n8n...

Bạn cần gì, cứ nhắn cho mình nhé!
          </div>
        </div>
      </div>
      <div class="ai-chat-input">
        <div class="ai-chat-hint">
          Gợi ý: "Viết giúp mình bài quảng cáo cho sản phẩm...", "Giải thích giúp KPI này", "Code form gửi lên Google Sheet"...
        </div>
        <div class="ai-input-row">
          <textarea class="ai-input-textarea" id="aiInput" placeholder="Nhập câu hỏi hoặc yêu cầu của bạn..."></textarea>
          <button class="ai-send-btn" id="aiSendBtn">
            <span id="aiSendIcon">🚀</span>
            Gửi
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
      if (isError) {
        statusEl.classList.add("error");
      } else {
        statusEl.classList.remove("error");
      }
    }

    function togglePanel() {
      const visible = panel.style.display !== "none";
      panel.style.display = visible ? "none" : "flex";
      if (!visible) {
        inputEl.focus();
      }
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
        alert("Hãy cấu hình API key trong ai-widget.js (CONFIG.apiKey) hoặc window.AI_WIDGET_CONFIG trước khi sử dụng.");
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
          console.error("AI error:", errText);
          appendMessage("ai", "Xin lỗi, mình gặp lỗi khi gọi API. Bạn thử lại sau nhé.");
          setStatus("Lỗi khi gọi API (kiểm tra key / model / endpoint).", true);
          return;
        }

        const data = await res.json();
        let aiText = "";
        if (data.choices && data.choices[0] && data.choices[0].message) {
          aiText = data.choices[0].message.content || "";
        }
        if (!aiText) {
          aiText = "Mình không đọc được nội dung trả về từ API, bạn kiểm tra lại cấu hình nhé.";
        }

        conversation.push({ role: "assistant", content: aiText });
        appendMessage("ai", aiText);
        setStatus("Sẵn sàng. Bạn có thể hỏi tiếp.");
      } catch (e) {
        console.error(e);
        appendMessage("ai", "Có lỗi kết nối mạng hoặc lỗi không xác định: " + e.message);
        setStatus("Lỗi kết nối mạng hoặc lỗi không xác định.", true);
      } finally {
        isSending = false;
        sendBtn.disabled = false;
        sendIcon.textContent = "🚀";
      }
    }

    // Events
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

  // Khởi tạo sau khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createStyles();
      createWidget();
    });
  } else {
    createStyles();
    createWidget();
  }
})();
