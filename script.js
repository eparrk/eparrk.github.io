// Moving particle network background
// Dots drift slowly; nearby dots (and your mouse) get joined by faint lines.

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

const SETTINGS = {
  density: 11000,     // lower = more dots
  maxDots: 140,
  speed: 0.25,        // how fast dots drift
  linkDistance: 150,  // how close dots must be to connect
  mouseDistance: 180,
  dotColor: '200, 200, 230',
  lineColor: '170, 175, 220'
};

let dots = [];
let width, height, dpr;
const mouse = { x: null, y: null };

function resize() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(SETTINGS.maxDots, Math.floor((width * height) / SETTINGS.density));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SETTINGS.speed * 2,
    vy: (Math.random() - 0.5) * SETTINGS.speed * 2,
    r: Math.random() * 1.6 + 0.8
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const d of dots) {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < 0 || d.x > width) d.vx *= -1;
    if (d.y < 0 || d.y > height) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${SETTINGS.dotColor}, 0.7)`;
    ctx.fill();
  }

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < SETTINGS.linkDistance) {
        ctx.strokeStyle = `rgba(${SETTINGS.lineColor}, ${0.35 * (1 - dist / SETTINGS.linkDistance)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dist = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
      if (dist < SETTINGS.mouseDistance) {
        ctx.strokeStyle = `rgba(165, 216, 240, ${0.45 * (1 - dist / SETTINGS.mouseDistance)})`;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });

resize();

// Respect people who turn off motion in their system settings
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  SETTINGS.speed = 0;
  dots.forEach(d => { d.vx = 0; d.vy = 0; });
}
draw();
