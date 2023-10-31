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

## C

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

## C++

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

## Python

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

# Bit Manipulation Examples

You can find the detail of the problems below from [GeeksforGeeks](https://www.geeksforgeeks.org/bits-manipulation-important-tactics/?ref=lbp).
{: .notice--danger}


## Calculate XOR from 1 to n.

**Example**:

~~~markdown
Number Binary-Repr  XOR-from-1-to-n
1         1           [0001]
2        10           [0011]
3        11           [0000]  We get a 0
4       100           [0100]  Equals to n
5       101           [0001]
6       110           [0111]
7       111           [0000]  We get 0
8      1000           [1000]  Equals to n
9      1001           [0001]
10     1010           [1011]
11     1011           [0000]  We get 0
12     1100           [1100]  Equals to n
~~~

We can find the rules using the example above that:

+ If `n % 4 == 0`, the XOR from 1 to `n` is `n`.
+ If `n % 4 == 1`, the XOR from 1 to `n` is 1.
+ If `n % 4 == 2`, the XOR from 1 to `n` is `n + 1`.
+ Otherwise, the XOR from 1 to `n` is 0.

**C++**:

~~~c++
#include <iostream>
using namespace std;
int computeXOR(int n) 
{
  if (n % 4 == 0) return n; 
  else if (n % 4 == 1) return 1; 
  else if (n % 4 == 2) return n + 1; 
  else return 0; 
}

int main() {
    int n = 7;
    cout << computeXOR(n);
}

// Output:
// 0
~~~

**Python**:

~~~python
def computeXOR(n) : 
    if n % 4 == 0 : 
        return n 
    elif n % 4 == 1 : 
        return 1
    elif n % 4 == 2 : 
        return n + 1
    else: return 0

n = 7
print(computeXOR(n))

# Output:
# 0
~~~

**Time Complexity: *$O(1)$***

**Space Complexity: *$O(1)$***

## Equal Sum and XOR

Given a positive integer `n`, find count of positive integers `i` such that `0 <= i <= n` and `n+i = n^i`.

**Example**:

~~~markdown
Input: n = 7 (0111)
i     Binary-Repr     n + i        n ^ i
0         0000         0111        0111    <--- n + i = n ^ i
1         0001         1000        0110
2         0010         1001        0101
3         0011         1010        0100
4         0100         1011        0011
5         0101         1100        0010
6         0110         1101        0001
7         0111         1110        0000
Output: i = 1

Input: n = 10 (1010)
i     Binary-Repr     n + i        n ^ i
0         0000         1010        1010    <--- n + i = n ^ i
1         0001         1011        1011    <--- n + i = n ^ i
2         0010         1100        1000
3         0011         1101        1001
4         0100         1110        1110    <--- n + i = n ^ i
5         0101         1111        1111    <--- n + i = n ^ i
6         0110         10000       1100
7         0111         10001       1101
8         1000         10010       0010
9         1001         10011       0011
10        1010         10100       0000
Output: i = 4
~~~

We know that `n + i = (n ^ i) + 2*(n & i)`.

Thus `2*(n & i)` must be zero to make `n + i = n ^ i`.

Since we only need to check each bit of `n`. For example, if `n = 10`, (1010), only possible `i` that `2*(n & i) = 0` is: (0 0/1 0 0/1).

Hence we will count the number of bits of 0 in the given `n`. Then the count of `i`s will be $2^{countOfBits}$. We can express this in bit manipulation by `1 << count_of_bits`

**C++**:

~~~c++
#include <iostream>
using namespace std;

int countValues(int n) {
    int bits = 0;
    while(n) {
        if ((n & 1) == 0) bits++;
        n = n >> 1;
    }
    return 1 << bits;
}

int main (){
    int n = 10;
    cout << countValues(n);
}
// Output:
// 4
~~~

~~~python
def countValues(n):
    bits = 0
    while(n):
        if n&1 == 0: bits += 1
        n = n >> 1
    return 1 << bits

n = 10
print(countValues(n))
# Output:
# 4
~~~

**Time Complexity: *$O(log(n))$***

**Space Complexity: *$O(1)$***

## Check if a number is power of 2

If a number, `n`, is power of 2 , it will have a form of `1 0*` where the number of `0` can be from 0 to infinite.

**Example**:

~~~markdown
Input: n = 10
n = (1010) then there is one more 1 after the first 1. Hence it is not a power of 2
Output: False

Input: n = 16
n = (10000) then there is no other 1 after the first 1. Hence it is a power of 2
~~~

We can simply check this by `(n & (n - 1)) == 0`.

**C++**:

~~~c++
#include <iostream>
using namespace std;
bool isPowerOfTwo(int n) {
    return n && (!(n & (n - 1)));
}
int main() {
    int n1 = 10;
    int n2 = 4;
    cout << isPowerOfTwo(n1) << endl;
    cout << isPowerOfTwo(n2);
}
// Output:
// 0
// 1
~~~

**Python**:

~~~python
def isPowerOfTwo(n):
    return n and not (n & (n - 1))

n1 = 10
n2 = 4
print(isPowerOfTwo(n1))
print(isPowerOfTwo(n2))
# Output:
# False
# True
~~~

**Time Complexity: *$O(1)$***

**Space Complexity: *$O(1)$***



## [Add two binary strings](https://www.geeksforgeeks.org/program-to-add-two-binary-strings/)

We will assume that the length of `a` is longer or equal to the length of `b` (otherwise, we recall the function by swapping the parameters.) For the shorter string, `b`, we will add `"0"` at the front of `b` until its length to be equal to the length of `a`. Since the binary strings is based of 2, if the sum of `a[i] and b[i] >= 2` , we remember it and add 1 in the next position and put `a[i] + b[i] % 2` at current position instead. So we are going to create a new variable, `remained`, to remember the previous left-over number.

Now we iterate the both strings from the back to the front with the index variable, `i`.

+ First we add `a[i], b[i], and remained`
+ Then we add `sum % 2` at the front of the answer string and set remained = `sum / 2`.

At the end, we check whether `remained` and if so, we add "1" at the front of the answer string.

Then we return the answer.

**C++**:

~~~c++
#include <iostream>
#include <string>
using namespace std;

string addBinary(string a, string b) {
    if (a.size() < b.size()) return addBinary(b, a);
   	string output = "";
   	for (int i = 0; i < a.size() - b.size(); i++) {
        b = "0" + b;
    }
    int remained = 0;
    for (int i = a.size() - 1; i >= 0; i--) {
        if (!remained) 
        {
            if (a[i] == '1' && b[i] == '1') 
            {
                output = "0" + output;
                remained = 1;
            } 
            else if (a[i] == '1' || b[i] == '1') output = "1" + output;
            else output = "0" + output;
        }
        else
        {
            if (a[i] == '1' && b[i] == '1') output = "1" + output;
            else if (a[i] == '1' || b[i] == '1') output = "0" + output; 
            else
            {
                remained = 0;
                output = "1" + output;
            }
        }
    }
    if (remained) output = "1" + output;
    return output;
    
}
int main() {
    string a = "110";
    string b = "11";
    cout << a << " + " << b << " = " << addBinary(a, b) << endl;
}
// Output:
// 110 + 11 = 1001
~~~

**Python**:

~~~python
def addBinary(a, b):
    if len(a) < len(b): return addBinary(b, a)
    output = ""

    for i in range(0, len(a) - len(b)):
        b = "0" + b
    
    remained = False
    for i in range(len(a) - 1, -1, -1):
        if remained:
            if a[i] == '1' and b[i] == '1':
                output = "1" + output
            elif a[i] == '1' or b[i] == '1':
                output = "0" + output
            else:
                remained = False
                output = "1" + output
        else:
            if a[i] == '1' and b[i] == '1':
                output = "0" + output
                remained = True
            elif a[i] == '1' or b[i] == '1':
                output = "1" + output
            else:
                output = "0" + output
    if remained:
        output = "1" + output
    return output

n1 = "110"
n2 = "11"
print(addBinary(n1, n2))
# Output:
# 1001
~~~

**Time Complexity: *$O(max(n, m))$***

**Space Complexity: *$O(max(n, m))$***



## [Generate all the binary number from 0 to n](https://www.geeksforgeeks.org/generate-binary-number-0-n/)

**Example**:

~~~markdown
Input: 3
Output: 0 1 10 11
~~~

In 

**C++**:

~~~c++
#include <iostream>

// Output:
// 0
// 1
~~~

**Python**:

~~~python

# Output:
# False
# True
~~~

**Time Complexity: *$O(n^{2})$***

**Space Complexity: *$O(1)$***

If you want to see more practice problems for ***bit manipulation***, check belows:

+ [29. Divide Two Integers](../../29/)
