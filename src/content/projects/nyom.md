---
title: "Nyom"
tagline: "Local restaurants, matched by taste — not stars."
category: "Websites"
thumbnail: "/thumbnails/nyom.svg"
ratio: "landscape"
role: "Product · Frontend"
team: 3
year: 2025
stack: ["Next.js", "Supabase", "TypeScript"]
repo: "https://github.com/junsangyooo/nyom"
demo: "https://nyom.example.com"
featured: true
order: 1
---

## Problem

기존 지도 앱은 광고와 평점 인플레이션으로 신뢰를 잃었다. 우리는 *검색이 아니라 취향*으로 동네 식당을 잇고 싶었다.

## Approach

유저-식당 상호작용을 가벼운 협업 필터링으로 모델링하고, 콜드스타트는 동네·카테고리 휴리스틱으로 메웠다.

```ts
// 취향 유사도: 코사인 + 최근성 가중
const score = cosine(u, v) * recencyDecay(lastVisit);
```

## Outcome

기능보다 *첫 100명의 데이터 밀도*가 추천 품질을 갈랐다. 다음엔 시드 데이터 확보를 0순위로 둘 것.
