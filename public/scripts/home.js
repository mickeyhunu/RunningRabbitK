/* ── DevTools Block Guard ── */
const isLocalhostEnvironment = ['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(window.location.hostname);

const devToolsBlockGuard = (() => {
  const state = { isDevToolsBlocked: false };
  const threshold = 160;

  const recordBlockedState = () => {
    state.isDevToolsBlocked = true;
    window.isDevToolsBlocked = true;
    window.__isDevToolsBlocked = true;
    document.documentElement.dataset.devToolsBlocked = 'true';

    try {
      sessionStorage.setItem('isDevToolsBlocked', 'true');
    } catch (_error) {
      // Storage may be unavailable in privacy-restricted contexts.
    }
  };

  const isDetected = () => (
    window.outerWidth - window.innerWidth > threshold
    || window.outerHeight - window.innerHeight > threshold
  );

  const createOverlay = () => {
    const overlay = document.createElement('main');
    overlay.className = 'devtools-block-overlay';
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('aria-live', 'assertive');

    const panel = document.createElement('section');
    panel.className = 'devtools-block-panel';

    const title = document.createElement('h1');
    title.textContent = '접근이 일시적으로 제한되었습니다';

    const message = document.createElement('p');
    message.textContent = '안전한 이용을 위해 개발자도구가 감지된 상태에서는 페이지를 표시할 수 없습니다. 개발자도구를 닫은 뒤 새로고침해 주세요.';

    panel.append(title, message);
    overlay.append(panel);
    return overlay;
  };

  const injectOverlayStyles = () => {
    if (document.getElementById('devtools-block-style')) return;

    const style = document.createElement('style');
    style.id = 'devtools-block-style';
    style.textContent = `
      html[data-dev-tools-blocked="true"],
      html[data-dev-tools-blocked="true"] body {
        min-height: 100%;
        margin: 0;
        overflow: hidden;
        background: #050307;
      }

      .devtools-block-overlay {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        color: #f8efe7;
        background:
          radial-gradient(circle at 50% 0%, rgba(245, 200, 66, 0.18), transparent 34%),
          linear-gradient(135deg, #050307 0%, #13080d 52%, #050307 100%);
        font-family: 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        text-align: center;
      }

      .devtools-block-panel {
        max-width: 520px;
        padding: 42px 32px;
        border: 1px solid rgba(245, 200, 66, 0.35);
        border-radius: 24px;
        background: rgba(8, 5, 9, 0.86);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
      }

      .devtools-block-panel h1 {
        margin: 0 0 16px;
        color: #f5c842;
        font-size: clamp(1.6rem, 5vw, 2.4rem);
        line-height: 1.25;
      }

      .devtools-block-panel p {
        margin: 0;
        color: rgba(248, 239, 231, 0.78);
        font-size: 1rem;
        line-height: 1.8;
      }
    `;
    document.head.append(style);
  };

  const block = () => {
    if (state.isDevToolsBlocked) return true;

    recordBlockedState();
    injectOverlayStyles();

    if (document.body) {
      document.body.replaceChildren(createOverlay());
    }

    return true;
  };

  return {
    get isDevToolsBlocked() {
      return state.isDevToolsBlocked;
    },
    block,
    detectAndBlock: () => (isDetected() ? block() : false),
  };
})();

if (isLocalhostEnvironment || !devToolsBlockGuard.detectAndBlock()) {
if (!isLocalhostEnvironment) {
  const detectDevToolsOpening = () => {
    devToolsBlockGuard.detectAndBlock();
  };

  window.addEventListener('resize', detectDevToolsOpening);
  window.addEventListener('focus', detectDevToolsOpening);
  setInterval(detectDevToolsOpening, 1000);
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


/* ── Sub Navigation Scroll Spy ── */
const subnavLinks = Array.from(document.querySelectorAll('.subnav-links a[href^="#"]'));
const subnavSections = subnavLinks
  .map(link => {
    const id = link.getAttribute('href').slice(1);
    return { link, section: document.getElementById(id) };
  })
  .filter(item => item.section);

const setActiveSubnavLink = activeId => {
  subnavSections.forEach(({ link, section }) => {
    const isActive = section.id === activeId;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (subnavSections.length) {
  const getCurrentSectionId = () => {
    const viewportAnchor = window.scrollY + Math.max(140, window.innerHeight * 0.32);
    const current = subnavSections.reduce((active, item) => (
      item.section.offsetTop <= viewportAnchor ? item : active
    ), subnavSections[0]);

    return current.section.id;
  };

  const updateActiveSubnavLink = () => setActiveSubnavLink(getCurrentSectionId());

  subnavLinks.forEach(link => {
    link.addEventListener('click', () => setActiveSubnavLink(link.getAttribute('href').slice(1)));
  });

  window.addEventListener('scroll', updateActiveSubnavLink, { passive: true });
  window.addEventListener('resize', updateActiveSubnavLink);
  updateActiveSubnavLink();
}

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


/* ── Live Signal Info ── */
const liveInfoStatus = document.getElementById('live-info-status');
const liveRoomCount = document.getElementById('live-room-count');
const liveWaitCount = document.getElementById('live-wait-count');
const liveRoomUpdated = document.getElementById('live-room-updated');
const liveRoomDetail = document.getElementById('live-room-detail');
const liveEntryCount = document.getElementById('live-entry-count');
const liveEntryList = document.getElementById('live-entry-list');
const liveSignalBaseUrl = 'https://nightmens.com/api/live/signal';

const formatLiveDateTime = value => {
  if (!value) return '시간 확인 중';
  const normalized = String(value).replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date);
};

const escapeLiveHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const fetchLiveSignal = async (type, limit) => {
  const params = new URLSearchParams({ storeNo: '1', type, limit: String(limit) });
  const response = await fetch(`${liveSignalBaseUrl}?${params.toString()}`);
  if (!response.ok) throw new Error(`${type} 실시간 정보 요청 실패`);
  return response.json();
};

const renderRoomDetail = roomDetailValue => {
  if (!liveRoomDetail) return;

  let detail = roomDetailValue;
  if (typeof detail === 'string') {
    try {
      detail = JSON.parse(detail);
    } catch (_error) {
      liveRoomDetail.innerHTML = `<p class="live-empty">${escapeLiveHtml(detail)}</p>`;
      return;
    }
  }

  if (!detail || typeof detail !== 'object') {
    liveRoomDetail.innerHTML = '<p class="live-empty">룸 상세 정보가 없습니다.</p>';
    return;
  }

  const floors = Object.entries(detail).map(([floorName, rooms]) => {
    const roomItems = Object.entries(rooms || {}).map(([roomType, count]) => `
      <div class="room-type"><span>${escapeLiveHtml(roomType)}</span><strong>${escapeLiveHtml(count)}</strong></div>
    `).join('');

    return `
      <div class="room-floor">
        <p class="room-floor-title">${escapeLiveHtml(floorName)}</p>
        <div class="room-type-grid">${roomItems}</div>
      </div>
    `;
  }).join('');

  liveRoomDetail.innerHTML = floors || '<p class="live-empty">룸 상세 정보가 없습니다.</p>';
};

const isRelaxedLiveRoomCount = value => String(value ?? '').trim() === '999';
const formatLiveRoomCount = value => (isRelaxedLiveRoomCount(value) ? '여유' : (value ?? '-'));

const renderLiveRoom = data => {
  const latestRoom = Array.isArray(data.content) ? data.content[0] : null;
  if (!latestRoom) throw new Error('룸 현황 데이터 없음');

  if (liveRoomCount) {
    liveRoomCount.textContent = formatLiveRoomCount(latestRoom.roomInfo);
    liveRoomCount.classList.toggle('is-relaxed', isRelaxedLiveRoomCount(latestRoom.roomInfo));
  }
  if (liveWaitCount) {
    liveWaitCount.textContent = latestRoom.waitInfo ?? '-';
    liveWaitCount.classList.toggle('is-relaxed', isRelaxedLiveRoomCount(latestRoom.roomInfo));
  }
  if (liveRoomUpdated) liveRoomUpdated.textContent = `기준 ${formatLiveDateTime(latestRoom.snapshotAt || latestRoom.updatedAt)}`;
  renderRoomDetail(latestRoom.roomDetail);
};

const renderLiveEntries = data => {
  const entries = Array.isArray(data.content) ? data.content : [];
  if (liveEntryCount) liveEntryCount.textContent = `총 ${data.totalElements ?? entries.length}명`;

  if (!liveEntryList) return;
  if (!entries.length) {
    liveEntryList.innerHTML = '<p class="live-empty">오늘 등록된 엔트리가 없습니다.</p>';
    return;
  }

  liveEntryList.innerHTML = entries.map(entry => `
    <span class="entry-chip">${escapeLiveHtml(entry.workerName || '이름 미상')}</span>
  `).join('');
};

const loadLiveInfo = async () => {
  if (!liveInfoStatus && !liveRoomDetail && !liveEntryList) return;

  try {
    const [roomData, entryData] = await Promise.all([
      fetchLiveSignal('room', 1),
      fetchLiveSignal('entry', 200),
    ]);

    renderLiveRoom(roomData);
    renderLiveEntries(entryData);

    if (liveInfoStatus) {
      liveInfoStatus.textContent = '실시간 정보를 업데이트했습니다.';
      liveInfoStatus.classList.add('is-hidden');
    }
  } catch (error) {
    if (liveInfoStatus) {
      liveInfoStatus.textContent = '실시간 정보를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.';
      liveInfoStatus.classList.remove('is-hidden');
    }
    console.error(error);
  }
};

loadLiveInfo();

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

}
