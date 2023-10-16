---
title:  "Reverse and Rotation Algorithm"
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

# Reverse Array

~~~c++
int original_arr[] = {1, 2, 3, 4};
int reversed_arr[] = {4, 3, 2, 1};
~~~

The basic algorithm to reverse an array is using two pointers:

1. Initialize two pointers to point to the first and the last element of an array.
2. swap the two elements that the pointers pointing at.
3. Move two pointers to point to the inner two elements. `left_pointer += 1; right_pointer -= 1;`

**C++**:

~~~c++
#include <iostream>

void reverseArr(int original_arr[], int left, int right) {
    while (left < right) {
        int tmp = original_arr[right];
        original_arr[right] = original_arr[left];
        original_arr[left] = tmp;
        left++;
        right--;
    }
}
int main () {
    int original_arr[] = {1, 2, 3, 4};
    reverseArr(original_arr, 0, sizeof(original_arr) / sizeof(original_arr[0]) - 1);
    for (int n : original_arr) std::cout << n << std::endl;
    return 0;
}
// Output:
// 4
// 3
// 2
// 1
~~~

**Python**:

~~~python
def reverseArr(original_arr):
    left = 0
    right = len(original_arr) - 1
    while left < right:
        original_arr[left], original_arr[right] = original_arr[right], original_arr[left]
        left += 1
        right -= 1

original_arr = [1, 2, 3, 4]
print(original_arr)
reverseArr(original_arr)
print(original_arr)
# Output:
# [1, 2, 3, 4]
# [4, 3, 2, 1]
~~~

**Time Complexity: $O(n)$**:

Our program traverse the `original_arr` $\frac{n}{2}$ times, but $O(\frac{n}{2}) = O(n)$ in Big-O notation.

**Space Complexity: $O(1)$**:

We only use constant extra space.

# Rotation of Array

Sometimes, we need to cyclically rotate an array clockwise by one time.

~~~c++
int original_arr[] = {1, 2, 3, 4, 5};
int rotated_arr[] = {5, 1, 2, 3, 4};
~~~

## Approach 1

Assign every element with its previous element and first element with the last element.

Traverse the array in the reversed order (from the end to the front) and assign every element with its previous element and the first element with the last element.

**C++**:

~~~c++
#include <iostream>

void rotateArr(int arr[], int size) {
    int last = arr[size - 1];
    for (int i = size - 1; i > 0; i--) {
        arr[i] = arr[i-1];
    }
    arr[0] = last;
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main () {
    int original_arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(original_arr) / sizeof(original_arr[0]);
    printArr(original_arr, size);
    rotateArr(original_arr, size);
    printArr(original_arr, size);
    return 0;
}
// Output:
// [ 1 2 3 4 5 ]
// [ 5 1 2 3 4 ]
~~~

**Python**:

~~~python
def rotateArr(original_arr):
    last = original_arr[-1]
    for i in range(len(original_arr) - 1, 0, -1):
        original_arr[i] = original_arr[i-1]
    original_arr[0] = last

original_arr = [1, 2, 3, 4, 5]
print(original_arr)
rotateArr(original_arr)
print(original_arr)
# Output:
# [1, 2, 3, 4, 5]
# [5, 1, 2, 3, 4]
~~~

**Time Complexity: $O(n)$**:

Our program iterates the `original_arr` once.

**Space Complexity: $O(1)$**:

We only use constant extra space.

## Approach 2

We are going to iterate the array with two pointers that one at the beginning and the other at the end. While iterating the array, we are going to swap the values that the each pointer pointing at and will move the first pointer to the next element.

**C++**:

~~~c++
#include <iostream>

void rotateArr(int arr[], int size) {
    int left = 0;
    int right = size -1;
    while (left < right) {
        int tmp = arr[left];
        arr[left] = arr[right];
        arr[right] = tmp;
        left++;
    }
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main () {
    int original_arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(original_arr) / sizeof(original_arr[0]);
    printArr(original_arr, size);
    rotateArr(original_arr, size);
    printArr(original_arr, size);
    return 0;
}
// Output:
// [ 1 2 3 4 5 ]
// [ 5 1 2 3 4 ]
~~~

**Python**:

~~~python
def rotateArr(original_arr):
    left = 0
    right = len(original_arr) - 1
    while left < right:
        original_arr[left], original_arr[right] = original_arr[right], original_arr[left]
        left += 1

original_arr = [1, 2, 3, 4, 5]
print(original_arr)
rotateArr(original_arr)
print(original_arr)
# Output:
# [1, 2, 3, 4, 5]
# [5, 1, 2, 3, 4]
~~~

**Time Complexity: $O(n)$**:

Our program iterates the `original_arr` once.

**Space Complexity: $O(1)$**:

We only use constant extra space.

## Approach 3

We are going to use ***Reversal Algorithm***: reverse first n - 1 elements and then whole array which will result into one right rotation.

**Reversal Algorithm** is the algorithm to rotate an array `k` times.

In our case, we only need to rotate once, hence we will set  `k = 1`.

The process of the **Reversal Algorithm** is:

1. Reverse the first `n - k` elements.
2. Reverse the entire array.

Let our array is `[1, 2, 3, 4, 5]` and we want to rotate the array two times. Then:

1. Reverse the first `n - 2` elements:
   + [3, 2, 1, 4, 5]
2. Reverse the entire array.
   + [5, 4, 1, 2, 3]

**C++**:

~~~c++
#include <iostream>
void rotateArr(int arr[], int size, int k) {
    int i, j;
    for (i = 0, j = size - k - 1; i < j; i++, j--) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    for (i = 0, j = size - 1; i < j; i++, j--) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main () {
    int original_arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(original_arr) / sizeof(original_arr[0]);
    int k = 1;
    printArr(original_arr, size);
    rotateArr(original_arr, size, k);
    printArr(original_arr, size);
    return 0;
}
// Output:
// [ 1 2 3 4 5 ]
// [ 5 1 2 3 4 ]
~~~

**Python**:

~~~python
def rotateArr(original_arr, k):
    i = 0
    j = len(original_arr) - k - 1
    while i < j:
        original_arr[i], original_arr[j] = original_arr[j], original_arr[i]
        i += 1
        j -= 1
    i = 0
    j = len(original_arr) - 1
    while i < j:
        original_arr[i], original_arr[j] = original_arr[j], original_arr[i]
        i += 1
        j -= 1

original_arr = [1, 2, 3, 4, 5]
print(original_arr)
rotateArr(original_arr, 1)
print(original_arr)
# Output:
# [1, 2, 3, 4, 5]
# [5, 1, 2, 3, 4]  
~~~

**Time Complexity: $O(n)$**:

We are reversing the array.

**Space Complexity: $O(1)$**:

We only use constant extra space.
