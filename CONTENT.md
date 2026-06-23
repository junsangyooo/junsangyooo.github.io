# CONTENT.md — 콘텐츠 저작 계약 (정규화 가이드)

레포 1개 = **본문 파일 1개**(`src/content/projects/{slug}.md` 또는 `.mdx`) + **썸네일 1개**.
이 문서는 본문에서 **실제로 렌더·애니메이트되는 어휘**의 단일 진실 소스다. `/showcase` 스킬도,
콘솔도, 손으로 쓰는 사람도 이걸 따른다. 스키마는 `src/content.config.ts`(zod)가 빌드시 강제한다.

> `.md` = 콘솔(폰)용 간단 저작(마크다운만). `.mdx` = 스킬용 리치 저작(아래 블록 사용 가능).
> 둘 다 같은 컬렉션에서 렌더된다. slug = 파일명(소문자-케밥).

---

## 1. Frontmatter (필드 계약)

```yaml
---
title: "Nyom"                       # 필수
tagline: "Local restaurants, matched by taste — not stars."  # 필수 · 한 줄
category: "Websites"                # 필수: Websites | Applications | Tools (필터 탭이 여기서 자동 생성)
thumbnail: "/thumbnails/nyom.png"   # 필수: public/ 하위 경로 (png/jpg/svg/webp)
role: "Product · Frontend"          # 선택
team: 3                             # 기본 1 (1 → "Solo", 2+ → "Team of N")
year: 2025                          # 필수 (숫자)
stack: ["Next.js", "Supabase"]      # 선택
repo: "https://github.com/..."      # 선택 → 상세에 "View on GitHub ↗"
links:                              # 선택 → 임의 버튼 여러 개
  - label: "Live demo"
    url: "https://..."
featured: false                     # 선택
order: 0                            # 정렬: 낮을수록 위 (새 글 = 0)
---
```

자산 경로: 썸네일 `public/thumbnails/{slug}.{ext}`, 본문 이미지 `public/uploads/{name}.{ext}`.

---

## 2. 본문 마크다운 — 렌더되는 것 (`.md`/`.mdx` 공통)

| 문법 | 렌더 | 비고 |
|---|---|---|
| `## 제목` | h2 (굵게, 큰 음수자간) | 권장 구조: `## Problem` / `## Approach` / `## Outcome` |
| `### 소제목` | h3 | |
| 문단 | p — **로드 시 줄 단위로 등장**(SplitText) | 가장 기본 단위 |
| `*강조*` | em → **accent(인디고) 이탤릭** | 포인트 주기용 |
| `**굵게**` | bold | |
| `- 항목` / `1. 항목` | ul/ol (불릿·들여쓰기 복원됨) | |
| `> 인용` | blockquote (좌측 라인) | |
| `` `code` `` / ```` ```block``` ```` | 인라인/블록 코드 (다크 박스) | |
| `[텍스트](url)` | accent 밑줄 링크 | |
| `![](/uploads/x.png)` | 이미지 (라운드, 풀폭) | 캡션 필요하면 아래 `<Figure>` |
| `---` | 구분선 | |

**등장 규칙**: 문단(`<p>`)은 줄 단위 stagger, 그 외 블록(제목·이미지·리스트·아래 컴포넌트)은 통째로 fade-up.
콘텐츠는 기본 보임 — JS 실패해도 다 보인다(효과는 enhancement).

---

## 3. 리치 블록 (`.mdx` 전용) — 5종

`.mdx` 파일 **맨 위에서 쓰는 것만 import**한 뒤 본문 어디서든 사용. 경로는 항상 아래와 동일.

```mdx
---
title: "..."
# ...frontmatter...
---
import Callout from '../../components/content/Callout.astro';
import Figure from '../../components/content/Figure.astro';
import TwoUp from '../../components/content/TwoUp.astro';
import Stat from '../../components/content/Stat.astro';
import Video from '../../components/content/Video.astro';

## Problem
...
```

| 블록 | 용도 | 사용 |
|---|---|---|
| `Callout` | 핵심 인사이트/주의 | `<Callout title="Key idea">본문...</Callout>` · `tone="warn"`(빨강) 옵션 |
| `Figure` | 캡션 달린 이미지 | `<Figure src="/uploads/x.png" alt="..." caption="화면 설명" />` |
| `TwoUp` | 이미지 2단(before/after) | `<TwoUp a="/uploads/a.png" b="/uploads/b.png" caption="..." />` |
| `Stat` | 성과 수치 행 | `<Stat items={[{value:"3×", label:"faster"}, {value:"0", label:"deps"}]} />` |
| `Video` | 데모 임베드(16:9) | `<Video src="https://youtu.be/..." />` (YouTube/Vimeo/mp4 자동 처리) |

- 새 색·새 효과를 만들지 말 것. 표현은 **이 5블록 + 위 마크다운**으로 충분하게.
- 블록은 디자인토큰(`src/styles/tokens.css`)·등장 거동을 이미 따른다. 그냥 쓰면 사이트 톤과 일치.

---

## 4. 누가 무엇으로 쓰나

- **`/showcase` 스킬** → `.mdx` 작성(리치 블록 + 톤 맞춘 본문 + 이미지 생성). 권장 경로.
- **콘솔(`/console`)** → `.md` 작성(폰에서 빠른 추가/수정). 블록은 못 쓰지만 마크다운은 됨.
- **손으로** → 이 문서대로 파일 1개 + 썸네일 1개 떨구면 끝(리스트·라우트·필터 자동).

푸시는 항상 **사람이 직접**(Claude는 push 금지). 푸시 → Cloudflare 자동 빌드/배포(~1분).
