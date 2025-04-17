import sys

##USER_CODE_HERE##

input = sys.stdin.read().strip().split("\n")
a = int(input.pop(0))
b = int(input.pop(0))

print(findSum(a, b))