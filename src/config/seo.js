export const siteMetadata = {
  name: "RunningRabbit Landing Platform",
  baseUrl: "https://example.com",
  language: "ko",
  description: "검색엔진 최적화에 초점을 맞춘 원페이지 서비스 플랫폼의 기본 구조입니다.",
  keywords: [
    "SEO",
    "원페이지",
    "랜딩페이지",
    "검색엔진 최적화",
  ],
};

export const navigationLinks = [
  { label: "서비스", href: "#services" },
  { label: "기능", href: "#features" },
  { label: "사례", href: "#cases" },
  { label: "연락처", href: "#contact" },
];

export const heroContent = {
  heading: "검색엔진을 사로잡는 단일 페이지",
  subheading: "빠른 로딩, 명확한 정보 구조, 풍부한 메타 데이터로 검색 결과 경쟁력을 높여보세요.",
  cta: { label: "무료 컨설팅 받기", href: "#contact" },
};

export const sections = [
  {
    id: "services",
    title: "핵심 서비스",
    summary:
      "검색 의도를 반영한 키워드 리서치, 스키마 마크업, 콘텐츠 설계까지 원스톱으로 제공합니다.",
    bullets: [
      "키워드 전략 및 검색 의도 매핑",
      "SEO 친화적 정보 구조 및 카피라이팅",
      "핵심 전환을 향한 콜투액션 배치",
    ],
  },
  {
    id: "features",
    title: "플랫폼 특징",
    summary:
      "테크니컬 SEO를 위한 구조화 데이터, 메타 태그, 빠른 성능을 위한 기본 설정을 포함합니다.",
    bullets: [
      "Open Graph / 트위터 카드 기본값",
      "웹 접근성과 코어 웹 바이탈 개선 지향 구조",
      "명시적인 사이트맵과 로봇 정책",
    ],
  },
  {
    id: "cases",
    title: "성과 사례",
    summary: "검색 순위 향상과 전환 증대를 경험한 브랜드들의 사례를 소개합니다.",
    bullets: [
      "3개월 내 주요 키워드 Top3 진입",
      "CTR 28% 향상 및 전환율 1.8배 증가",
      "콘텐츠 재정비 후 체류시간 42% 증가",
    ],
  },
  {
    id: "contact",
    title: "문의하기",
    summary: "프로젝트 목표와 산업군을 알려주시면, 맞춤형 제안서를 보내드립니다.",
    bullets: [
      "24시간 이내 회신 보장",
      "산업별 맞춤 벤치마킹 리포트 제공",
      "세부 일정 및 예상 성과 가이드 공유",
    ],
  },
];

export const homeMeta = {
  title: "SEO 원페이지 플랫폼",
  description:
    "검색엔진을 겨냥한 원페이지 플랫폼 템플릿. 빠른 구축과 안정적인 기술 SEO 설정으로 더 많은 유입을 만드세요.",
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
