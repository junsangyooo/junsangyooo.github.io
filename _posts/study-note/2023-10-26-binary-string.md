---
title:  "Binary String"
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
A ***binary string*** is a special kind of string consisting of only two types of characters, such as 0 and 1.

**Example**: `"01010101", "00000001", "111110"`

## Variables of Binary Strings

+ **BINARY**: The BINARY data type is used to store fixed-length binary data.
+ **VARBINARY**: The VARBINARY data type allows for variable-length binary data.
+ **BLOB**: The BLOB data type is used to store large binary data objects such as images, audio files, or video files.

## Properties of Binary Strings

+ **Length**: The amount of bits in a binary string.
+ **Concatenation**: Arranging two or more binary strings one after the other.
+ **Substring**: Binary strings can be broken up or divided into binary strings for each substring.
+ **Prefix and Suffix**: A prefix is a substring that starts a binary string at the beginning. A binary string’s suffix is a substring that is appended to the end of the string.
+ **Hamming distance**: The number of points where the corresponding symbols diverge in two binary strings of equal length is known as the Hamming distance.
+ **Regular Language**: The set of all binary strings is a regular language, which means that a finite state machine or regular expression can understand it.
+ **Binary arithmetic**: In binary arithmetic, where each bit corresponds to a power of 2, binary strings can be used to express integers.

You should understand [Bitwise Algorithm](/algorithm/bitwise-algorithm/) before look into some application of binary strings below. 
{: .notice--danger}

## Generate all the binary strings of N bits

Given a positive integer number `N`. The task is to generate all the binary strings of `N` bits.

**Example**: `N = 2`.

~~~markdown
Output:
0 0
0 1
1 0
1 1
~~~

A ***binary string*** is a special kind of string consisting of only two types of characters, such as 0 and 1.

**Example**: `"01010101", "00000001", "111110"`


**Solution**:

1. Generate all numbers from $0$ to $2^{n}-1$.
2. Convert each number to its binary representation using the bitset class from C++ Standard Library.
3. Extract the last `n` bits of the binary representation using the substr method.

**C++**:

~~~c++
#include <iostream>
#include <bitset>
using namespace std;

int generateBinaryStrings(int n) {
    for (int i = 0; i < (1 << n); i++) {
        bitset<32> b(i);
        cout << b.to_string().substr(32-n) << endl;
    }
}
~~~

**Python**:

~~~python
def generateBinaryStrings(n):
    for i in range(1 << n):
        binary_str = format(i, '0' + str(n) + 'b')
        print(binary_str)
~~~

## Add two binary strings

**Example**: `a = "10", b="1"` then `output = "11"`

