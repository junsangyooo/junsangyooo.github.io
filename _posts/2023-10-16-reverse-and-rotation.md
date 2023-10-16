---
title:  "Reverse and Rotation Algrithm"
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
## Reverse Array

~~~c++
int original_arr[] = {1, 2, 3, 4};
int reversed_arr[] = {4, 3, 2, 1};
~~~

The basic algorithm to reverse an array is using two pointers:

1. Initialize two pointers to point to the first and the last element of an array.

2. swap the two elements that the pointers pointing at.
3. Move two pointers to point to the inner two elements. `left_pointer += 1; right_pointer -= 1;`

~~~c++
// In C++
int original_arr[] = {1, 2, 3, 4};
int reversed_arr[] = {4, 3, 2, 1};

int left = 0;
int right = original_arr.size() - 1;
while (left < right) {
    int tmp = original_arr[right];
    original_arr[right] = original_arr[left];
    original_arr[left] = tmp;
    left++;
    right--;
}
~~~

## Rotation of Array

Sometimes, we need to cyclically rotate an array clockwise by one time.

~~~c++
int original_arr[] = {1, 2, 3, 4, 5};
int rotated_arr[] = {5, 1, 2, 3, 4};
~~~