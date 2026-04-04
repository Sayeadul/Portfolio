// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const glow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  glowX += (mouseX - glowX) * 0.05;
  glowY += (mouseY - glowY) * 0.05;
  glow.style.left = glowX + 'px';
  glow.style.top = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover detection
document.querySelectorAll('a, button, .service-card, .project-card, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
});

// Card spotlight follow
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ===== PARTICLE TRAIL =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.size = Math.random() * 3.5 + 0.8;
    this.speedX = (Math.random() - 0.5) * 2.5;
    this.speedY = (Math.random() - 0.5) * 2.5;
    this.life = 1;
    this.decay = Math.random() * 0.018 + 0.012;
    this.hue = Math.random() > 0.6 ? '0,240,255' : '200,255,46';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.98;
    this.speedY *= 0.98;
    this.life -= this.decay;
    this.size *= 0.985;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hue},${this.life * 0.5})`;
    ctx.fill();
  }
}

let lastPTime = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastPTime > 25) {
    for (let i = 0; i < 4; i++) particles.push(new Particle(e.clientX, e.clientY));
    lastPTime = now;
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(200,255,46,${(1 - dist / 60) * 0.12 * Math.min(particles[i].life, particles[j].life)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-label, .section-title, .service-card, .project-card, .p-step').forEach(el => observer.observe(el));

document.querySelectorAll('.services-grid .service-card').forEach((c, i) => { c.style.transitionDelay = (i * 0.13) + 's'; });
document.querySelectorAll('.portfolio-grid .project-card').forEach((c, i) => { c.style.transitionDelay = (i * 0.13) + 's'; });
document.querySelectorAll('.process-track .p-step').forEach((s, i) => { s.style.transitionDelay = (i * 0.13) + 's'; });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
