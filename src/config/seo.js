export const siteMetadata = {
  name: "강남 달리는토끼 공식 홈페이지 | Running Rabbit Official",
  baseUrl: "https://runningrabbit.example.com",
  language: "ko",
  description:
    "강남 달토 · 달리는토끼 공식 홈페이지. 프리미엄 라운지 & 카라오케 공간, 투명한 예약, 합법적이고 안전한 운영을 안내합니다.",
  keywords: [
    "강남 달토",
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
    "프리미엄 라운지 & 카라오케 브랜드 \"Running Rabbit\"의 공간, 예약, 운영 철학을 한눈에 확인하세요.",
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
    "Running Rabbit 공식 사이트에서 프리미엄 라운지 & 카라오케 공간, 예약 방법, 합법적 운영 정책을 확인하세요.",
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

export const sitemapEntries = [
  {
    loc: siteMetadata.baseUrl,
    changefreq: "weekly",
    priority: "1.0",
  },
];
