# junsangyooo.github.io — GitHub Projects Showcase

이 파일은 이 레포에서 작업할 때 가장 먼저 읽는 **단일 진실 소스**다. 새 세션이 시작되면 여기부터 본다.

---

## 1. 무엇을, 왜 만드는가 (맥락·목적)

- **이 사이트의 정체**: Junsang Yoo의 **GitHub public repo 전용 쇼케이스**. 블로그/에디토리얼 톤. 랜딩에 기사형 카드가 지그재그로 나열되고, 각 레포를 누르면 `/{repo}` 경로의 **개별 상세 페이지**(동일 템플릿)로 들어가 그 프로젝트를 "무엇을·왜·어떻게"로 풀어 설명한다.
- **왜 별도 사이트인가**: 개발 외적인 전반 포트폴리오는 **`jsyoo.dev`** 에서 따로 다룬다. 이 사이트(`github.jsyoo.dev`)는 *코드/레포* 에만 집중한다. 두 사이트는 상단바·푸터의 **About ↗ 링크로 상호 연결**된다.
- **레퍼런스**: **Cuberto**(cuberto.com/projects). 관성 스크롤·잉크 커서·롤 텍스트·볼록 fill 버튼 등 인터랙션의 결을 의도적으로 차용. 단, 콘텐츠 구조는 우리 식(레포 = md 1개)으로 단순화.
- **핵심 원칙 — 데이터 주도**: 레포를 추가할 때 **코드를 건드리지 않는다.** `src/content/projects/`에 md 파일 하나(+썸네일)만 떨구면 리스트·상세 라우트·필터가 전부 자동 생성된다. 비개발자도 `/console/` 관리 툴로 추가 가능해야 한다.

> 이전 이력: 옛 Jekyll(Minimal Mistakes) → Next.js + R3F 프로토타입(폐기) → **현재 Astro**. 옛 콘텐츠 중 살릴 것은 `archive-content/`(LeetCode 38 + 알고리즘 노트 12)에 보존.

---

## 2. 현재 상태 (2026-06 기준)

- **메인 리스트 페이지(`/`)**: 완성에 가까움. 헤더(`GitHub Projects`) + 한 줄 설명 + 필터 탭(All / Websites / Applications / Tools) + 지그재그 2열 카드 리스트. 상단바 없음 대신 최소 sticky 탑바.
- **상세 템플릿(`/{slug}`)**: 동작함. 헤더(카테고리·연도·팀 / 타이틀 / 태그라인 / 버튼 / 미디어 / facts) + 본문(Problem/Approach/Outcome MDX). 메인과 톤 통일.
- **인터랙션**: 잉크 커서, Lenis 관성 스크롤, 진입/스크롤 reveal, 롤 텍스트 링크, 볼록 fill 버튼 — 전부 구현.
- **샘플 데이터 6개**: nyom, quant, dragon-slayer, aurora, pulse, monogram. 썸네일은 **placeholder SVG**(실제 스크린샷으로 교체 예정).
- **`/console/`**: Sveltia CMS 파일 배치 완료. **GitHub OAuth 워커 셋업만 남음**(§8).
- **미배포**: Cloudflare Pages 연결은 돼 있으나 이 Astro 버전 push 전.

---

## 3. 디렉토리 구조

```
.
├── CLAUDE.md                  # 이 파일
├── astro.config.mjs           # site=github.jsyoo.dev, output: static
├── src/
│   ├── content.config.ts      # projects 컬렉션 zod 스키마 (= 레포 1개의 필드 계약)
│   ├── content/projects/*.md  # ← 레포 추가는 여기 파일 하나
│   ├── layouts/Base.astro     # html/head, Header, Footer, 전역 스크립트, scrollRestoration
│   ├── pages/
│   │   ├── index.astro        # 메인 리스트 (헤더+필터+지그재그 2열)
│   │   └── [slug].astro       # 상세 통일 템플릿 (scoped style 포함)
│   ├── components/
│   │   ├── Header.astro        # 최소 sticky 탑바 (Junsang Yoo / About ↗)
│   │   ├── Footer.astro        # 검은 푸터 (좌: About+brand+tag / 우: 소셜)
│   │   ├── ProjectCard.astro   # 카드 1개 템플릿
│   │   └── Roll.astro          # 롤(주사위) 텍스트 링크 라벨
│   ├── lib/
│   │   ├── smoothScroll.ts     # Lenis + GSAP ticker 통합
│   │   ├── reveal.ts           # initReveal(메인) + initContentReveal(상세, SplitText)
│   │   ├── cursor.ts           # 잉크 커서 (quickTo + skew)
│   │   └── filters.ts          # 카테고리 필터
│   ├── scripts/main.ts         # 부트: scrollRestoration + safe()로 효과 격리 실행
│   └── styles/global.css       # 디자인 토큰 + 전역 스타일
├── public/
│   ├── thumbnails/*.svg        # 카드/히어로 이미지 (placeholder)
│   └── console/                # Sveltia CMS (index.html + config.yml)
├── archive-content/           # 옛 Jekyll 콘텐츠 보존 (leetcode/, study-note/)
└── _design-refs/gallery.html  # 레퍼런스 갤러리 (참고용, 빌드 무관)
```

---

## 4. 기술 스택

| 레이어 | 도구 | 비고 |
|--------|------|------|
| 프레임워크 | **Astro 5** (static output) | 정적 export → Cloudflare Pages |
| 콘텐츠 | **Content Collections** (glob loader + zod) | `content.config.ts`가 필드 계약 |
| 스타일 | **순수 CSS** (`global.css` 토큰 + scoped `<style>`) | Tailwind 안 씀 |
| 폰트 | **Geist / Geist Mono** (Google Fonts) | Cuberto의 Suisse Int'l(유료) 무료 대체 |
| 스무스 스크롤 | **Lenis** | lerp 0.09, GSAP ticker로 구동 |
| 모션 | **GSAP 3.13** (ScrollTrigger, SplitText, quickTo) | SplitText는 3.13부터 무료 |
| 관리 툴 | **Sveltia CMS** (`/console/`, GitHub 백엔드) | Decap 호환, 경량 |
| 배포 | **Cloudflare Pages** | `github.jsyoo.dev`, push → 자동 |

**개발 주의(중요)**: **새 라이브러리 import 경로를 추가/제거하면 dev 서버를 한 번 재시작**해야 한다(Vite 의존성 재최적화). 안 하면 import가 깨져 그 효과들이 통째로 죽는다. CSS·콘텐츠 변경은 HMR로 즉시 반영(재시작 불필요).

---

## 5. 콘텐츠 모델 — 레포 추가법 (가장 중요)

레포 1개 = **md 파일 1개** + 썸네일 1개. 스키마(`src/content.config.ts`)가 필드를 강제하므로 빠뜨리면 빌드가 에러로 잡는다.

```yaml
---
title: "Nyom"                       # 필수
tagline: "Local restaurants, matched by taste — not stars."  # 필수, 한 줄
category: "Websites"                # 필수: Websites | Applications | Tools (필터 탭이 이 값에서 자동 생성)
thumbnail: "/thumbnails/nyom.svg"   # 필수: public/ 하위 경로
role: "Product · Frontend"          # 선택
team: 3                             # 기본 1 (1이면 "Solo", 2+면 "Team of N")
year: 2025                          # 필수
stack: ["Next.js", "Supabase"]      # 선택
repo: "https://github.com/..."      # 선택 (빈 값 허용)
demo: "https://..."                 # 선택
featured: true                      # 선택
order: 1                            # 정렬: 낮을수록 위
---
본문 (MDX) — 권장 구조: ## Problem / ## Approach / ## Outcome
```

→ 저장하면 **리스트 카드 + `/{파일명}` 상세 라우트 + 필터** 자동. 파일명이 slug가 된다. 카드는 인덱스 짝/홀로 좌/우 열에 자동 분배(지그재그).

---

## 6. 디자인 시스템

### 6.1 토큰 (`global.css` `:root`)
| 변수 | 값 | 용도 |
|------|----|------|
| `--bg` | `#ffffff` | 메인 배경 (화이트) |
| `--fg` | `#0a0a0a` | 본문/잉크 |
| `--soft` | `#6b7077` | 서브 텍스트·메타 |
| `--line` | `#e6e6e6` | 경계선·카드 바탕 |
| `--accent` | `#4f46e5` | 포인트(인디고, 절제) |
| `--black` | `#000000` | 푸터 배경 |
| `--font` | `Geist` | 본문·헤드라인 (전부) |
| `--mono` | `Geist Mono` | 메타·라벨·코드 |
| `--ease` | `cubic-bezier(.22,1,.36,1)` | 기본 이징 |

### 6.2 타이포
- 헤드라인: Geist **600**(투박해 보이지 않게 700에서 낮춤), 큰 음수 자간(`-0.035em`).
- 본문: Geist 400~500, 16~18px.
- 메타/라벨: Geist Mono, 10~12px, `uppercase` + 넓은 자간.

### 6.3 레이아웃
- 메인 리스트: **2열 지그재그**(좌/우 열, 우열은 아래로 stagger). 카드 썸네일은 **정사각(1:1)**. 열 간격은 vw 기반(`clamp(40px,8vw,150px)`)으로 유동 → 화면 좁으면 760px에서 **1열**. 비율 유지하며 전체 크기만 축소.
- 카드 캡션: `**Title** – tagline` + 작은 `CATEGORY · YEAR`.

---

## 7. 모션 / 인터랙션 시스템 (정규화)

핵심 철학: **콘텐츠는 기본 보임, 효과는 그 위에 얹는 progressive enhancement.** 각 효과는 `main.ts`의 `safe()`로 격리 — 하나가 죽어도 나머지와 콘텐츠는 산다. `prefers-reduced-motion`이면 전부 생략.

- **잉크 커서** (`cursor.ts`): 네이티브 커서를 *대체하지 않고 따라다니는* 검은 점. `gsap.quickTo`(duration 0.38)로 부드럽게 추적, 속도 벡터로 skew(물감 번짐). 첫 마우스 위치에서 생성(중앙→이동 없음), 창 벗어나면 사라짐. 카드(`data-cursor="explore"`) 위에선 커지며 **"Explore"**. `.footer`/`[data-cursor-light]` 위에선 흰색.
- **스크롤** (`smoothScroll.ts`): Lenis(lerp 0.09, wheelMultiplier 0.9) + GSAP ticker로 동기 구동. 새로고침 시 **항상 맨 위에서 시작**(`scrollRestoration='manual'`, head 인라인).
- **메인 reveal** (`reveal.ts:initReveal`): 로드 시 헤더(`[data-intro]`)+첫 화면 카드는 **왼쪽→오른쪽 슬라이드**(stagger). 아래 카드는 스크롤 시 **스프링 업**(`back.out`).
- **상세 reveal** (`reveal.ts:initContentReveal`): 헤더(`[data-rise]`)는 로드 시 **아래→위 등장**. 본문 prose는 **블록 타입별 자동 처리** — `<p>`는 **SplitText로 줄 분리 → 줄 단위 stagger**(위→아래), 그 외(제목·이미지·코드)는 블록 통째 fade-up. 폰트 로드(`document.fonts.ready`) 후 split. **페이지마다 정의 안 함.**
- **롤 텍스트 링크** (`Roll.astro` + `.roll`): 호버 시 텍스트가 위로 빠지고 같은 텍스트가 아래서 올라오는 "주사위 한 칸". `::after`+`attr(data-text)`로 마크업 중복 없이. 적용처: 탑바, 필터, 푸터 소셜.
- **볼록 fill 버튼** (`.footer__portfolio`, 상세 `.btn`): 호버 시 원형 캡이 아래에서 볼록하게 차오르며 글자 반전. `easeOutExpo`(`cubic-bezier(.16,1,.3,1)`)로 빠르게 올라와 끝에서 길게 멈춤.

새 효과를 추가할 땐 위 패턴(데이터 속성 트리거 + GSAP + 격리 + 기본 보임)을 따른다. 상세 ↔ 메인은 **구조·톤을 최대한 동일**하게, 작은 디테일만 다르게.

---

## 8. 관리 툴 `/console/` (Sveltia CMS)

`public/console/`에 배치. `config.yml`의 필드가 `content.config.ts` 스키마와 1:1. 동작하려면 **GitHub OAuth 중개 워커**가 필요(정적 사이트라 백엔드 없음).

**남은 셋업(1회성)**:
1. GitHub OAuth App 생성(Client ID/Secret).
2. `sveltia-cms-auth` Cloudflare Worker 배포 + 환경변수(`GITHUB_CLIENT_ID/SECRET`, `ALLOWED_DOMAINS=github.jsyoo.dev`).
3. `config.yml`의 `base_url`을 워커 URL로 교체.

이후 라이브 `/console/`에서 GitHub 로그인 → 폼 작성 → 레포에 md+이미지 자동 커밋 → 자동 재배포.

---

## 9. 배포

- Cloudflare Pages가 레포(`junsangyooo/junsangyooo.github.io`, `main`)에 연결. 빌드: `astro build`, 출력: `dist/`. 도메인 `github.jsyoo.dev`.
- **push는 사용자가 직접** 한다 (Claude는 push 금지).

---

## 10. 작업 규칙

- 새 작업/구조 변경 전 **계획 제시 후 컨펌**. 파일 삭제·이동·`npm install`은 사전 확인.
- 대화는 **한국어**, 코드·주석은 **영어**, 커밋 메시지 영어.
- `archive-content/` 와 `_design-refs/` 는 건드리지 말 것(보존).
- 디자인 토큰은 CSS 변수 → 하드코딩 hex 금지. 의존성 추가 시 §4 표 갱신.
- 인터랙션/효과는 §7 패턴을 따르고, 콘텐츠가 효과에 인질로 잡히지 않게(기본 보임) 한다.

---

## 11. 다음 마일스톤

- [ ] Sveltia 콘솔 OAuth 워커 셋업 → `/console/` 가동 (§8)
- [ ] 실제 프로젝트 썸네일·본문 채우기 (placeholder 교체)
- [ ] `archive-content/`(LeetCode·노트) → `/blog/archive` 일괄 import 검토
- [ ] 메타(OG 이미지, sitemap, RSS)
- [ ] Cloudflare Pages에 이 Astro 버전 배포 + 도메인 확인
```
