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

| Sort Algorithm                                  | Best Case     | Average Case  | Worst Case    | Memory   | Stable |
| ----------------------------------------------- | ------------- | ------------- | ------------- | -------- | ------ |
| [Selection Sort](#selection-sort)               | $O(n^{2})$    | $O(n^{2})$    | $O(n^{2})$    | $1$      | No     |
| [Stable Selection Sort](#stable-selection-sort) | $O(n^{2})$    | $O(n^{2})$    | $O(n^{2})$    | $1$      | Yes    |
| [Bubble Sort](#bubble-sort)                     | $O(n)$        | $O(n^{2})$    | $O(n^{2})$    | $1$      | Yes    |
| [Insertion Sort](#insertion-sort)               | $O(n)$        | $O(n^{2})$    | $O(n^{2})$    | $1$      | Yes    |
| [Merge Sort](#merge-sort)                       | $O(n*log(n))$ | $O(n*log(n))$ | $O(n*log(n))$ | $n$      | Yes    |
| [Quick Sort](#quick-sort)                       | $O(n*log(n))$ | $O(n*log(n))$ | $O(n^{2})$    | $log(n)$ | No     |
| [Heap Sort](#heap-sort)                         | $O(n*log(n))$ | $O(n*log(n))$ | $O(n*log(n))$ | $1$      | No     |

# What is "Stable" means in Sorting Algorithm

A sorting algorithm is called ***stable*** algorithm when if two or more equal objects are in the array to be sorted, it appears in the same order as they appear in the original array after the array is sorted.

# Selection Sort

***Selection Sort*** repeatedly finds the smallest element from the unsorted part of the array ans swaps it with the first element of the unsorted part until the entire array is sorted.

**Example**: `arr = [2, 3, 1]`

1. We find the smallest element in the `arr` and swap to the first element. `arr = [1, 3, 2]`
2. From the unsorted part of `arr`, `[3, 2]`, find the smallest element and swap to the first element. `arr = [1, 2, 3]`.
3. Since there is only one element in the unsorted part, we return `arr`.

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    int minIndex = 0;
    for (int i = 0; i < n -1; i++){
		minIndex = i;
        for(int j = i + 1; j < n; j++) {
        	if (arr[j] < arr[minIndex]) minIndex = j;
        }
        swap(arr[i], arr[minIndex]);
	}
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {5, 6, 2, 4, 1, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    selectionSort(arr, n);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 5 6 2 4 1 7 ]
// [ 1 2 4 5 6 7 ]
~~~

**Python**:

~~~python
def selectionSort(A, size):
    for i in range(size-1):
        minIndex = i
        for j in range(i + 1, size):
            if A[minIndex] > A[j]:
                minIndex = j
        A[minIndex], A[i] = A[i], A[minIndex]

a = [5, 6, 2, 4, 1, 7]
print(a)
selectionSort(a, len(a))
print(a)
# Output:
# [5, 6, 2, 4, 1, 7]
# [1, 2, 4, 5, 6, 7]
~~~

**Time Complexity: $O(n^{2})$**:

There are two nested loops:

+ One loop to select the first element of unsorted part ($O(n)$).
+ Another loop to compare the first element and every other elements in unsorted part ($O(n)$).

**Space Complexity: $O(1)$**:

We only use constant extra space.

## Advantages

+ It works well on sorting an array of small size.

## Disadvantages

+ Selection sort has a time complexity of O(n^2) in the worst and average case.
+ It doesn't work well on large datasets.
+ It is not ***stable***.

# Stable Selection Sort

To make a **selection sort** to be **stable**, we should move elements between the first index(included) and the minimum number's index(excluded) to right side, and put the minimum number to the first index.

**Example**: `arr = [4a, 3a, 1, 4b, 3b]`

If we sort this `arr` using ***normal selection sort***, we get:

1. minimum number is 1. So swap `1` and `4a`. `arr = [1, 3a, 4a, 4b, 3b]`
2. Since `3` is the smallest number, nothing is swapped.
3. Swap `4a` and the minimum number, `3b`. `arr = [1, 3a, 3b, 4b, 4a]`
4. Since `4` is the smallest number in the unsorted part, `[4b, 4a]`, nothing is swapped and sorting is ended.

As you can see that the order of `4a` and `4b` is changed.

But if we use a ***stable selection sort*** algorithm:

1. minimum number is 1. So move `[4a, 3a]` to right side and put 1 at the beginning. `arr = [1, 4a, 3a, 4b, 3b]`
2. minimum number is `3a`. So move `[4a]` to right side and put `3a` at the beginning of the unsorted part. `arr = [1, 3a, 4a, 4b, 3b]`
3. minimum number is `3b`. So move `[4a, 4b]` to right side and put `3b` at the beginning of the unsorted part. `arr = [1, 3a, 3b, 4a, 4b]`

The order of same numbers isn't changed.

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    int minIndex = 0;
    for (int i = 0; i < n -1; i++){
		minIndex = i;
        for(int j = i + 1; j < n; j++) {
        	if (arr[j] < arr[minIndex]) minIndex = j;
        }
        int tmp = arr[minIndex];
        for (int j = minIndex; j > i; j--) arr[j] = arr[j-1];
        arr[i] = tmp;
	}
}
int main() {
    int arr[] = {5, 6, 2, 4, 1, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    selectionSort(arr, n);
    return 0;
}
~~~

**Python**:

~~~python
def selectionSort(A, size):
    for i in range(size-1):
        minIndex = i
        for j in range(i + 1, size):
            if A[minIndex] > A[j]:
                minIndex = j
        tmp = A[minIndex]
        for j in range(minIndex, i, -1):
            A[j] = A[j-1]
        A[i] = tmp
a = [5, 6, 2, 4, 1, 7]
selectionSort(a, len(a))
print(a)
# Output:
# [1, 2, 4, 5, 6, 7]
~~~

**Time Complexity: $O(n^{2})$**:

$O(n) \times O(2n) = O(2n^{2}) = O(n^{2})$

**Space Complexity: $O(1)$**:

Same as **normal selection sort**.



# Bubble Sort

***Bubble Sort*** repeatedly swaps the adjacent elements if they are in the wrong order.

This sorting algorithm is:

+ Traverse from left and compare adjacent elements and the higher one is placed at right side.
+ As repeating the above step, the largest element is moved to the rightmost end at first.
+ And it will keep placing the largest element of the unsorted part to the end of the unsorted part.

**Example**: `arr = [ 9, 4, 10, 3]`

1. `i = 0`. Since `9 > 4`, swap `9` and `4`. `arr = [4, 9, 10, 3]`
2. `i = 1`. Since `9 < 10`, nothing is swapped.
3. `i = 2`. Since `10 > 3`, swap them. `arr = [4, 9, 3, 10]`
4. `i = 3`. Since `4 < 9`, nothing is swapped.
5. `i = 4`. Since `9 > 3`, swap them. `arr = [4, 3, 9, 10]`. (reached to the end of unsorted part).
6. `i = 5`. Since `4 > 3`, swap them. `arr = [3, 4, 9, 10]`. End

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    bool swapped;
    for (int i = 0; i < n - 1; i++){
        swapped = false;
        for (int j = 0; j < n - i - 1; j++){
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
	}
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {5, 6, 2, 4, 1, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    bubbleSort(arr, n);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 5 6 2 4 1 7 ]
// [ 1 2 4 5 6 7 ]
~~~

**Python**:

~~~python
def bubbleSort(A, size):
    swapped = False
    for i in range(size - 1):
        swapped = False
        for j in range(size - i - 1):
            if A[j] > A[j + 1]:
                A[j], A[j + 1] = A[j + 1], A[j]
                swapped = True
        if not swapped: break
    
a = [5, 6, 2, 4, 1, 7]
print(a)
bubbleSort(a, len(a))
print(a)
# Output:
# [5, 6, 2, 4, 1, 7]
# [1, 2, 4, 5, 6, 7]
~~~

**Time Complexity: $O(n^{2})$**:

There are two nested loops of $O(n)$.

**Space Complexity: $O(1)$**:

Only constant extra space is used.

## Advantages

+ It requires no additional memory space.
+ It is a ***stable sorting algorithm***.

## Disadvantages

+ It has a time complexity of $O(n^{2})$.
+ Since bubble sort is a comparison-based sorting algorithm, it needs a comparison operator to figure out the relative order of the input data set's elements. In some circumstances, it may reduce the algorithm's effectiveness.



# Insertion Sort

***Insertion Sort*** is kind of the mixed version of ***stable selection sort*** and ***bubble sort***. Like ***bubble sort*** it compares the first two elements and swap if they are in wrong order. Then we assume the subarray of the first two indexes is a *sorted part* and the other  part as a *unsorted part*. ***Insertion Sort*** traverses the array and for each first element of the *unsorted part*, it compares to the every element in the sorted part and put in the right place.

**Example**: `arr = [3, 5, 1 ,3, 7 ,4]`	`sorted = [3]`

1. Compare 3 and 5 and nothing swapped. `arr = [3, 5, 1, 3, 7, 4]`,  `sorted = [3, 5]`
2. Compare 1 and 5 and swap. `arr = [3, 1, 5, 3, 7, 4]`,
3. Compare 1 and 3 and swap. `arr = [1, 3, 5, 3, 7, 4]`, `sorted = [1, 3, 5]`
4. Compare 5 and 3 and swap. `arr = [1, 3, 3, 5, 7, 4]`, `sorted = [1, 3, 3, 5]`
5. Compare 5 and 7 and nothing swapped.  `arr = [1, 3, 3, 5, 7, 4]`, `sorted = [1, 3, 3, 5, 7]`
6. Compare 7 and 4 and swapped.  `arr = [1, 3, 3, 5, 4, 7]`
7. Compare 5 and 4 and swapped. `arr = [1, 3, 3, 4, 5, 7]`
8. Compare 3 and 4 and nothing swapped. `arr = [1, 3, 3, 4, 5, 7]` End.

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        for (int j = i - 1; j >= 0; j--) {
            if (arr[j + 1] < arr[j]) {
                swap(arr[j + 1], arr[j]);
            } else break;
        }
    }
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {5, 6, 2, 4, 1, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    bubbleSort(arr, n);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 5 6 2 4 1 7 ]
// [ 1 2 4 5 6 7 ]
~~~

**Python**:

~~~python
def bubbleSort(A, size):
    for i in range(1, size):
        for j in range(i - 1, -1, -1):
            if A[j] > A[j + 1]:
                A[j], A[j + 1] = A[j + 1], A[j]
            else:
                break
    
a = [5, 6, 2, 4, 1, 7]
print(a)
bubbleSort(a, len(a))
print(a)
# Output:
# [5, 6, 2, 4, 1, 7]
# [1, 2, 4, 5, 6, 7]
~~~

**Time Complexity: $O(n^{2})$**:

There are two nested loops of $O(n)$.

**Space Complexity: $O(1)$**:

Only constant extra space is used.



# Merge Sort

***Merge sort*** is a *divide-and-conquer* algorithm based on the idea of breaking down a list into several sub-lists until each sublist consists of a single element and merging those sublists in a manner that results into a sorted list.

**Example**: `arr = [4, 2, 5, 1, 6, 3]`

1. Initially divide the array into two equal halves: `arr1 = [4, 2, 5], arr2 = [1, 6, 3]`.
2. 

## Implementation

**C++**:

~~~c++

~~~

**Python**:

~~~python

~~~

**Time Complexity: $O(n^{2})$**:

**Space Complexity: $O(1)$**:





<!-- ## Implementation

**C++**:

~~~c++

~~~

**Python**:

~~~python

~~~

**Time Complexity: $O(n^{2})$**:

**Space Complexity: $O(1)$**:
 -->
