---
title:  "Arrays in C / C++"
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
categories: "Data-Structure"

# LaTeX available
use_math: true

# redirect_from:
#   - /위험카테고리이름/파일이름
---

# C / C++
## Array Declaration

~~~c
// 1-D-Array
data_type array_name[size];

// 2-D-Array
data_type array_name[row][col];

// N-D-Array
data_type array_name[size_1][size_2]...[size_N];

// Example:
#include <stdio.h>

int main(){
    int arr[5]; // array of int elements with size of 5
    char arrc[10]; // array of char elements with size of 10

    return 0;
}
~~~
## Array Initialization

We now learned how to declare an array in C/C++. But how can we initialize it?
Initialization in C/C++ is the process to assign some initial value to the variable.
There are three ways to initialize an array:

+ With declaration:

  + ~~~C
    data_type array_name[size] = {val_1, val_2, ..., val_size};
    ~~~
  + Then the values are assigned in the array with its declaration.
  + Curly braces, ${}$, means **initializer list** in C/C++. We use it to initialize multiple elements of the array by enclosed the values within ${}$ separated by a comma.

+ With declaration without size:

  + ~~~C
    data_type array_name[] = {val_1, val_2, ..., val_size};
    ~~~
  + When we use the **initializer list** with declaration, we can skip declaring the array with size as the compiler can automatically deduce the size of the array.

+ After declaration:

  + ~~~C
    for (int i = 0; i < size; i++){
        array_name[i] = value_i;
    }
    ~~~

  + We can assign the initial value to each element individually. 


## Access Array Elements

To access an array element, refer to its **index** which starts from 0.

e can access any element of an array in C using the array subscript operator **[ ]** and the index value $i$ of the element.

**Syntax**

~~~c
array_name[index];
~~~

**Example**:

~~~c
int main(){
    int arr[] = {3, 6, 10, 15}; // array initialize with declaration without size
                                // Then our values = {3, 6, 10, 15}
                                // 			     index = {0, 1,  2,  3}
	printf("Element at arr[2]: %d\n", arr[2]);	// print the element at index 2 i.e. third element
    return 0;
}
~~~

**Output**:

~~~c
Element at arr[2]: 10
~~~

Now we can access array elements, which means we can also modify the elements.

**Syntax**

~~~c
array_name[index] = new_val;
~~~

~~~c
int main(){
    int arr[] = {3, 6, 10, 15};
  
	printf("Element at arr[2]: %d\n", arr[2]);
    arr[2] = 20;	// change the element at index 2 to 20
    printf("Element at arr[2]: %d\n", arr[2]);
    return 0;
}
~~~

**Output**

~~~c
Element at arr[2]: 10
Element at arr[2]: 20
~~~

## Initialization of a Multi-dimensional Array

**Syntax**

~~~C
data_type array_name[size_1][size_2]...[size_N] = { {{...}, ..., {...}}, ..., {{...}, ..., {...}} };
~~~

**Example**:

~~~c
int arr[2][2][2] = { {{1, 0}, {-1, 3}},
                    {{1, 2}, {3, 4}} };
~~~



You've learned that we can skip declaring the array with size when we initialize with declaration. However, when you initialize a **multi-dimensional** array with declaration, you are allowed to skip only the left most dimension.

**Wrong example**:

~~~C
int arr[][][2] = { {{1, 0}, {-1, 3}}, 
                  {{1, 2}, {3, 4}} }; // This array is [2][2][2]. This causes an error
~~~

**Correct example**:

~~~C
int arr[][2][2] = { {{1, 0}, {-1, 3}},
                   {{1, 2}, {3, 4}} }; // Only the size of the left most dimension can be skipped.
~~~

## Access Multi-dimensional Array Elements

**Syntax**

~~~c
array_name[index_1][index_2]...[index_n];
~~~

**Example**:

~~~C
int main(){
    int arr[][2] = {{3, 6}, {10, 15}, {1, -1}}; // size: [3][2]
    
    // element in index of 2 (third element) in the first dimension: {1, -1}
    // and element in index of 1 (second element) in the second dimension: -1
    int element = arr[2][1]; 
    
	printf("Element at arr[2][1]: %d\n", element);
    return 0;
}
~~~

**Output**

~~~c
Element at arr[2][1]: -1
~~~

## Passing an Array to a Function

A whole array cannot be passed as an argument to a function in C++, but you can pass a pointer to an array without an index by specifying the array's name.

In C, an array is always passed as pointers to a function. Whenever we try to pass an array to a function, it decays to the pointer and then passed as a pointer to the first element of an array.

**Example of C**

~~~C
#include <stdio.h>
#include <stdlib.h>

void helper(int arr[]) {	// same as void helper(int *arr)
    unsigned int n = sizeof(arr)/sizeof(arr[0]);
    printf("\nArray size inside helper() is %d", n);
}
int main() {
    int arr[] = {1,3,4,1};
    unsigned int n = sizeof(arr)/sizeof(arr[0]);
    printf("Array size inside main() is %d", n);
    helper(arr);
    return 0;
}
~~~

**Example of C++**

~~~c++
#include <iostream>
using namespace std;
 
void helper(int arr[]) {	// same as void helper(int *arr)
    unsigned int n = sizeof(arr) / sizeof(arr[0]);
    cout << "\nArray size inside helper() is " << n;
}
 
int main() {
    int arr[] = {1,3,4,1};
    unsigned int n = sizeof(arr) / sizeof(arr[0]);
    cout << "Array size inside main() is " << n;
    helper(arr);
    return 0;
}
~~~

**Output**

~~~C
Array size inside main() is 4
Array size inside helper() is 2
~~~

This is because the size of a pointer is 8 bytes in 64 bit computer and is 4 bytes in 32 bit computer. Since our *arr* in helper() is just a pointer, $sizeof(arr) = 4$. Thus $4 / 2 = 2$.

In helper(), we cannot know the size of the array. Thus, When we pass an array to another function, we also need to send the size of the array.

~~~c
void helper(int *arr, unsigned int n){// now we know the size of arr
    return;
}
int main() {
    int arr[] = {1, 3, 4, 1};
    unsigned int n = sizeof(arr)/sizeof(arr[0]);
    helper(arr, n);	// send an array and its size
    return 0;
}

~~~



