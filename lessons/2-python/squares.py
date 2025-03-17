from functions import square

for i in range(10):
    print(f"The square of {i} is {square(i)}")

# or do like this:
import functions

for i in range(10):
    print(f"The square of {i} is {functions.square(i)}")

