# Session Log

이번 사이트 리뉴얼 작업의 세션별 결정·이유·산출물을 시간순으로 누적 기록한다. 새 세션이 시작되면 가장 위에 새 항목을 추가하고, 직전 항목을 그 아래로 밀어 넣는다. 단일 진실 소스는 `CLAUDE.md`이고, 이 파일은 그 진실이 어떻게 만들어졌는지의 *과정*을 남기는 곳이다.

각 항목 표준 형식:

```
## YYYY-MM-DD — 세션 한 줄 요약

### 컨텍스트
이번 세션을 시작하게 된 이유 / 직전 상태.

### 결정 (decisions)
- 결정 1 — 왜 이렇게 결정했는지 한 줄
- 결정 2 — ...

### 산출물 (deliverables)
- 추가된 파일 / 수정된 파일 + 한 줄 설명

### 미해결 / 다음 세션
- 아직 안 한 것
- 다음 세션이 손대야 할 것
```

---

## 2026-05-08 — Jekyll → Next.js 전면 리뉴얼 시작, 디자인 시스템 1차 확정, 템플릿 4종 후보 구축

### 컨텍스트
옛 Jekyll + Minimal Mistakes 기반 `junsangyooo.github.io`가 2024년 6월 이후 약 2년간 방치 상태. 2026년 군 복무 종료 + Waterloo 복학 + Nyom 프로젝트 시작 시점에 맞춰 콘텐츠와 디자인을 모두 새로 짜기로 함. 기존 콘텐츠 일부(특히 about.md, LeetCode·algorithm 노트 49개, 이미지·Transcript)는 **보존**.

### 결정 (decisions)

**전체 방향**
- 사이트 정체성: **포트폴리오 중심**, 블로그는 부가 — 채용·네트워킹 신호 우선.
- 기술 스택: **Next.js 16.2.6 + React 19 + R3F 9 + three 0.184 + Framer Motion 12 + Tailwind v4**. Jekyll은 폐기. — 인터랙티브 파티클·셰이더 구현이 메인 시각 정체성이라 React 생태계가 적합.
- 작업 위치: 새 프로젝트는 `prototype/` 서브디렉토리에 부트스트랩. 옛 Jekyll 콘텐츠는 `_archive_jekyll/`에 통째 백업 — 새 사이트 root는 깨끗하게 유지하면서 `git log` 한 줄로 옛 콘텐츠를 다시 꺼낼 수 있게.

**시각 정체성**
- 메인 모티프: 첨부받은 점묘화(stippling) 인체 옆모습. 베이지 종이 위에 잉크 점들로 형상이 모이고 흩어지는 톤. 이걸 사이트 전체의 "한 장의 도화지" 인상으로 확장.
- 파티클은 단순 hero 효과가 아니라 **사이트 모든 페이지의 글로벌 배경**. 어떤 라우트에 가도 같은 점들이 같은 종이 위에 떠 있어야 함 — 사이트 전체가 한 화면처럼 이어진다는 인상이 핵심.
- 형상은 4가지를 자동 사이클링: `silhouette → sphere → text("JUNSANG") → wave`. 5.4초 주기. 사용자가 첫 진입 후 조금만 머물러도 변화를 봄.

**색감 (디자인 시스템)**
- 4개 팔레트 후보(Gallery Bone / Aged Cotton / Ivory Cream / Bone Gray)를 `/palettes` 라우트에서 직접 토글 비교 → 사용자가 **Gallery Bone과 Bone Gray** 둘만 남기는 걸로 좁힘 → 최종 활성 팔레트는 **Bone Gray** (Japanese minimalism, near-neutral). Gallery Bone은 `palettes.ts`에 보존하여 향후 전환 가능.
- 활성 토큰: paper `#E5E0D2` / paper-deep `#D8D3C5` / ink `#1A1A1A` / ink-soft `#4A4A47` / accent `#2F4F46` (딥 그린).

**종이 텍스처 (grain)**
- 처음에는 fiber stain + speckle 두 레이어로 시도 → 1400×1400 fiber 타일이 viewport 가장자리에 세로 구분선처럼 보이는 문제 발견 → **fiber 레이어 제거**, speckle 한 레이어로만 정리.
- 활성 speckle: `2200×2200` SVG fractalNoise + `numOctaves=3` + colorMatrix 알파 임계값 `-5(R+G+B)+6.0` (어두운 노이즈 픽셀만 살림). 일반 데스크톱 viewport 안에서 한 번만 깔리고 같은 위치에 같은 패턴이 반복되지 않음.
- vignette은 도화지 톤과 안 어울려서 제거.

**사이트 정보 구조 (페이지)**
- 별도 페이지 4개: `/about`, `/projects`, `/experience`, `/blog`. 사용자 의견 반영하여 *work*는 개인 프로젝트에, *experience*는 직장·조직 경력에 분리. *writing* 대신 *blog*. 개별 상세 페이지는 `/projects/[slug]`, `/experience/[slug]`, `/blog/[slug]` 형태.
- `/contact`는 별도 페이지 안 만듦. footer + `/about` 하단으로 통합.

**랜딩 임팩트 강화 — 4가지 모두 채택 예정**
1. 백그라운드 파티클 잔향 (모든 페이지의 fixed 배경) ← *이번 세션에 1차 구현*
2. 거대 serif 헤드라인 + 큰 섹션 여백
3. 거대 footer `mailto:` 링크 (헤드라인 사이즈)
4. Scroll-driven shape morph (스크롤에 따라 hero 형상이 다음 섹션 형상으로 변형)

**랜딩 페이지 템플릿 — 4개 후보 구축, 결정 보류**
사용자가 현재 hero의 사방 코너 분산이 sparse하게 느껴진다고 피드백 → 응집된 무게 중심을 가진 4개 후보를 `/templates`에서 토글 비교:

| # | 이름 | 무드 | 레퍼런스 |
|---|------|------|----------|
| 1 | Centered Editorial | book body, calm reading flow | Substack / Robin Rendle |
| 2 | Asymmetric Manifesto | magazine cover, statement-driven | Foundation / BPM print |
| 3 | Two-Column Sticky | academic archive, navigable | Maggie Appleton / Robin Sloan |
| 4 | Print Front-Page | newspaper grid, dense | Reuters / NYT print |

콘텐츠는 동일 (`SITE_CONTENT` 단일 소스), 레이아웃만 다름. 결정 후 그 템플릿이 메인 페이지(`/`)에 정식 채택될 예정.

### 산출물 (deliverables)

**신규**
- `CLAUDE.md` — 프로젝트 단일 진실 소스
- `_archive_jekyll/` — 옛 Jekyll 사이트 통째 백업 (읽기 전용)
- `prototype/` — Next.js 16 새 프로젝트
  - `src/app/layout.tsx` — 폰트(Geist Sans/Mono + Cormorant Garamond) + grain body 클래스 + `<BackgroundCanvas />`
  - `src/app/globals.css` — 디자인 토큰 + 단일 레이어 종이 speckle
  - `src/app/page.tsx` — 메인 임시 구성 (hero + about + work + writing + footer). 템플릿 결정되면 교체 예정
  - `src/app/palettes/page.tsx` — 팔레트 비교 라우트
  - `src/app/templates/page.tsx` — 템플릿 비교 라우트
  - `src/components/ParticleField.tsx` — R3F 5,200점 ShaderMaterial + 형상 사이클링 + 마우스 repulsion + 스크롤 회전 가속. `interactive` prop 추가하여 배경용일 땐 클릭 advance 비활성
  - `src/components/BackgroundCanvas.tsx` — 사이트 전역 fixed full-screen 파티클 wrapper (z-2)
  - `src/components/templates/CenteredEditorial.tsx`
  - `src/components/templates/AsymmetricManifesto.tsx`
  - `src/components/templates/TwoColumnSticky.tsx`
  - `src/components/templates/PrintFrontPage.tsx`
  - `src/lib/shapes.ts` — silhouette / text / sphere / wave 좌표 생성기
  - `src/lib/palettes.ts` — Gallery Bone, Bone Gray 두 팔레트 정의 + `applyPalette()` 헬퍼
  - `src/lib/content.ts` — 사이트 전체 단일 콘텐츠 데이터 (이름·바이오·프로젝트·경력·블로그 안내·연락처)

**수정 (CLAUDE.md)**
- 5.1 색상 토큰 표를 Bone Gray 활성 + Gallery Bone 보존으로 갱신.

### 미해결 / 다음 세션

**즉시 결정 필요**
- 4개 템플릿 중 선택 — `/templates`에서 사용자가 보고 고르면 메인 페이지(`/`)에 정식 적용. 미세 조정 필요할 수 있음.

**다음 우선순위 (CLAUDE.md 9번 마일스톤 참고)**
- [ ] 채택된 템플릿을 메인 페이지(`/`)에 적용. 임시 구성 페이지 갈아엎기.
- [ ] 서브 페이지 4개 라우트 생성 (placeholder 콘텐츠로 시작): `/about`, `/projects`, `/experience`, `/blog`.
- [ ] 옛 마크다운(`_archive_jekyll/_posts/`) 일괄 import → `/blog/archive` 또는 `/blog/[slug]` MDX 변환.
- [ ] Resume PDF / Transcript 자산을 `/about` 안에 통합.
- [ ] 메타 — OG 이미지 자동 생성, sitemap, RSS.
- [ ] Vercel 또는 GitHub Pages 배포 + 도메인(`junsangyooo.github.io`) 연결.
- [ ] `prototype/` → 루트 승격. `_archive_jekyll/`는 별도 git branch로 옮기는 것 검토.

**알려진 이슈**
- `/palettes`와 `/templates`가 layout의 `BackgroundCanvas`와 자체 ParticleField가 겹쳐 그려질 수 있음. 비교용 라우트라 무방하지만, 결정 후 두 라우트는 정리(혹은 archive)할지 검토.
- `ParticleField` 컴포넌트 안에서 ShaderMaterial이 prop 변경 시마다 새로 생성될 수 있음 — 성능 영향 작지만, 향후 페이지별로 inkColor 다르게 설정할 때 useMemo로 uniforms 캐싱 필요.
- 사용자 글로벌 룰에 `junsang.yoo@rlwrld.ai` 이메일이 명시되어 있으나 회사 이메일이라 `content.ts`에는 임시로 `junsang.yoo@uwaterloo.ca` 사용. 사용자가 공개용 이메일을 확정하면 교체.

### 톤·작업 메모
- 모든 사용자 대화는 한국어, 코드·주석은 영어 — 글로벌 룰.
- 작업 전 항상 `AskUserQuestion`으로 컨펌 후 진행 — 글로벌 룰.
- `_archive_jekyll/` 안 파일은 절대 수정·삭제 금지.
