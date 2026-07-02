/* ── DevTools Protection ── */
const isLocalEnv = window.MNMS_PUBLIC_CONFIG?.isLocalEnv === true;
const isAdminPath = /^\/admin(?:\/|$)/.test(window.location.pathname);
const shouldEnablePageProtection = !isLocalEnv && !isAdminPath;

const devToolsProtectionSessionKey = 'rr-devtools-protection-active';

const rememberDevToolsProtectionState = () => {
  try {
    window.sessionStorage.setItem(devToolsProtectionSessionKey, '1');
  } catch (_error) {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
};

const forgetDevToolsProtectionState = () => {
  try {
    window.sessionStorage.removeItem(devToolsProtectionSessionKey);
  } catch (_error) {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
};

let hasClearedDocumentForDevTools = false;

const clearCurrentDocumentAndShowDevToolsOverlay = () => {
  if (hasClearedDocumentForDevTools) return;
  hasClearedDocumentForDevTools = true;
  rememberDevToolsProtectionState();

  document.open();
  document.write(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>화면 보호</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; min-height: 100%; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(8, 5, 9, 0.98);
      color: #f8f0d6;
      text-align: center;
      font-family: 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .devtools-blocked-card {
      max-width: 520px;
      width: min(100%, 520px);
      padding: 34px 28px;
      border: 1px solid rgba(245, 200, 66, 0.45);
      border-radius: 22px;
      background: linear-gradient(145deg, rgba(48, 12, 22, 0.94), rgba(12, 8, 13, 0.96));
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
    }
    strong {
      display: block;
      margin-bottom: 12px;
      color: #f5c842;
      font-size: clamp(1.4rem, 4vw, 2rem);
      letter-spacing: 0.08em;
    }
    p {
      margin: 0;
      font-size: clamp(1rem, 3vw, 1.2rem);
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <main class="devtools-blocked-card" role="alert" aria-live="assertive">
    <strong>화면 보호</strong>
    <p>개발자 도구 사용이 감지되어 기존 화면 내용을 삭제했습니다.</p>
  </main>
</body>
</html>`);
  document.close();
};

const isDevToolsLikelyOpen = () => {
  const detector = window.devtoolsDetector;
  if (detector?.isOpen === true || detector?.isOpen === 'true') return true;

  const widthGap = Math.abs((window.outerWidth || 0) - (window.innerWidth || 0));
  const heightGap = Math.abs((window.outerHeight || 0) - (window.innerHeight || 0));
  return widthGap > 160 || heightGap > 160;
};

if (shouldEnablePageProtection) {
  const detector = window.devtoolsDetector;

  if (isDevToolsLikelyOpen()) {
    clearCurrentDocumentAndShowDevToolsOverlay();
  } else {
    forgetDevToolsProtectionState();
  }

  if (detector?.addListener) {
    detector.addListener(isOpen => {
      if (isOpen) clearCurrentDocumentAndShowDevToolsOverlay();
    });
    detector.launch?.();

    if (isDevToolsLikelyOpen()) {
      clearCurrentDocumentAndShowDevToolsOverlay();
    }
  }

  ['contextmenu', 'dragstart', 'drop', 'selectstart'].forEach(eventName => {
    document.addEventListener(eventName, event => event.preventDefault());
  });

  document.addEventListener('mousedown', event => {
    if (event.detail > 1) event.preventDefault();
  });

  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed) selection.removeAllRanges();
  });
}

if (hasClearedDocumentForDevTools) {
  throw new Error('Page mount blocked because DevTools is open.');
}

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

/* ── Community Reviews ── */
const communityReviewList = document.getElementById('community-review-list');
const communityReviewStatus = document.getElementById('community-review-status');
const communityReviewKeywords = ['달토', 'ㄷㅌ'];
const communityReviewApiUrl = 'https://nightmens.com/api/posts/search-signal';
const communityReviewBoard = '후기';

const normalizeReviewUrl = url => {
  if (!url) return '#reviews';
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.hostname === 'localhost') {
      parsed.protocol = 'https:';
      parsed.hostname = 'nightmens.com';
      parsed.port = '';
    }
    return parsed.href;
  } catch (_error) {
    return '#reviews';
  }
};

const formatReviewDate = value => {
  if (!value) return '날짜 미상';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '날짜 미상';
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
};

const openReviewUrl = url => {
  if (url === '#reviews') {
    window.location.hash = 'reviews';
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
};

const createReviewCard = review => {
  const reviewUrl = normalizeReviewUrl(review.url);
  const card = document.createElement('article');
  card.className = 'rv community-review-card reveal in';
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.dataset.href = reviewUrl;
  card.addEventListener('click', () => openReviewUrl(reviewUrl));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openReviewUrl(reviewUrl);
    }
  });

  const date = document.createElement('p');
  date.className = 'community-review-date';
  date.textContent = formatReviewDate(review.createdAt || review.updatedAt);

  const title = document.createElement('h4');
  title.className = 'community-review-title';
  title.textContent = review.title || '제목 없는 후기';

  const content = document.createElement('p');
  content.className = 'community-review-content';
  content.textContent = review.content || '내용을 확인하려면 후기를 클릭해 주세요.';

  const more = document.createElement('a');
  more.className = 'community-review-more';
  more.href = reviewUrl;
  more.target = '_blank';
  more.rel = 'noopener noreferrer';
  more.textContent = '후기 자세히 보기 →';
  more.addEventListener('click', event => event.stopPropagation());

  card.append(date, title, content, more);
  return card;
};

const loadCommunityReviews = async () => {
  if (!communityReviewList || !communityReviewStatus) return;

  try {
    const responses = await Promise.allSettled(
      communityReviewKeywords.map(keyword => {
        const params = new URLSearchParams({ board: communityReviewBoard, keyword });
        return fetch(`${communityReviewApiUrl}?${params.toString()}`).then(response => {
          if (!response.ok) throw new Error('커뮤니티 후기 API 요청 실패');
          return response.json();
        });
      })
    );

    const reviews = responses
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => Array.isArray(result.value.content) ? result.value.content : [])
      .filter(review => review && review.id)
      .filter((review, index, all) => all.findIndex(item => item.id === review.id) === index)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    communityReviewList.replaceChildren(...reviews.map(createReviewCard));
    communityReviewStatus.textContent = reviews.length ? '' : '등록된 커뮤니티 후기가 없습니다.';
    communityReviewStatus.classList.toggle('is-hidden', reviews.length > 0);
  } catch (error) {
    communityReviewStatus.textContent = '커뮤니티 후기를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
    console.error(error);
  }
};

loadCommunityReviews();

/* ── Kakao Location Map ── */
const initKakaoMap = () => {
  const mapElement = document.getElementById('kakao-map');
  if (!mapElement) return;

  const fallback = mapElement.querySelector('.map-fallback');
  const address = mapElement.dataset.address || '서울특별시 강남구 봉은사로 150';
  const placeName = mapElement.dataset.placeName || '강남달토 (달리는토끼)';

  const showMapFallback = message => {
    if (fallback) fallback.textContent = message;
  };

  if (!window.kakao || !window.kakao.maps) {
    showMapFallback('카카오 지도 스크립트를 불러오지 못했습니다. 지도 링크를 이용해 주세요.');
    return;
  }

  window.kakao.maps.load(() => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || !result.length) {
        showMapFallback('주소 좌표를 찾지 못했습니다. 지도 링크를 이용해 주세요.');
        return;
      }

      const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x));
      const map = new window.kakao.maps.Map(mapElement, {
        center: coords,
        level: 3,
      });
      const marker = new window.kakao.maps.Marker({
        map,
        position: coords,
      });
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:8px 12px;font-size:13px;color:#111;white-space:nowrap;">${placeName}</div>`,
      });

      infoWindow.open(map, marker);
      window.addEventListener('resize', () => map.setCenter(coords));
    });
  });
};

initKakaoMap();
