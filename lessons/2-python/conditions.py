# n = input("Number: ")  # TypeError: '>' not supported between instances of 'str' and 'int' => the program "thinks" it's comparing string with number because "input" always gives back a string

n = int(input("Number: ")) # this way we make sure the input is an int

if n > 0: 
    print("positive number")
elif n < 0:
    print("negative number")
else:
    print("zero!")