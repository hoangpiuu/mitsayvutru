// === music.js ===
// Tự động phát nhạc nền khi người dùng truy cập trang
// File nhạc: /music/1.mp3

const music = new Audio("music/1.mp3");
music.loop = true;      // Phát lặp lại liên tục
music.volume = 0;       // Bắt đầu nhỏ để fade in mượt
let volume = 0;

// Hàm phát nhạc với hiệu ứng fade-in
function playMusicSmoothly() {
  music.play().then(() => {
    const fade = setInterval(() => {
      if (volume < 0.8) { // chỉnh 0.8 = 80% âm lượng
        volume += 0.02;
        music.volume = volume;
      } else {
        clearInterval(fade);
      }
    }, 200);
  }).catch(() => {
    console.log("⚠️ Trình duyệt chặn tự động phát. Nhạc sẽ phát khi người dùng tương tác.");
  });
}

// Khi người dùng có hành động đầu tiên → phát nhạc
const startMusic = () => {
  playMusicSmoothly();
  document.removeEventListener("click", startMusic);
  document.removeEventListener("scroll", startMusic);
  document.removeEventListener("keydown", startMusic);
};

// Thêm các sự kiện kích hoạt
document.addEventListener("click", startMusic);
document.addEventListener("scroll", startMusic);
document.addEventListener("keydown", startMusic);

// Nếu trình duyệt cho phép autoplay, phát luôn
playMusicSmoothly();
