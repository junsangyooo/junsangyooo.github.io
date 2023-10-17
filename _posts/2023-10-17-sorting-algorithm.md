---
title:  "Sorting Algorithm"
layout: single

author_profile: false

# right side bar: table of contents
toc: true
toc_sticky: true
toc_label: Contents
toc_icon: "fas fa-utensils"

# left side bar: other contents
sidebar:
    nav: "study-note"

# Choose categories
categories: "Algorithm"

# LaTeX available
use_math: true

# redirect_from:
#   - /위험카테고리이름/파일이름
---

There are so many different ways to sort an array and I will introduce some popular ***sorting algorithms*** in this study note.

This is the table of complexities:

| Sort Algorithm | Best Case     | Average Case  | Worst Case    | Memory   |
| -------------- | ------------- | ------------- | ------------- | -------- |
| Selection Sort | $O(n^{2})$    | $O(n^{2})$    | $O(n^{2})$    | $1$      |
| Bubble Sort    | $O(n)$        | $O(n^{2})$    | $O(n^{2})$    | $1$      |
| Insertion Sort | $O(n)$        | $O(n^{2})$    | $O(n^{2})$    | $1$      |
| Merge Sort     | $O(n*log(n))$ | $O(n*log(n))$ | $O(n*log(n))$ | $n$      |
| Quick Sort     | $O(n*log(n))$ | $O(n*log(n))$ | $O(n^{2})$    | $log(n)$ |
| Heap Sort      | $O(n*log(n))$ | $O(n*log(n))$ | $O(n*log(n))$ | $1$      |

# Selection Sort

***Selection Sort*** repeatedly finds the smallest element from the unsorted part of the array ans swaps it with the first element of the unsorted part until the entire array is sorted.

Let's