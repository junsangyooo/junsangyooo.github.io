---
title:  "Complexity Analysis (Big-O Notation)"
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

# Complexity

## What is Complexity

The ***complexity*** of an algorithm is the amount of resources required to run it. 

Particular focus is given to:

+ Time complexity (the number of needed elementary operations)
+ Space complexity (memory storage)

## What is Complexity Analysis

***Complexity analysis*** is defined as a technique to figure out complexities taken by an ***algorithm*** with respect to input size.

You've probably seen some usage of complexity analysis, If you already read some [problem-solving](../../problem-solving/) posts on my blog. Then you can see that it is really helpful to understand the performance of our codes. 

If we are familiar with the *complexity analysis* we can:

+ determine the amount of time and space resources to run,
+ compare different algorithms on different input sizes, and
+ determine the difficulty of a problem.

## Big O Notation

There are several ways to denote the complexities:

+ Big O Notation,
+ Omega Notation,
+ Theta Notation,
+ Little o asymptotic notation, etc.

In this post, we will focus on Big-O Analysis of algorithms

**Big-O notation** represents the upper bound of the running time of an algorithm. Thus, we always need to think of the **worst case** to find the complexity with big-O notation. 

For a problem of size N:

+ A logarithmic function: $O(log(N))$
+ A constant-time function: $O(1)$
+ A linear-time function: $O(N)$
+ A superlinear function: $O(Nlog(N))$
+ A quadratic-time function: $O(N^{2})$
+ A polynomial function: $O(N^{c})$
+ A exponential function: $O(c^{N})$
+ A factorial function: $O(n!)$

The list above shows worse performance as go down.



### Big O Analysis

**Steps to find Big-O runtime analysis**:

1. Figure out the input and what n represents.
2. Express the maximum number of operations.
3. Eliminate all except the highest order terms.
4. Remove all the constant factors.

You may confuse about what the steps 3 and 4 mean.

In **Big-O notation**:

+ $O(N^{2}+N)=O(N^{2})$ (step 3)
+ $O(NlogN + N!)=O(N!)$ step(3)
+ $O(N) + O(N)=O(2N)=O(N)$ (step 4)
+ $O(c^{N} + 100000)=O(c^{N})$ (step 4)

Like above examples, Big O notation only focus on the highest order terms without any constant factors.

Now, let's see how to analyze **time** and **space** complexities with this technique.

### Time Complexity

The **time complexity** is the amount of time taken by a program as a function to run of the length of the input. The **time** doesn't mean the actually execution time. The **time to run** refers to how much the program costs each fundamental instruction and the number of times the instruction is executed based on the input size.

**Example:**

~~~c
// These are the examples of the "constant time" statement.
int n = 10;
if (n == 10) return n;
int n = 1000 ? n == 10 : 0;

int main() {
    int x = 1000;	// O(1)
    x++;	// O(1)
    x -= 1;	// O(1)
    return 0;
}	// the time complexity of main() is O(1)

void g() {
    for (int i = 0; i < 5; i++) {	// each traverse is O(1). 
        cout << n << endl;
    }	// O(1*5) = O(5) = O(1)
}	// the time complexity of g() is O(1)

//Assuming that n is the size of the input, 
void f(int n) {
    for (int i = 0; i < n; i++) {
        cout << n << endl;
    }	// O(1*n) = O(n)
    return;
}	// the time complexity of f() is O(n)

void h(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {	// total O(n)
        for (int j = 0; j < n; j++) {	// total O(n)
            sum += 1;
        }
    }// O(n)*O(n) = O(n^2)
    cout << sum << endl;
    return;
}	// the time complexity of h() is O(n^2)
~~~

Big-O notation is not limited in the number of inputs.

~~~c++
int twoInputs(int n, int m) {
    int sum = 0;
    for (int i = 0; i < n; i++) {	// total O(n)
        for (int j = 0; j < m; j++) {	// total O(m)
            sum++;
        }	// O(n)*O(m) = O(n*m)
    }
    return sum;
}	// the time complexity of twoInputs() is O(n*m)
~~~

### Space Complexity

The **space complexity** is the amount of memory required to run a program. Space complexity includes both Auxiliary space and space used by input.

**Example:**

~~~c++
// These are the examples of the "constant space" statement.
int x = 0;	// Auxiliary space
float y = 0.0;
int x[10];

int f(int n) {
    std::vector<int> vec;
    int x = 0;	// O(1)
    for (int i = 0; i < n; i++) {
        vec.push_back(i);
    }// O(1)*O(n) = O(n)
    // Total: O(1) + O(n) = O(n)
}// Since we created an array of size n, the space complextiy of f() is O(n)
~~~

## Optimize Complexities

Optimization is done to derive the best possible solution to solve the problem so that it will take less time and space complexity. 

To optimize a program,

+ reduce the time taken to run the program and increase space occupied,
+ reduce the memory usage of the program and increase its total run time, or
+ reduce both time and space complexity by deploying relevant algorithms.
