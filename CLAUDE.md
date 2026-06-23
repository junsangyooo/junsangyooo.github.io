# junsangyooo.github.io — GitHub Projects Showcase

이 파일은 이 레포에서 작업할 때 가장 먼저 읽는 **단일 진실 소스**다. 새 세션이 시작되면 여기부터 본다.

---

## 1. 무엇을, 왜 만드는가 (맥락·목적)

- **이 사이트의 정체**: Junsang Yoo의 **GitHub public repo 전용 쇼케이스**. 블로그/에디토리얼 톤. 랜딩에 기사형 카드가 지그재그로 나열되고, 각 레포를 누르면 `/{repo}` 경로의 **개별 상세 페이지**(동일 템플릿)로 들어가 그 프로젝트를 "무엇을·왜·어떻게"로 풀어 설명한다.
- **왜 별도 사이트인가**: 개발 외적인 전반 포트폴리오는 **`jsyoo.dev`** 에서 따로 다룬다. 이 사이트(`github.jsyoo.dev`)는 *코드/레포* 에만 집중한다. 두 사이트는 상단바·푸터의 **About ↗ 링크로 상호 연결**된다.
- **레퍼런스**: **Cuberto**(cuberto.com/projects). 관성 스크롤·잉크 커서·롤 텍스트·볼록 fill 버튼 등 인터랙션의 결을 의도적으로 차용. 단, 콘텐츠 구조는 우리 식(레포 = md 1개)으로 단순화.
- **핵심 원칙 — 데이터 주도**: 레포를 추가할 때 **코드를 건드리지 않는다.** `src/content/projects/`에 md 파일 하나(+썸네일)만 떨구면 리스트·상세 라우트·필터가 전부 자동 생성된다. 비개발자도 `/console/` 관리 툴로 추가 가능해야 한다.

> 이전 이력: 옛 Jekyll(Minimal Mistakes) → Next.js + R3F 프로토타입(폐기) → **현재 Astro**. 옛 콘텐츠 중 살릴 것은 `docs/archive-content/`(LeetCode 38 + 알고리즘 노트 12)에 보존.

---

## 2. 현재 상태 (2026-06 기준)

- **배포됨 (라이브)**: Cloudflare Pages → `github.jsyoo.dev`. `main` push → 자동 빌드/배포.
- **메인 리스트(`/`)**: 완성. 헤더 `GitHub Projects` + 한 줄 설명 + 필터(All/Websites/Applications/Tools) + 지그재그 2열 카드. 최소 sticky 탑바. 페이지 전환은 **View Transitions**(부드러운 크로스페이드).
- **상세(`/{slug}`)**: 동작. 헤더(메타/타이틀/태그라인/버튼/미디어/facts) + 본문(MDX, **이미지 지원**). 헤더 아래→위, 본문 문단 줄단위 등장.
- **404**: `src/pages/404.astro` (footer 바닥 고정, 스크롤 없는 전체화면).
- **인터랙션**: 잉크 커서·Lenis 스크롤·reveal·롤 링크·볼록 fill — 전부 구현. 효과는 전환마다 teardown/boot.
- **콘텐츠**: **비어 있음**(샘플 전부 삭제). `/console`로 실제 레포를 채울 차례.
- **관리 콘솔(`/console`)**: 커스텀 비번 콘솔 완성(§8). **남은 셋업 = Cloudflare env 2개**(`CONSOLE_PASSWORD`, `GITHUB_TOKEN`) + CF 빌드 설정(`npm run build` / `dist`).

---

## 3. 디렉토리 구조

```
.
├── README.md                  # 공개 레포 표지 (센터 히어로 + 뱃지)
├── CLAUDE.md
├── CONTENT.md                  # 콘텐츠 저작 계약(본문 어휘 + 5 MDX 블록 + 경로) = 정규화 가이드
├── astro.config.mjs            # site=github.jsyoo.dev, output: static, integrations:[mdx()]
├── .nvmrc                      # Node 22 (Cloudflare Pages 빌드용)
├── .claude/skills/showcase/    # /showcase 스킬 (프로젝트-aware 저작 두뇌)
├── src/
│   ├── content.config.ts       # projects zod 스키마 (glob **/*.{md,mdx})
│   ├── content/projects/*.{md,mdx} # ← 레포 = 파일 1개 (비어있음; 콘솔=.md / 스킬=.mdx)
│   ├── config/site.ts          # 사이트 정체성 단일소스(브랜드·소셜·repo·intro)
│   ├── layouts/Base.astro      # html/head, ClientRouter(View Transitions), Header, Footer, 전역 스크립트
│   ├── pages/
│   │   ├── index.astro         # 메인 리스트 (헤더+필터+지그재그 2열, 빈 상태 처리)
│   │   ├── [slug].astro        # 상세 통일 템플릿 (scoped style)
│   │   ├── 404.astro           # 404 (footer 바닥 고정)
│   │   └── console/index.astro # 관리 콘솔 SPA (login/list/editor/preview)
│   ├── components/             # Header, Footer, ProjectCard, Roll
│   ├── components/content/     # MDX 블록: Callout, Figure, TwoUp, Stat, Video
│   ├── lib/                    # smoothScroll, reveal, cursor, filters
│   ├── scripts/main.ts         # 부트/teardown (View Transition lifecycle)
│   ├── styles/tokens.css       # 디자인 토큰 단일소스 (site + console 공유)
│   └── styles/global.css       # 전역 스타일 + 공유 .btn (tokens.css import)
├── functions/                  # Cloudflare Pages Functions (콘솔 백엔드, /api/*)
│   ├── api/                    # login, me, logout, projects(GET 목록), deploy(POST 커밋)
│   └── _lib/                   # auth.js (세션), md.js (frontmatter), config.js (REPO/BRANCH)
├── public/
│   ├── thumbnails/             # 카드/히어로 썸네일 (콘솔이 커밋)
│   └── uploads/                # 본문 이미지 (콘솔이 커밋)
└── docs/                       # 레거시 보존 (빌드 무관): archive-content/(LeetCode·노트), design-refs/gallery.html, SESSION-LOG.md
```

---

## 4. 기술 스택

| 레이어 | 도구 | 비고 |
|--------|------|------|
| 프레임워크 | **Astro 5** (static output) | 정적 export → Cloudflare Pages |
| 콘텐츠 | **Content Collections** (glob `{md,mdx}` + zod) | `content.config.ts` 필드계약 + `CONTENT.md` 본문계약 |
| 리치 본문 | **@astrojs/mdx 4** + `components/content/*` | Callout·Figure·TwoUp·Stat·Video 5블록 |
| 저작 두뇌 | **/showcase 스킬** (`.claude/skills`) | 스키마·토큰·블록 알고 .mdx 작성·커밋 |
| 스타일 | **순수 CSS** (`global.css` 토큰 + scoped `<style>`) | Tailwind 안 씀 |
| 폰트 | **Geist / Geist Mono** (Google Fonts) | Cuberto의 Suisse Int'l(유료) 무료 대체 |
| 스무스 스크롤 | **Lenis** | lerp 0.09, GSAP ticker로 구동 |
| 모션 | **GSAP 3.13** (ScrollTrigger, SplitText) | SplitText는 3.13부터 무료. 커서는 GSAP 없이 순수 rAF |
| 페이지 전환 | **Astro View Transitions** (`ClientRouter`) | SPA식 부드러운 전환 + 효과 lifecycle(teardown/boot) |
| 관리 툴 | **커스텀 콘솔** (`/console`, Cloudflare Pages Functions) | 비번 로그인 + Git Data API 단일 커밋 |
| 콘솔 frontmatter | **yaml** (functions에서만) | md 파싱/생성, 구조화 필드(links) 왕복 |
| 배포 | **Cloudflare Pages** | `github.jsyoo.dev`, push → 자동. 빌드 `npm run build`, 출력 `dist` |

**개발 주의(중요)**: **새 라이브러리 import 경로를 추가/제거하면 dev 서버를 한 번 재시작**해야 한다(Vite 의존성 재최적화). 안 하면 import가 깨져 그 효과들이 통째로 죽는다. CSS·콘텐츠 변경은 HMR로 즉시 반영(재시작 불필요).

---

## 5. 콘텐츠 모델 — 레포 추가법 (가장 중요)

레포 1개 = **md 파일 1개** + 썸네일 1개. 스키마(`src/content.config.ts`)가 필드를 강제하므로 빠뜨리면 빌드가 에러로 잡는다.

```yaml
---
title: "Nyom"                       # 필수
tagline: "Local restaurants, matched by taste — not stars."  # 필수, 한 줄
category: "Websites"                # 필수: Websites | Applications | Tools (필터 탭이 이 값에서 자동 생성)
thumbnail: "/thumbnails/nyom.png"   # 필수: public/ 하위 경로 (png/jpg/svg/webp)
role: "Product · Frontend"          # 선택
team: 3                             # 기본 1 (1이면 "Solo", 2+면 "Team of N")
year: 2025                          # 필수
stack: ["Next.js", "Supabase"]      # 선택
repo: "https://github.com/..."      # 선택 — 상세에 "View on GitHub ↗" 버튼
links:                              # 선택 — 임의 버튼 여러 개 (라벨+URL)
  - label: "Live demo"
    url: "https://..."
featured: false                     # 선택
order: 0                            # 정렬: 낮을수록 위. 콘솔이 리스트 위치로 관리(새 글이 위)
---
본문 (Markdown) — 권장 구조: ## Problem / ## Approach / ## Outcome
이미지: ![](/uploads/img-xxx.png)  ← public/uploads/ 에 함께 커밋됨
```

→ 저장하면 **리스트 카드 + `/{파일명}` 상세 라우트 + 필터** 자동. 파일명이 slug가 된다. 카드는 인덱스 짝/홀로 좌/우 열에 자동 분배(지그재그).

**자산 경로 규칙**: 썸네일 = `public/thumbnails/{slug}.{ext}`, 본문 이미지 = `public/uploads/{name}.{ext}`. 콘솔이 이 규칙대로 커밋한다(§8). 손으로 추가할 때도 동일하게.

**본문 어휘·리치 블록**: 본문에서 실제 렌더되는 마크다운 + 5개 MDX 블록(Callout/Figure/TwoUp/Stat/Video)의 사용 계약은 **`CONTENT.md`**에 명문화(지금까지 없던 "정규화 가이드"). `.md`=콘솔(마크다운만), `.mdx`=`/showcase` 스킬(블록 가능). 둘 다 같은 컬렉션에서 렌더된다.

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

- **페이지 전환** (`Base.astro` ClientRouter + `main.ts`): View Transitions로 SPA식 크로스페이드. 효과는 **lifecycle 관리** — `astro:before-swap`에 teardown(Lenis destroy, ScrollTrigger kill, 커서·ticker·리스너 제거), `astro:page-load`에 boot(재초기화). 안 하면 중복 누적으로 jank.
- **잉크 커서** (`cursor.ts`): 네이티브 커서를 *대체하지 않고 따라다니는* 검은 점. **순수 rAF + 수동 lerp(0.22)** (GSAP 의존 X — 드래그 버그 회피), 속도 벡터로 skew(물감 번짐). **첫 포인터 신호(이동·클릭=pointermove/pointerdown)에서 즉시 등장**하고, 마지막 좌표를 모듈스코프에 보존해 **페이지 전환 후에도 바로 보임**; 창 벗어나면 사라짐. 카드(`data-cursor="explore"`) 위에선 커지며 **"Explore"**. `.footer`/`[data-cursor-light]` 위에선 흰색.
- **스크롤** (`smoothScroll.ts`): Lenis(lerp 0.09, wheelMultiplier 0.9) + GSAP ticker로 동기 구동. 새로고침 시 **항상 맨 위에서 시작**(`scrollRestoration='manual'`, head 인라인).
- **메인 reveal** (`reveal.ts:initReveal`): 로드 시 헤더(`[data-intro]`)+첫 화면 카드는 **왼쪽→오른쪽 슬라이드**(stagger). 아래 카드는 스크롤 시 **스프링 업**(`back.out`).
- **상세 reveal** (`reveal.ts:initContentReveal`): 헤더(`[data-rise]`)는 로드 시 **아래→위 등장**. 본문 prose는 **블록 타입별 자동 처리** — `<p>`는 **SplitText로 줄 분리 → 줄 단위 stagger**(위→아래), 그 외(제목·이미지·코드)는 블록 통째 fade-up. 폰트 로드(`document.fonts.ready`) 후 split. **페이지마다 정의 안 함.**
- **롤 텍스트 링크** (`Roll.astro` + `.roll`): 호버 시 텍스트가 위로 빠지고 같은 텍스트가 아래서 올라오는 "주사위 한 칸". `::after`+`attr(data-text)`로 마크업 중복 없이. 적용처: 탑바, 필터, 푸터 소셜.
- **볼록 fill 버튼** (`.footer__portfolio`, 상세 `.btn`): 호버 시 원형 캡이 아래에서 볼록하게 차오르며 글자 반전. `easeOutExpo`(`cubic-bezier(.16,1,.3,1)`)로 빠르게 올라와 끝에서 길게 멈춤.

새 효과를 추가할 땐 위 패턴(데이터 속성 트리거 + GSAP + 격리 + 기본 보임)을 따른다. 상세 ↔ 메인은 **구조·톤을 최대한 동일**하게, 작은 디테일만 다르게.

---

## 8. 관리 툴 `/console` (커스텀 비번 콘솔)

정적 사이트 + Cloudflare Pages Functions로 만든 자체 CMS. **비번만으로 어느 기기서든 로그인**(GitHub 토큰은 서버 env에만, 사용자는 안 만짐 → 2FA 없음, 포터블).

**플로우**: 로그인 → 리스트(순서 ↑↓ · Edit · Delete · ＋New) → 에디터(폼: 메타 + **커스텀 링크 여러 개** + **본문 이미지 삽입**) → Preview(마크다운 렌더) → **Deploy**. 모든 편집은 세션에 모았다가 Deploy 한 번에 **단일 커밋**(Git Data API: blob→tree→commit)으로 반영 → ~1분 후 라이브. **순서**: 리스트 위치 = `order`(새 글이 맨 위).

- **UI**: `src/pages/console/index.astro` — 단일 HTML SPA(login/list/editor/preview 뷰 토글). 사이트 톤(Geist, convex 버튼). 리스트 썸네일은 `raw.githubusercontent.com`에서 즉시 로드.
- **백엔드**: `functions/api/*` (Pages Functions, 파일 라우팅 → `/api/*`)
  - `login.js` 비번 검증(env) → 서명 세션 쿠키 / `me.js` · `logout.js`
  - `projects.js` (GET) 레포의 md 목록·파싱 / `deploy.js` (POST) 변경셋(upserts/deletes) 원자 커밋 + md·썸네일·본문이미지 동시 반영
  - `_lib/auth.js` (PBKDF2→HMAC 세션·쿠키), `_lib/md.js` (slugify·**yaml** frontmatter 파서/빌더)
- **보안**: 세션 서명은 PBKDF2(10만)로 강화(§아래 env). 업로드 경로는 `^/uploads/<safe>.<imgext>$`만 허용(경로 탈출 차단) + 매직바이트로 실제 이미지 검증. 모든 쓰기는 세션 검증 후. 로그인 실패엔 **800ms 지연**(브루트포스 완화) — 진짜 상한은 CF WAF rate-limit 룰(`/api/login`).
- **env (Cloudflare Pages → Settings → Variables and secrets, Production)**:
  - `CONSOLE_PASSWORD` — 로그인 비번 (필수)
  - `GITHUB_TOKEN` — fine-grained PAT (이 레포 **Contents: Read and write**) (필수)
  - `SESSION_SECRET` — **선택·권장**. 고엔트로피 랜덤 문자열(`openssl rand -hex 32`). 넣으면 세션 서명을 비번과 완전 분리(보안↑). 없으면 비번을 PBKDF2(10만 회)로 늘려 서명 — 여전히 강함. (`functions/_lib/auth.js`)
- 로컬에선 `astro dev`가 Functions를 안 돌림 → `npx wrangler pages dev dist` 로 빌드 결과 + functions 같이 띄워야 콘솔 동작 테스트 가능. (UI만 보는 건 astro dev로도 됨, 단 /api 호출은 실패)

---

## 9. 배포

- Cloudflare Pages ↔ 레포(`junsangyooo/junsangyooo.github.io`, `main`). 도메인 `github.jsyoo.dev`. **라이브.**
- **CF 빌드 설정(중요)**: Build command `npm run build`, Output dir `dist`, Node는 `.nvmrc`(22). *이전에 이 설정이 비어 있어서 빌드를 안 하고 404가 떴던 적 있음 — 비면 안 됨.*
- `functions/`는 CF Pages가 자동으로 `/api/*`로 서빙(빌드 설정과 별개).
- **push는 사용자가 직접** 한다 (Claude는 push 금지).

---

## 10. 작업 규칙

- 새 작업/구조 변경 전 **계획 제시 후 컨펌**. 파일 삭제·이동·`npm install`은 사전 확인.
- 대화는 **한국어**, 코드·주석은 **영어**, 커밋 메시지 영어.
- `docs/`(archive-content·design-refs·SESSION-LOG)는 보존 자료 — 손대지 말 것.
- 디자인 토큰은 CSS 변수 → 하드코딩 hex 금지. 의존성 추가 시 §4 표 갱신.
- 인터랙션/효과는 §7 패턴을 따르고, 콘텐츠가 효과에 인질로 잡히지 않게(기본 보임) 한다.

---

## 11. 다음 마일스톤

- [x] **저작 파이프라인**: MDX 5블록 + `CONTENT.md` 계약 + `/showcase` 스킬. 퀵윈(커서 픽스·토큰/버튼 dedup·로그인 throttle·`site.ts`/`config.js` 상수정리) 반영.
- [ ] **콘솔 가동**: Cloudflare env(`CONSOLE_PASSWORD`, `GITHUB_TOKEN`) 등록 → `/console` 로그인 테스트
- [ ] **실제 레포 콘텐츠 채우기** (콘솔로 추가 — 지금 리스트 비어있음)
- [ ] `docs/archive-content/`(LeetCode·노트) → `/blog/archive` 일괄 import 검토
- [ ] 메타(OG 이미지 자동 생성, sitemap, RSS)
- [ ] (선택) 콘솔에 본문 이미지 정렬/삭제, 드래그 정렬 등 편의 기능
```
