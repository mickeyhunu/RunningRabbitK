/* ── Custom Cursor ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
const lerp = (a, b, t) => a + (b - a) * t;
;(function tick() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx = lerp(rx, mx, 0.14); ry = lerp(ry, my, 0.14);
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width='22px'; cur.style.height='22px'; cur.style.background='var(--gold)'; ring.style.width='52px'; ring.style.height='52px'; });
  el.addEventListener('mouseleave', () => { cur.style.width='12px'; cur.style.height='12px'; cur.style.background='var(--ruby-g)'; ring.style.width='36px'; ring.style.height='36px'; });
});

/* ── Particle Canvas ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
resize(); window.addEventListener('resize', resize);

const PARTICLES = Array.from({length: 55}, () => ({
  x: Math.random() * W, y: Math.random() * H,
  r: Math.random() * 1.5 + 0.3,
  vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
  a: Math.random(),
  color: Math.random() > 0.5 ? `rgba(245,200,66,` : `rgba(232,25,60,`
}));
;(function draw() {
  ctx.clearRect(0, 0, W, H);
  PARTICLES.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.a += 0.008;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    const alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.55 + 0.05;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + alpha + ')';
    ctx.fill();
  });
  for (let i = 0; i < PARTICLES.length; i++) {
    for (let j = i + 1; j < PARTICLES.length; j++) {
      const dx = PARTICLES[i].x - PARTICLES[j].x;
      const dy = PARTICLES[i].y - PARTICLES[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
        ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
        ctx.strokeStyle = `rgba(245,200,66,${(1 - d/110) * 0.07})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
})();

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 60);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── FAQ ── */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-btn').setAttribute('aria-expanded','false'); });
    if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
  });
});
