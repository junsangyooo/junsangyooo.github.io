---
title:  "Data Structure Study Note"
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

#Choose categories
categories: "Data-Structure"

use_math: true

# redirect_from:
#   - /위험카테고리이름/파일이름
---

<!-- <div class="notice--info">
<h3>Welcome to my first Data Structure study note!!</h3>
<p> This post briefly review the category of data structures and basic description of them.</p>
</div> -->

# What is Data Structure

**Data Structure** is a way of storing and organizing data. Data structures are essential and responsible for organizing, accessing, processing, and storing data efficiently. There are many different data structures and each of them has its own characteristic. Thus, we need to choose the most efficient data structure for our situation to reduce the complexity (time and memory) of the code. To choose the proper data structure in any situation, we should know each data structure's characteristic.

## Data Structure is not a Data Type

+ **Data Type**
  + is the form of a variable to which a value can be assigned
  + can hold value and is dataless
  + examples: int, char, double, etc.
+ **Data Structure**
  + is a collection of different kinds of data
  + can hold multiple types of data within a single object
  + examples: array, stack, tree, graph, etc.



# Category of Data Structures

Data Structures can be divided into two categories: **Linear Data Structures** and **Non-linear Data Structures**.

+ **Linear Data Structure**
  + Elements are arranged in one dimension, linear dimension.
  + Data elements connect to each other sequentially.
  + User can traverse in a single run.
  + examples: list, array, stack, queue, etc.
+ **Non-linear Data Structure**
  + Elements are arranged in one-many, many-one and many-many dimensions.
  + Data elements connect to each other hierarchically.
  + User needs multiple runs to traverse completely.
  + examples: tree, graph, etc.

There are two types of linear data structure, **static** and **dynamic**.

## Static Data Structure

**Static** Data Structure is an organization or collection of data in memory which have a fixed size. The content of the data structure can be modified without changing the memory space allocated to it. The best example of the Static Data Structure is **Array**.

The *size* of any static data structures must be defined before the declaration of the data structure and its size is fixed in memory. This means it is allocated at ***compile-time***.

| values  | 1    | 2    | 3    | 4    | 5    | 6    | 7    |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| indexes | 0    | 1    | 2    | 3    | 4    | 5    | 6    |

This list has size of 7. We can change any values:

| values  | 1    | 4    | 5    | 10   | 100  | 29   | 1    |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| indexes | 0    | 1    | 2    | 3    | 4    | 5    | 6    |

However, we cannot change the size which means we can't push values more than its size.

### Advantages

+ It offers fast access because allocated memory at compile-time and the fixed size make accessing elements a simple indexing operation.
+ It is comfortable in predicting how much memory will be used by the program, which is a key-point in memory-constrained environments.
+ Static data structures are comparatively easier to handle as the compiler handles allocation and deallocation processes.
+ It is safe from overflow or underflow conditions while modifying it.
+ Memory is allocated in contiguous form so no need to maintain any type of variables to store the memory location.

### Disadvantages

+ Before initializing the structure, users have to estimate and choose the maximum required space for it which may be more than the actual required resulting in memory waste.
+ Modifying the structure is limited since the structure's maximum size is fixed.
+ Deleting one element may leave a vacant space between two other elements, and filling the space costly concerning time.



## Dynamic Data Structure

**Dynamic** Data Structure is an organization or collection of data whose size can be modified during the operations performed on it. We can find the examples of the Dynamic Data Structure easily, **Linked List**, **Tree**, **Heap**, etc.

The *memory* is allocated at the ***run-time*** and the *size* varies at the run-time of the code. Memory can be dynamically allocated or deallocated during program execution. 

### Advantages

+ It can grow or shrink at run-time as needed, allowing it to adapt to changing data requirements.
+ Since it can resize itself and it can allocate additional memory on the heap, it reduces memory waste.
+ No need to worry about the maximum or minimum size required.
+ Inserting and deleting elements are optimal in space and time.
+ User can reuse the memory as deallocating the original one.

### Disadvantages

+ Allocating memory at the run-time decreases the performance of dynamic data structures since it requires another variable to store the address of their allocated memory.
+ It requires users to deallocate the memory and if the user forgets deallocating then a memory leak may occur.
+ Users should care about overflow or underflow problems.



## Conclusion

+ Data Structures are the containers of data
+ Data Type and Data Structure are different.
+ Choosing a proper data structure is the key-point of reducing complexities of different tasks.
+ Elements in a **Linear Data Structure** are arranged in one dimension ,also known as linear dimension.
+ Elements in a **Non-Linear Data Structure** are arranged in one-many, many-one and many-many dimensions.
+ Basically a data structure is of two types: **Static Data Structures** and **Dynamic Data Structures**.
+ A **Static Data Structure** is an organization or collection of data in memory with fixed size.
+ A **Dynamic Data Structure** is an organization or collection of data in memory which do not have a fixed size.
