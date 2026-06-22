---
title: "Quant"
tagline: "A vectorized backtesting engine where statistics meets code."
category: "Applications"
thumbnail: "/thumbnails/quant.svg"
role: "Solo"
team: 1
year: 2024
stack: ["Python", "pandas", "NumPy"]
repo: "https://github.com/junsangyooo/quant"
featured: true
order: 2
---

## Problem

전략 시그널을 빠르게 검증할 도구가 없었다. 매번 루프를 돌리면 느렸고, 실수도 잦았다.

## Approach

모든 연산을 벡터화해 수천 개의 시그널을 한 번에 평가하도록 만들었다.

```python
returns = (signal.shift(1) * asset.pct_change()).cumsum()
```

## Outcome

백테스트 속도가 수십 배 빨라졌고, 통계학과 수업에서 배운 것을 코드로 옮기는 다리가 됐다.
