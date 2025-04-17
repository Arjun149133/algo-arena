import sys

##USER_CODE_HERE##

input = sys.stdin.read().strip().split("\n")
n = int(input.pop(0))
arr = list(map(int, input.pop(0).split()))

print(findMaxElement(n, arr))