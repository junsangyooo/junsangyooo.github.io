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



# Merge Sort

***Merge sort*** is a *divide-and-conquer* algorithm based on the idea of breaking down a list into several sub-lists until each sublist consists of a single element and merging those sublists in a manner that results into a sorted list.

**Example**: `arr = [4, 2, 5, 1]`

1. Initially divide the array into two equal halves: `arr1 = [4, 2], arr2 = [5, 1]`.

2. Divide the subarrays until that can no longer be divided: `arr1 = [4], arr2 = [2], arr3 = [5], arr4 = [1]`.

3. These subarrays are repeatedly merged together and the merged subarrays are sorted:

   `arr1 = [2, 4], arr2 = [1, 5]`.

4. This merging process is continued until the sorted array is built from the smaller subarrays: `arr = [1, 2, 4, 5]`.

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void merge(int array[], int const left, int const mid, int const right){
    int const subArrayOne = mid - left + 1;
    int const subArrayTwo = right - mid;
    auto *leftArray = new int[subArrayOne];
    auto *rightArray = new int[subArrayTwo];
    
    for (auto i = 0; i < subArrayOne; i++) {
        leftArray[i] = array[left + i];
    }
    for (auto j = 0; j < subArrayTwo; j++) {
        rightArray[i] = array[mid + 1 + j];
    }
    
    auto indexOfSubArrayOne = 0, indexOfSubArrayTwo = 0;
    int indexOfMergedArray = left;
    
    while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {
        if (leftArray[indexOfSubArrayOne] <= rightArray[indexOfSubArrayTwo]) {
            array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
            indexOfSubArrayOne++;
        } else {
            array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
            indexOfSubArrayTwo++;
        }
        indexOfMergedArray++;
    }
    
    while (indexOfSubArrayOne < subArrayOne) {
        array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
        indexOfSubArrayOne++;
        indexOfMergedArray++;
    }
    
    while (indexOfSubArrayTwo < subArrayTwo) {
        array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
        indexOfSubArrayTwo++;
        indexOfMergedArray++;
    }
    delete[] leftArray;
    delete[] rightArray;
}
void mergeSort(int arr[], int startIndex, int endIndex) {
    if (startIndex >= endIndex)
        return;
 
    int midIndex = startIndex + (endIndex - startIndex) / 2;
    mergeSort(array, startIndex, midIndex);
    mergeSort(array, midIndex + 1, endIndex);
    merge(array, startIndex, midIndex, endIndex);
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {5, 6, 2, 4, 1, 7, 3, 10, 11};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    mergeSort(arr, 0, n-1);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 5 6 2 4 1 7 3 10 11 ]
// [ 1 2 3 4 5 6 7 10 11 ]
~~~

**Python**:

~~~python
def mergeSort(A):
    if len(A) <= 1: return

    mid = len(A) // 2
    leftArray = A[:mid]
    rightArray = A[mid:]

    mergeSort(leftArray)
    mergeSort(rightArray)

    indexOfLeftArray, indexOfRightArray, indexOfMergedArray = 0, 0, 0

    while (indexOfLeftArray < len(leftArray) and indexOfRightArray < len(rightArray)):
        if (leftArray[indexOfLeftArray] <= rightArray[indexOfRightArray]):
            A[indexOfMergedArray] = leftArray[indexOfLeftArray]
            indexOfLeftArray += 1
        else:
            A[indexOfMergedArray] = rightArray[indexOfRightArray]
            indexOfRightArray += 1
        indexOfMergedArray += 1
    
    while (indexOfLeftArray < len(leftArray)):
        A[indexOfMergedArray] = leftArray[indexOfLeftArray]
        indexOfLeftArray += 1
        indexOfMergedArray += 1
    
    while (indexOfRightArray < len(rightArray)):
        A[indexOfMergedArray] = rightArray[indexOfRightArray]
        indexOfRightArray += 1
        indexOfMergedArray += 1
    
a = [5, 6, 2, 4, 1, 7, 3, 10, 11];
print(a)
mergeSort(a)
print(a)

# Output:
# [5, 6, 2, 4, 1, 7, 3, 10, 11]
# [1, 2, 3, 4, 5, 6, 7, 10, 11]
~~~

## Advantages

+ Merge sort is a ***stable sorting algorithm***.
+ Merge sort always has a  $O(n log(n))$ time-complexity even in the worst case.
+ Because merge sort is an algorithm that can be parallelized easily to take use of many processors or threads, it is naturally parallelizable.

## Disadvantages

+ Merge sort requires additional $O(n)$ extra memory to store the subarrays.
+ For small datasets, there are some other sorting algorithms such as insertion sort which has a lower time complexity than merge sort.



# Quick Sort

Like the ***merge sort*** algorithm, the ***Quick Sort*** is a algorithm based on the *divide-and-conquer* algorithm that choses an element as a pivot and partitions the given array around the chosen pivot by placing the pivot in its correct position in the sorted array.

The basic process of the ***quick sort*** is:

1. Chose an element, *pivot*
2. Traverse the array by comparing each element with the pivot
   + If the element is smaller than the pivot, put the element to the left side of the array
   + Otherwise, put the element to the right side of the array
   + We should remember the index of the left-most element which is bigger than the pivot.
   + After traverse the whole array, put the `pivot` element to the index of the left-most element which is bigger than the pivot. (this makes `arr = [elements smaller than pivot, pivot, elements larget than pivot]`)
3. Than we repeat the step 1 and 2 for the divided subarrays: `arr1 = [elements < pivot], arr2 = [elements > pivot]`.

## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

int partition(int arr[], int left, int right) {
    int pivot = arr[right];
    
    int index = left - 1;
    for (int i = left; i < right; i++) {
        if (arr[i] < pivot) {
            index++;
            swap(arr[i], arr[index]);
        }
    }
    index++;
    swap(arr[index], arr[right]);
    return index;
}
void quickSort(int arr[], int left, int right) {
    if (left >= right) return;
    int pivot = partition(arr,left,right);
    quickSort(arr,left,pivot-1);
    quickSort(arr,pivot+1,right);
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    quickSort(arr, 0, n - 1);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 9 5 6 2 10 1 7 3 4 0 8 ]
// [ 0 1 2 3 4 5 6 7 8 9 10 ]
~~~

**Python**:

~~~python
def partition(A, left, right):
    pivot = A[right]
    index = left - 1

    for i in range(left, right):
        if A[i] < pivot:
            index += 1
            A[index], A[i] = A[i], A[index]
    index += 1
    A[index], A[right] = A[right], A[index]
    return index

def quickSort(A, left, right):
    if (left >= right): return
    pivot = partition(A, left, right)

    quickSort(A, left, pivot - 1)
    quickSort(A, pivot + 1, right)
    
a = [9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8];
print(a)
quickSort(a, 0, len(a) - 1)
print(a)

# Output:
# [9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8]
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
~~~

## Advantages

+ Quick Sort is efficient on large data sets.
+ If we don't consider the recursive stack space, it only requires a small amount of memory to function.

## Disadvantages

+ Quick Sort has a $O(n^{2})$ time complexity in the worst case.
+ Quick Sort is not efficient for small data sets.
+ It is not a ***stable sorting algorithm***.



# Heap Sort

***Heap Sort*** is similar to the [Selection Sort](#Selection Sort) where we first find the minimum element and place the minimum element at the beginning. This algorithm based on the ***Binary Heap*** data structures, so if you are not familiar with this, please read [Binary Heap]().

The basic process of ***Heap Sort*** is:

1. Convert the array into heap data structures using *heapify*.
2. Repeat the following steps until the heap contains only one element:
   + Swap the root element of the heap (which is the largest element) with the last element of the heap.
   + Remove the last element of the heap (which is now in the correct position).
   + *Heapify* the remaining elements of the heap.
3. The sorted array is obtained by reversing order of the elements in the input array.

**Example**: `arr = [9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8]`.



## Implementation

**C++**:

~~~c++
#include <iostream>
using namespace std;

void heapify(int arr[], int n, int i) {
    int largest = i;	// Initialize largest as root
    
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    // Checks if left and right childs of root exists and any of them is greater than root
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        // Change root
        swap(arr[i], arr[largest]);
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    
    // One by one extract an element from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        swap(arr[0], arr[i]);
        // call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}
void printArr(int arr[], int size) { 
  std::cout << "[ ";
  int i; 
  for (i=0; i < size; i++) std::cout << arr[i] <<  " ";
  std::cout << "]" << std::endl;
}  
int main() {
    int arr[] = {9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printArr(arr, n);
    heapSort(arr, n);
    printArr(arr, n);
    return 0;
}
// Output:
// [ 9 5 6 2 10 1 7 3 4 0 8 ]
// [ 0 1 2 3 4 5 6 7 8 9 10 ]
~~~

**Python**:

~~~python
def heapify(A, n, i):
    largest = i

    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and A[left] > A[largest]:
        largest = left
    if right < n and A[right] > A[largest]:
        largest = right

    if largest != i:
        A[i], A[largest] = A[largest], A[i]
        heapify(A, n, largest)

def heapSort(A):
    n = len(A)
    for i in range(n // 2 - 1, -1, -1):
        heapify(A, n, i)
    
    for i in range(n - 1, 0, -1):
        A[0], A[i] = A[i], A[0]
        heapify(A, i, 0)
    
a = [9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8];
print(a)
heapSort(a)
print(a)
# Output:
# [9, 5, 6, 2, 10, 1, 7, 3, 4, 0, 8]
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
~~~

## Advantages

+ Heap Sort has a time complexity of $O(n log(n))$ in all cases.
+ It is efficient in memory usage

## Disadvantages

+ Heap sort is costly
+ Heap sort is not a ***stable sorting algorithm***.
+ Heap Sort is not very efficient when working with highly complex data. 
