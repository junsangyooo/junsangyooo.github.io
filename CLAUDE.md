# junsangyooo.github.io — Personal site rebuild

이 파일은 이 레포에서 작업할 때 참고하는 단일 진실 소스. 새 세션이 시작될 때 가장 먼저 읽어.

---

## 1. 프로젝트 개요

- **목적**: Junsang Yoo의 개인 사이트 전면 리뉴얼. 포트폴리오 중심, 블로그는 부가.
- **이전**: Jekyll + Minimal Mistakes 테마. 2024년 6월 이후 방치.
- **이후**: Next.js 16 + React Three Fiber 기반 인터랙티브 사이트.
- **호스팅**: 최종은 Vercel 또는 GitHub Pages (정적 export). 도메인은 `junsangyooo.github.io` 유지.
- **시각적 인장**: 베이지 종이 위 점묘화(stippling). 첨부 이미지의 톤을 사이트 전체 아이덴티티로 확장.

---

## 2. 현재 상태 (2026-05-08 기준)

- 루트 = Jekyll 잔재 정리됨.
  - 옛 콘텐츠는 모두 `_archive_jekyll/`에 보존 (LeetCode 풀이 38개, 알고리즘 노트 12개, about, 이미지, Transcript.pdf 등).
  - `assets/`는 루트에도 사본 보존 (이미지 재사용 가능성).
- 새 프로젝트는 `prototype/`에 부트스트랩 완료.
  - 메인 hero(파티클 시스템 + 형상 사이클링) 1개 화면만 구현.
  - 서브 섹션(About / Work / Writing) placeholder 텍스트 수준.
  - Vercel 배포 / 서브 페이지 / 블로그 아카이브 연결은 아직.
- **다음 우선순위**: 전체 페이지 디자인 톤업 → 서브 페이지 → 블로그 아카이브 import → 배포.

---

## 3. 디렉토리 구조

```
.
├── CLAUDE.md                   # 이 파일
├── LICENSE
├── _archive_jekyll/            # 옛 Jekyll 사이트 통째 백업 (절대 건드리지 마)
│   ├── _config.yml
│   ├── _pages/about.md         # 최신 자기소개 — 콘텐츠 소스
│   ├── _posts/leetcode/        # 38개 풀이
│   ├── _posts/study-note/      # 12개 알고리즘 노트
│   └── assets/                 # 이미지, Transcript.pdf
├── assets/                     # 루트 사본 (옛날 사이트가 참조하던 자산)
└── prototype/                  # 새 사이트 본체 (작업은 여기서)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx      # 폰트, grain/vignette body 클래스
    │   │   ├── page.tsx        # 메인 (Hero + About/Work/Writing 섹션)
    │   │   └── globals.css     # 디자인 토큰 + grain/vignette CSS
    │   ├── components/
    │   │   └── ParticleField.tsx
    │   └── lib/
    │       └── shapes.ts       # silhouette / text / sphere / wave 좌표 생성기
    ├── package.json
    └── ...
```

> **현재는 `prototype/`이 작업 디렉토리지만, v1 배포 시점에 루트로 승격할 예정.** 그 전까지는 PR/커밋 메시지에서 `prototype/...` 경로를 명시.

---

## 4. 기술 스택

| 레이어 | 도구 | 비고 |
|--------|------|------|
| 프레임워크 | **Next.js 16.2.6** (App Router) | Turbopack dev. React 19. |
| 3D / 파티클 | **@react-three/fiber 9 + @react-three/drei 10 + three 0.184** | Canvas는 client component. |
| 모션 | **framer-motion 12** | 텍스트 reveal, 페이지 전환. |
| 스타일 | **Tailwind CSS v4** (`@theme inline`) | 색·폰트 토큰은 `globals.css`. |
| 폰트 | **Geist Sans / Mono + Cormorant Garamond** (next/font/google) | serif는 헤드라인 전용. |
| 콘텐츠 | (예정) **MDX + contentlayer 또는 fumadocs** | 옛 마크다운 import 시 도입. |
| 배포 | (예정) **Vercel** | GitHub push → 자동 배포. |

`prototype/AGENTS.md`에 *"이 Next.js는 학습 데이터와 다를 수 있으니 `node_modules/next/dist/docs/`를 먼저 읽어라"* 경고가 있다. 새 API를 쓰기 전엔 거기 docs 확인.

---

## 5. 디자인 시스템

### 5.1 색상 토큰 (CSS 변수, `globals.css`)

**활성 팔레트: Bone Gray** — Japanese minimalism, near-neutral.

| 변수 | 값 | 용도 |
|------|----|------|
| `--paper` | `#E5E0D2` | 메인 배경 (도화지 톤, 회색 살짝 섞인 따뜻한 아이보리) |
| `--paper-deep` | `#D8D3C5` | 보조 배경 / 카드 |
| `--ink` | `#1A1A1A` | 본문, 점 색 |
| `--ink-soft` | `#4A4A47` | 서브 텍스트, 캡션 |
| `--accent` | `#2F4F46` | 포인트 (딥 그린, 한 화면에 1~2회만) |

Tailwind에서 `bg-paper`, `text-ink`, `text-ink-soft`, `text-accent`로 사용.

**승인된 대체 팔레트 (보존, 비활성)** — 모두 `prototype/src/lib/palettes.ts`의 `PALETTES` 배열에 살아있음. `/palettes` 라우트에서 비교 가능. 활성 전환은 `globals.css`의 `:root` 변수를 해당 팔레트 값으로 복사.

| id | 이름 | paper | ink | accent | 무드 |
|----|------|-------|-----|--------|------|
| `gallery-bone` | Gallery Bone | `#EDE7DA` | `#1C1B17` | `#8C3A22` (벽돌) | 화이트큐브 미술관 |
| `bone-gray` | **Bone Gray** ← 현재 | `#E5E0D2` | `#1A1A1A` | `#2F4F46` (딥 그린) | 일본 미니멀 |

### 5.2 텍스처

- **grain**: `body.grain::before` → SVG fractalNoise + `mix-blend-mode: multiply`. 종이 질감의 핵심.
- **vignette**: `body.vignette::after` → 외곽 어두움. 사진 인쇄물 분위기.
- 이 두 클래스는 `layout.tsx`의 `<body>`에 항상 붙어 있음.

### 5.3 타이포그래피

- **Display (헤드라인, 임팩트)**: Cormorant Garamond — `serif` 클래스. 큰 사이즈에서 작은 letter-spacing으로 인쇄물 느낌.
- **Body**: Geist Sans (next/font 기본). 16~18px.
- **Caption / Label / 메타**: Geist Mono (`mono` 클래스), 10~12px, `uppercase tracking-[0.2em~0.3em]`. 잡지 코너 라벨처럼 사용.
- 강조는 `<em>` + `text-accent` (이탤릭 + 적황색).

### 5.4 모션 원칙

- **느리게, 부드럽게**. easing은 `easeOut`, duration 0.4~0.7s.
- 페이지에 항상 무언가 미세하게 움직이게 (파티클 회전, 점 사이즈 변동).
- 인터랙션 피드백은 **거리 기반** (마우스 가까울수록 반응).
- 갑작스러운 색 전환 / 강한 그림자 금지.

### 5.5 톤 & 보이스 (카피)

- 한 줄짜리 시·잠언 같은 느낌. 단정적이지 않고 여백을 둠.
- 대문자 줄임말 / hype / "🚀" 금지.
- 영어 헤드라인은 소문자 + 짧게 ("complete, for now", "small, positive, repeated").
- 한국어 카피가 들어가야 한다면 명조 계열에서 자연스럽게 섞일지 확인 (현재 한국어 폰트 미지정 — 필요 시 Pretendard 또는 IBM Plex Sans KR 도입).

---

## 6. 핵심 컴포넌트

### 6.1 `ParticleField` (`prototype/src/components/ParticleField.tsx`)

- **5,200개** 점, GPU instanced points + ShaderMaterial.
- 각 점은 size attribute로 크기 변동 → 점묘화 느낌.
- 프레임마다 `target` 위치로 lerp + 마우스 repulsion (반경 0.18, 강도 0.55) + 회전.
- `SHAPE_ORDER`: `silhouette → sphere → text → wave`. **5.4초** 주기 자동 사이클 + 클릭 시 즉시 advance.
- `scrollPower` (0~1)로 회전 가속·X축 기울기.

### 6.2 `shapes.ts` (`prototype/src/lib/shapes.ts`)

- `silhouette`: 인체 옆모습 — 신체 부위별 ellipse 가중치 분포 (procedural).
- `text`: 캔버스에 텍스트 그려서 어두운 픽셀 좌표 샘플링. 폰트 로드 타이밍 주의.
- `sphere`: Fibonacci sphere (균일 분포).
- `wave`: 격자 + 사인파.
- 모든 함수가 같은 `n`개 좌표를 반환해야 morph가 자연스러움.

새 형상 추가 시 `ShapeName` 타입과 `SHAPE_ORDER` 둘 다 업데이트.

---

## 7. 콘텐츠 아카이브 정책

`_archive_jekyll/`은 **읽기 전용**으로 취급. 새 사이트로 가져올 콘텐츠는 복사 → MDX로 변환 → `prototype/content/` (예정)에 둠.

이전 우선순위:
1. `_archive_jekyll/_pages/about.md` → 새 `/about` 페이지 (가장 최신 정보, 거의 그대로 사용).
2. `_archive_jekyll/assets/images/bio-photo.jpg` 등 살릴 이미지 → `prototype/public/`.
3. LeetCode 풀이 38개·알고리즘 노트 12개는 일괄 import해서 `/blog/archive` 하위에 배치. **별도 가공 없이 원문 그대로**. 가치 판단은 나중에.
4. Transcript.pdf → `/about`에 iframe 또는 다운로드 링크.

---

## 8. 작업 규칙

### 8.1 절대 지키기

- **새 작업 들어가기 전에 항상 컨펌**. 사용자가 "X 해줘" 해도 바로 코드 작성하지 말고, 계획을 먼저 정리하고 `AskUserQuestion`으로 확인.
- **`_archive_jekyll/` 안 파일 수정·삭제 금지**. 옛 콘텐츠 보존.
- **사전 컨펌 없이 파일 삭제 금지**. 옮기는 것도 마찬가지.
- **언어**: 사용자와의 대화는 **한국어**. 코드와 주석은 **영어**.
- **응답 톤**:
  - bash·외부 툴 세팅: step-by-step (어디 클릭, 어디 메뉴).
  - 리서치·공부: 풀어서, 비유 포함.
  - 프로젝트 개발: 간결, 코드 위주.

### 8.2 코드 컨벤션

- TypeScript strict.
- 컴포넌트는 가능하면 server component 기본, R3F·인터랙션 컴포넌트만 `'use client'`.
- 주석은 *왜* 그렇게 했는지만 (한 줄). *무엇*은 코드가 말하게.
- 디자인 토큰은 항상 CSS 변수 → Tailwind 토큰 → `text-paper` 식 클래스 사용. 하드코딩된 hex 금지.
- 의존성 추가 시 이 파일 4번 표를 갱신.

### 8.3 커밋

- 의미 단위 커밋. PR/배포 시 사용자가 직접 push (Claude는 push 금지).
- 메시지는 영어 짧게, 본문은 한국어 OK.

---

## 9. 다음 마일스톤

`prototype/` 기준으로 단계적으로:

- [ ] **메인 페이지 디자인 톤업** ← 현재 우선순위
  - 헤더·푸터·섹션 구분 정리
  - 타이포 위계 재설계
  - 스크롤 리듬 (각 섹션 진입 시 모션)
  - 한국어 폰트 추가 검토
- [ ] `/about` 페이지 (자기소개 + 경력 타임라인 + Transcript)
- [ ] `/projects` 페이지 (Nyom, Quant, Dragon Slayer 케이스 스터디)
- [ ] `/blog/archive` (옛 마크다운 일괄 import + 검색)
- [ ] 메타 (OG 이미지 자동 생성, sitemap, RSS)
- [ ] Vercel 또는 GitHub Pages 배포 + 도메인 연결
- [ ] `prototype/` → 루트로 승격 + `_archive_jekyll/` 별도 브랜치로 옮기기 검토

---

## 10. 사용자 메모

- **Junsang Yoo** — University of Waterloo, Statistics major / Computing minor (졸업 예정 2028.04).
- 한국 공군 복무 (2023.12 ~ 2025.08), 현재 워털루 복귀 중.
- "small positive action"이 옛 사이트의 부제이자 본인 모토. 새 사이트에도 어떤 형태로든 잔향 남기는 걸 추천.
- 바이브코딩 스타일: 직접 손대기보단 Claude에게 지시·리뷰. 그래서 변경의 *이유*를 짧게라도 코멘트로 남겨두면 다음 세션에서 자기 자신이 따라가기 쉬움.
