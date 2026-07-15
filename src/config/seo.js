export const siteMetadata = {
  name: "강남 달리는토끼 공식 홈페이지 | Running Rabbit Official",
  baseUrl: "https://gangnamdaltokki.com",
  language: "ko",
  description:
    "강남 달토 · 달리는토끼 공식 홈페이지. 프리미엄 라운지 & 카라오케 공간, 투명한 예약, 합법적이고 안전한 운영, 달토출근부·달토엔트리·달토웨이팅·달토초이스톡 확인 동선을 안내합니다.",
  keywords: [
    "달토",
    "강남달토",
    "강남 달토",
    "러닝래빗",
    "러닝레빗",
    "달리는토끼",
    "삼정호텔",
    "달리는토끼 후기",
    "달리는토끼 영업진",
    "달리는토끼 주대",
    "달토출근부",
    "달토 엔트리",
    "달토엔트리",
    "달토웨이팅",
    "달토 초이스톡",
    "달토초이스톡",
    "강남 달리는토끼",
    "Running Rabbit",
    "프리미엄 라운지",
    "강남 라운지",
    "공식 홈페이지",
  ],
};

export const navigationLinks = [
  { label: "브랜드", href: "#brand" },
  { label: "공간", href: "#spaces" },
  { label: "라운지 경험", href: "#experience" },
  { label: "예약 안내", href: "#contact" },
  { label: "운영 정책", href: "#policy" },
];

export const heroContent = {
  heading: "강남 달토 · 달리는토끼 공식 홈페이지",
  subheading:
    "프리미엄 라운지 & 카라오케 브랜드 \"Running Rabbit\"의 공간, 예약, 운영 철학과 달토출근부·달토엔트리·달토웨이팅·달토초이스톡 확인 동선을 한눈에 확인하세요.",
  cta: { label: "예약·문의하기", href: "#contact" },
};

export const sections = [
  {
    id: "brand",
    title: "브랜드 아이덴티티",
    summary:
      "강남에서 주목받는 프리미엄 라운지 & 카라오케 브랜드, 달토·달리는토끼(Running Rabbit)의 공식 정보 허브입니다.",
    bullets: [
      "세련된 라운지 무드와 감각적인 조명 설계",
      "합법·건전 운영을 지향하는 공식 채널",
      "브랜드 스토리와 공간 컨셉을 투명하게 안내",
    ],
  },
  {
    id: "spaces",
    title: "공간 & 시설",
    summary:
      "1~10인 프라이빗 룸부터 단체 룸까지, 목적에 맞춰 선택할 수 있는 다양한 공간을 제공합니다.",
    bullets: [
      "프리미엄 사운드 & 무드 조명 커스터마이즈",
      "라운지형 좌석과 고급 테이블 세팅",
      "간단한 다과와 음료를 포함한 기본 케어",
    ],
  },
  {
    id: "experience",
    title: "라운지 경험",
    summary:
      "품격 있는 음악과 편안한 좌석, 프라이버시 중심의 동선 설계로 누구나 즐길 수 있는 공간을 지향합니다.",
    bullets: [
      "요청 분위기에 맞춘 음향·조명 세팅",
      "친구 모임, 비즈니스 미팅, 축하 이벤트에 최적화",
      "전담 매니저의 세심한 동선 케어와 응대",
    ],
  },
  {
    id: "contact",
    title: "예약 & 문의",
    summary: "방문 예정 시간, 인원, 원하는 분위기만 알려주시면 최적의 룸과 예상 금액을 안내드립니다.",
    bullets: [
      "전화·메신저로 24시간 상담", 
      "사전 예약 시 대기 최소화 및 맞춤 룸 배정",
      "이벤트/할인 여부 사전 안내로 투명한 비용 고지",
    ],
  },
  {
    id: "policy",
    title: "운영 정책",
    summary:
      "모든 방문객이 안심할 수 있도록 합법적이고 안전한 운영 원칙을 준수합니다.",
    bullets: [
      "불법·유사 성행위 및 미성년자 출입 금지",
      "CCTV와 보안 인력 기반의 안전 관리(룸 내부 촬영 없음)",
      "개인정보 보호 및 결제 보안 절차 준수",
    ],
  },
];

export const homeMeta = {
  title: "강남 달토 · 달리는토끼 공식 홈페이지",
  description:
    "Running Rabbit 공식 사이트에서 프리미엄 라운지 공간, 예약 방법, 달토출근부·달토엔트리·달토웨이팅·달토초이스톡 확인 동선을 확인하세요.",
  canonical: `${siteMetadata.baseUrl}/`,
  openGraph: {
    type: "website",
    url: `${siteMetadata.baseUrl}/`,
    image: `${siteMetadata.baseUrl}/og-image.png`,
  },
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.name,
    url: siteMetadata.baseUrl,
    inLanguage: siteMetadata.language,
    description: siteMetadata.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteMetadata.baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
};

export const seoLandingPages = [
  { slug: "dalto", title: "달토", description: "달토 뜻, 강남달토 위치, 예약 방법을 공식 홈페이지에서 확인하세요." },
  { slug: "gangnam-dalto", title: "강남달토", description: "강남달토 공식 안내: 역삼동 삼정호텔 지하 위치, 픽업, 예약, 시설 정보." },
  { slug: "running-rabbit", title: "러닝래빗·러닝레빗", description: "러닝래빗·러닝레빗으로 검색하는 Running Rabbit 공식 안내 페이지입니다." },
  { slug: "dalineun-tokki", title: "달리는토끼", description: "달리는토끼 공식 정보: 브랜드 소개, 위치, 후기, 영업 안내, 예약 상담." },
  { slug: "samjeong-hotel", title: "삼정호텔 달토", description: "삼정호텔 지하 강남달토 위치와 교통, 주차, 발렛, 픽업 안내." },
  { slug: "reviews", title: "달리는토끼 후기", description: "달리는토끼 후기 확인 시 가격, 응대, 룸 컨디션 등 핵심 체크포인트를 안내합니다." },
  { slug: "staff", title: "달리는토끼 영업진", description: "달리는토끼 영업진 및 예약 담당 상담 채널을 안내합니다." },
  { slug: "price", title: "달리는토끼 주대", description: "달리는토끼 주대는 인원, 시간대, 코스에 따라 달라지며 예약 전 상담으로 안내합니다." },
  { slug: "dalto-entry", title: "달토출근부·달토엔트리", description: "달토출근부와 달토엔트리 확인 동선, 오늘 출근 현황, 예약 전 체크포인트를 안내합니다." },
  { slug: "dalto-waiting", title: "달토웨이팅", description: "달토웨이팅과 실시간 룸 현황을 확인하고 예약 전 대기 상황을 참고하세요." },
  { slug: "dalto-choice-talk", title: "달토초이스톡", description: "달토초이스톡 확인 동선과 출근부·엔트리 기반 예약 상담 포인트를 안내합니다." },
];

export const sitemapLastModified = "2026-07-15";

export const sitemapEntries = [
  {
    loc: `${siteMetadata.baseUrl}/`,
    lastmod: sitemapLastModified,
    changefreq: "daily",
    priority: "1.0",
  },
  ...seoLandingPages.map((page) => ({
    loc: `${siteMetadata.baseUrl}/${page.slug}`,
    lastmod: sitemapLastModified,
    changefreq: page.slug === "reviews" ? "daily" : "weekly",
    priority: page.slug === "reviews" ? "0.9" : "0.8",
  })),
];

export const rssFeedMetadata = {
  path: "/rss.xml",
  title: "강남달토 실시간 정보·후기 RSS",
  description: "강남달토 달리는토끼 공식 사이트의 달토출근부, 달토엔트리, 달토웨이팅, 달토초이스톡 및 커뮤니티 후기 최신 업데이트입니다.",
  managingEditor: "Running Rabbit Official",
  ttlMinutes: 30,
};
