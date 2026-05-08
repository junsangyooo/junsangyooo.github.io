---
title:  "Kadane's Algorithm"
layout: single

author_profile: false

# right side bar: table of contents
toc: true
toc_sticky: true
toc_label: Contents
toc_icon: "fas fa-utensils"

# left side bar: other contents
sidebar:
    nav: "counts"

#Choose categories
categories: [Study Note]

# Define tags
tag: [Algorithm, C++, Python]

# LaTeX available
use_math: true

# redirect_from:
#   - /위험카테고리이름/파일이름
---

# What is Kadane's Algorithm for

Kadane's algorithm is the optimal solution to find the subarray of the given array such that the sum of numbers in the subarray is the largest among sums for any other possible subarrays.

## Find the largest sum

The basic algorithm is:

1. Create two variables ***max_so_far*** and ***max_ending_here*** to store the maximum sum of contiguous subarray found so far and the maximum sum contiguous subarray endint at current index.
2. When we iterate the array, in every index, we set `max_ending_here += arr[index]` and set `max_so_far = max(max_so_far, max_ending_here)`. if `max_ending_here < 0` then we set `max_ending_here = 0`. 
3. After the iteration, we return `max_so_far`.

**C++**:

~~~c++
#include <iostream>
using namespace std;

int maxSubArraySum(int arr[], int size) { 
    int max_so_far = INT_MIN;
    int max_ending_here = 0;
    for (int i = 0; i < size; i++) {
        max_ending_here += arr[i];
        if (max_so_far < max_ending_here) max_so_far = max_ending_here;
        if (max_ending_here < 0) max_ending_here = 0;
    }
    return max_so_far;
}  
int main()
{
    int a[] = { -1, -5, -1, 5, 2, -3, 3, 4 };
    int n = sizeof(a) / sizeof(a[0]);

    int max_sum = maxSubArraySum(a, n);
    cout << "Maximum contiguous sum is " << max_sum;
    return 0;
}
// Output:
// Maximum contiguous sum is 11 
~~~

**Python**:

~~~python
import sys

def maxSubArraySum(A, size):
    max_so_far = -sys.maxsize - 1
    max_ending_here = 0
    for i in range(size):
        max_ending_here += A[i]
        if max_so_far < max_ending_here: max_so_far = max_ending_here
        if max_ending_here < 0: max_ending_here = 0
    return max_so_far

a = [-1, -5, -1, 5, 2, -3, 3, 4];
max_sum = maxSubArraySum(a, len(a))
print("Maximum contiguous sum is %d" %max_sum)
# Output:
# Maximum contiguous sum is 11
~~~

**Time Complexity: $O(n)$**:

Our program iterates the input array once.

**Space Complexity: $O(1)$**:

We only use constant extra space.

## Find the subarray of the largest sum

The code above finds the largest sum itself but what if we want to get the ***subarray*** of it?

Then we only need to create variables ***start*** and ***end***. The ***start*** stores the start index of ***max_ending_here*** and when ***max_so_far*** is updated with ***max_ending_here***, we store the end index to ***end***.

**C++**:

~~~c++
#include <iostream>
using namespace std;

void maxSubArraySum(int arr[], int size) { 
    int max_so_far = INT_MIN;
    int max_ending_here = 0;
    int start = 0;
    int end = 0;
    int tmp_start = 0;
    for (int i = 0; i < size; i++) {
        max_ending_here += arr[i];
        if (max_so_far < max_ending_here) {
            max_so_far = max_ending_here;
            end = i;
            start = tmp_start;
        }
        if (max_ending_here < 0) {
            max_ending_here = 0;
            tmp_start = i + 1;
        }
    }
    
    cout << "Maximum contiguous sum is " << max_so_far << endl;
    cout << "The Starting index: " << start << " and the Ending index: " << end << endl;
    cout << "The subarray  of the largest sum: [";
    for (int i = start; i < end; i++) cout << arr[i] << ", ";
    cout << arr[end] << "]" << endl;
}  
int main()
{
    int a[] = { -1, -5, -1, 5, 2, -3, 3, 4 };
    int n = sizeof(a) / sizeof(a[0]);

    maxSubArraySum(a, n);
    return 0;
}
// Output:
// Maximum contiguous sum is 11
// The Starting index: 3 and the Ending index: 7
// The subarray  of the largest sum: [5, 2, -3, 3, 4]
~~~

**Python**:

~~~python
import sys

def maxSubArraySum(A, size):
    max_so_far = -sys.maxsize - 1
    max_ending_here = 0
    start, end, tmp_start = 0, 0, 0
    for i in range(size):
        max_ending_here += A[i]
        if max_so_far < max_ending_here:
            max_so_far = max_ending_here
            start, end = tmp_start, i
        if max_ending_here < 0:
            max_ending_here = 0
            tmp_start = i + 1
    print("Maximum contiguous sum is %d" %max_sum)
    print("The Starting index: {0} and the Ending index: {1}".format(start, end))
    print("The subarray of the largest sum: ", A[start:end + 1])

a = [-1, -5, -1, 5, 2, -3, 3, 4];
maxSubArraySum(a, len(a))
# Output:
# Maximum contiguous sum is 11
# The Starting index: 3 and the Ending index: 7
# The subarray of the largest sum:  [5, 2, -3, 3, 4]
~~~

**Time Complexity: $O(n)$**:

Our program iterates the input array once.

**Space Complexity: $O(1)$**:

We only use constant extra space.
