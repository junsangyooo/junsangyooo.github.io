---
title:  "Bitwise Algorithm"
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

***Bit*** stands for binary digit: 0 or 1.

Although we use numbers, words, and various other concepts, computers receive data encoded at the lowest level as a series of zeros and ones. These are the basis for all the commands and are called ***bits***.

The bit representation of a number is either signed or unsigned.
Usually, a signed representation is used, which means that both negative and positive numbers can be represented.
A signed variable of n bits can contain any integer between $-2^{n-1}$ and $2^{n-1} - 1$.
The int type in C++ is a signed type, so an int variable can contain any integer between $-2^{31}$ and $2^{31} - 1$.

# Basics of Bit Manipulation (Bitwise Operators)

## 1. AND (&)

| X    | Y    | X & Y |
| ---- | ---- | ----- |
| 0    | 0    | 0     |
| 0    | 1    | 0     |
| 1    | 0    | 0     |
| 1    | 1    | 1     |

**Example**: `X = 7 = (111)_2 and Y = 4 = (100)_2`. Then `X & Y = (100)_2 = 4`.

## 2. OR (|)

| X    | Y    | X \| Y |
| ---- | ---- | ------ |
| 0    | 0    | 0      |
| 0    | 1    | 1      |
| 1    | 0    | 1      |
| 1    | 1    | 1      |

**Example**: `X = 7 = (111)_2 and Y = 4 = (100)_2`. Then `X | Y = (111)_2 = 7`.

## 3. XOR (^)

| X    | Y    | X ^ Y |
| ---- | ---- | ----- |
| 0    | 0    | 0     |
| 0    | 1    | 1     |
| 1    | 0    | 1     |
| 1    | 1    | 0     |

**Example**: `X = 7 = (111)_2 and Y = 4 = (100)_2`. Then `X ^ Y = (011)_2 = 3`.

## 4. NOT (!~)

| X    | ~X   |
| ---- | ---- |
| 0    | 1    |
| 1    | 0    |

**Example**: `X = 5 = (101)_2`. Then `~X = (010)_2 = 2`.

`~` inverts with sign bit while `!` inverts without sign bit.

**Example**: `X = 0` then `(~X) = -1 and (!X) = 1`.

The first bit in a signed representation is the sign of the number, 0 for non-negative numbers and 1 for negative numbers and the remaining n−1 bits contain the magnitude of the number.

Two’s complement is used, which means that the opposite number of a number is calculated by first inverting all the bits in the number, and then increasing the number by one.

**Example**: `-7 = 11111001` where the first `1` represents the negative sign. We can get the `-7` as follows:

1. Invert all bits of `7`: `11111000`
2. Add `1` to the inverted bits: `11111000 + 1 = 11111001`.

If we only know the bit of negative number, `-7 = 11111001`, how can we know its absolute number?

We just need to follow the above steps backwards.

1. Subtract `1` from the `~X`: `11111000`
2. Invert all bits: `00000111`.

***Since all negative numbers are `Inverted_Bits_of_Positive_Number + 1`, `~X` is not `-X`. `~X = -X - 1`***.

**Example**: `X = 00000111 = 7` , `~X = 11111000` '' then what is the number of `~x`?

We should find the its absolute number, then `~x = -1 * absolute_number`.

1. Subtract 1 from the `~x`: `11110111`
2. Invert all bits: `00001000 = 8`
3. `~x = -1 * 8 = -8 = -7 -1` 

## 5. Left-Shift (<<)

The general syntax for left shift is `shift-expression << k`. The left-shift operator causes the bits in ***shift expression*** to be shifted to the left by the number of positions specified by `k`. The bit positions that the shift operation has vacated are zero-filled. 

***It multiplies that number by 2 every time we shift a number by 1 bit towards the left.***

**Example**: 

`X = 5 = (101)_2` then `X << 1 = 101 << 1 = 1010 = 10`

`X = 5 = (101)_2, then X << 2 = 101 << 2 = 10100 = 20`

## 6. Right-Shift (>>)

The general syntax for the right shift is `shift-expression >> k`. The right-shift operator causes the bits in ***shift expression*** to be shifted to the right by the number of positions specified by `k`. For unsigned numbers, the bit positions that the shift operation has vacated are zero-filled. For signed numbers, the sign bit is used to fill the vacated bit positions. In other words, if the number is positive, 0 is used, and if the number is negative, 1 is used.

***Every time we shift a number towards the right by 1 bit it divides that number by 2.***

**Example**: 

`X = 5 = (101)_2` then `X >> 1 = 101 >> 1 = 010 = 2`

`X = 7 = (111)_2` then `X >> 1 = 111 >> 1 = 011 = 3`

# Bitwise Operators in Different Languages

### C

~~~c
#include <stdio.h>
int main()
{
    // a = (00000111), b = (00001011)
    unsigned char a = 7, b = 11;
 
    // a&b = (00000011) = 3
    printf("a = %d, b = %d\na & b = %d\n", a, b, a&b);
 
    // a|b = (00001111) = 15
    printf("a | b = %d\n", a | b);
 
    // a^b = (00001100) = 12
    printf("a ^ b = %d\n", a ^ b);
 
    // ~a = (11111000), ~b = (11110100)
    printf("~a = %d, ~b = %d\n", ~a, ~b);
 
    // a << 1 = (00001110) = 14, b << 1 = (00010110) = 22
    printf("a << 1 = %d, b << 1 = %d\n", a << 1, b << 1);
 
    // a >> 1 = (00000011) = 3, b >> 1 = (00000101) = 5
    printf("a >> 1 = %d, b >> 1 = %d\n", a >> 1, b >> 1);
    return 0;
}
// Output:
// a = 7, b = 11
// a & b = 3
// a | b = 15
// a ^ b = 12
// ~a = -8, ~b = -12
// a << 1 = 14, b << 1 = 22
// a >> 1 = 3, b >> 1 = 5
~~~

### C++

~~~c++
#include <iostream>
using namespace std;
 
int main() {
    // a = (00000111), b = (00001011)
    int a = 7, b = 11;
 
    // a&b = (00000011) = 3
    cout<<"a = " << a <<","<< " b = " << b <<endl;
    cout << "a & b = " << (a & b) << endl;
 
    // a|b = (00001111) = 15
    cout << "a | b = " << (a | b) << endl;
 
    // a^b = (00001100) = 12
    cout << "a ^ b = " << (a ^ b) << endl;
 
    // ~a = (11111000), ~b = (11110100)
    cout << "~a = " << (~a) << ", ~b = " << (~b) << endl;
 
    // a << 1 = (00001110) = 14, b << 1 = (00010110) = 22
    cout<<"a << 1 = "<< (a << 1) << ", b << 1 = " << (b << 1) <<endl;
 
    // a >> 1 = (00000011) = 3, b >> 1 = (00000101) = 5
    cout<<"a >> 1 = "<< (a >> 1) << ", b >> 1 = " << (b >> 1) <<endl;
 
    return 0;
}
// Output:
// a = 7, b = 11
// a & b = 3
// a | b = 15
// a ^ b = 12
// ~a = -8, ~b = -12
// a << 1 = 14, b << 1 = 22
// a >> 1 = 3, b >> 1 = 5
~~~

### Python

~~~python
a = 7
b = 11
 
# Print bitwise AND operation
print("a & b =", a & b)
 
# Print bitwise OR operation
print("a | b =", a | b)
 
# Print bitwise NOT operation
print("~a = %d, ~b = %d" %(~a, ~b))
 
# Print bitwise XOR operation
print("a ^ b =", a ^ b)

# Print bitwise Left-Shift operation
print("a << 1 = %d, b << 1 = %d" %(a << 1, b << 1))

# Print bitwise Right-Shift operation
print("a >> 1 = %d, b >> 1 = %d" %(a >> 1, b >> 1))

# Output:
# a & b = 3
# a | b = 15
# ~a = -8, ~b = -12
# a ^ b = 12
# a << 1 = 14, b << 1 = 22
# a >> 1 = 3, b >> 1 = 5
~~~

