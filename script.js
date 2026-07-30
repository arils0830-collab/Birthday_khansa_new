const PASSWORD = "khansa";

const photoFiles = [
  "images/foto1.jpeg", "images/foto2.jpeg", "images/foto3.jpeg",
  "images/foto4.jpeg", "images/foto5.jpeg", "images/foto6.jpeg",
  "images/foto7.jpeg", "images/foto8.jpeg", "images/foto9.jpeg",
  "images/foto10.jpeg", "images/foto11.jpeg", "images/foto12.jpeg",
  "images/foto13.jpeg", "images/foto14.jpeg", "images/foto15.jpeg",
  "images/foto16.jpeg", "images/foto17.jpeg", "images/foto18.jpeg",
];

let currentScene = "opening";
let musicStarted = false;
let candleBlown = false;

let currentPhoto = 0;
let photoTimer;
const photoCaptions = [
  "A little moment with you...",
  "You make ordinary moments feel special.",
  "My favorite place is next to you.",
  "Some memories are worth keeping forever.",
  "Your smile is one of my favorite things.",
  "Just us, being us 🤍",
  "A beautiful chapter of our story.",
  "I would choose this moment again.",
  "And I would still choose you."
];

const cinemaImage = document.getElementById("cinemaImage");
const cinemaCounter = document.getElementById("cinemaCounter");
const cinemaCaption = document.getElementById("cinemaCaption");
const cinemaDots = document.getElementById("cinemaDots");

photoFiles.forEach((src, i) => {
  const dot = document.createElement("button");
  dot.className = "cinema-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", "Foto " + (i + 1));
  dot.onclick = () => showPhoto(i);
  cinemaDots.appendChild(dot);
});

function showPhoto(index, direction = 1) {
  currentPhoto = (index + photoFiles.length) % photoFiles.length;
  cinemaImage.classList.remove("cinematic-in");
  cinemaImage.style.opacity = "0";
  cinemaImage.style.transform = direction > 0 ? "scale(1.16) translateX(2%)" : "scale(1.16) translateX(-2%)";

  setTimeout(() => {
    cinemaImage.src = photoFiles[currentPhoto];
    cinemaImage.alt = "Memory Khansa " + (currentPhoto + 1);
    cinemaCounter.textContent = String(currentPhoto + 1).padStart(2, "0") + " / " + String(photoFiles.length).padStart(2, "0");
    cinemaCaption.textContent = photoCaptions[currentPhoto];
    cinemaImage.style.opacity = "1";
    cinemaImage.style.transform = "scale(1.08)";
    void cinemaImage.offsetWidth;
    cinemaImage.classList.add("cinematic-in");

    document.querySelectorAll(".cinema-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentPhoto);
    });
  }, 280);

  clearTimeout(photoTimer);
  photoTimer = setTimeout(() => nextPhoto(), 7000);
}

function nextPhoto() { showPhoto(currentPhoto + 1, 1); }
function prevPhoto() { showPhoto(currentPhoto - 1, -1); }

showPhoto(0);

let touchStartX = 0;
let touchEndX = 0;
document.getElementById("gallery").addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});
document.getElementById("gallery").addEventListener("touchend", e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 45) nextPhoto();
  if (touchEndX > touchStartX + 45) prevPhoto();
}, {passive: true});

function beginStory() {
    const audio = document.getElementById("music");

    if (!musicStarted) {
        audio.volume = 0.5; // opsional

        audio.play().then(() => {
            musicStarted = true;
            document.getElementById("musicToggle").textContent = "🔊";
        }).catch(err => {
            console.log("Audio gagal diputar:", err);
        });
    }

    goTo("password");
}
function goTo(id) {

    document.querySelectorAll(".scene").forEach(s=>{
        s.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
    currentScene = id;
    window.scrollTo(0,0);

    if (id === "birthday") {
        setTimeout(()=>{
            launchConfetti();
            startFireworks();
        },700);
    }
}

function checkPassword() {
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("wrongPassword");
  if (input.value.trim().toLowerCase() === PASSWORD) {
    error.textContent = "";
    goTo("memories");
  } else {
    error.textContent = "Password-nya salah 😝 Coba lagi...";
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 500);
  }
}

document.getElementById("passwordInput").addEventListener("keydown", e => {
  if (e.key === "Enter") checkPassword();
});

function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;
  document.getElementById("flame").style.display = "none";
  document.getElementById("cakeMessage").textContent = "Wish granted ✨🤍";
  document.getElementById("letterBtn").classList.remove("hidden");
  launchConfetti();
  startFireworks();
}

function openLetter() {
  document.getElementById("envelope").classList.add("open");
  setTimeout(() => {
    document.getElementById("letterPaper").classList.add("show");
  }, 500);
}

function launchConfetti() {
  const container = document.getElementById("confetti");
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDelay = Math.random() * 1.5 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.background = ["#c88d91", "#c5a36a", "#8e6c65", "#f1d4d0", "#fff"][Math.floor(Math.random()*5)];
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

let fireworksStarted = false;
function startFireworks() {
  if (fireworksStarted) return;
  fireworksStarted = true;
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(x, y) {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1
      });
    }
  }

  setInterval(() => {
    if (currentScene === "birthday") {
      burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.15 + Math.random() * .45));
    }
  }, 1600);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .025; p.life -= .012;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(animate);
  }
  animate();
}

function toggleMusic() {
  const audio = document.getElementById("music");
  if (!audio.src || audio.src.endsWith("/")) {
    alert("Tambahkan file musik bernama music.mp3 ke folder utama website terlebih dahulu 🎵");
    return;
  }
  if (audio.paused) {
    audio.play();
    document.getElementById("musicToggle").textContent = "🔊";
  } else {
    audio.pause();
    document.getElementById("musicToggle").textContent = "🔇";
  }
}

function replay() {
  candleBlown = false;
  document.getElementById("flame").style.display = "block";
  document.getElementById("cakeMessage").textContent = "Klik kuenya untuk meniup lilin ✨";
  document.getElementById("letterBtn").classList.add("hidden");
  document.getElementById("envelope").classList.remove("open");
  document.getElementById("letterPaper").classList.remove("show");
  document.getElementById("passwordInput").value = "";
  goTo("opening");
}


document.addEventListener("keydown", e => {
  if (currentScene === "memories") {
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  }
});
