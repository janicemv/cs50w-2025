# Function that takes a function as input and return a modified version of it
# Functional programming paradigm

def announce(f):
    def wrapper():
        print("About to run the function...")
        f()
        print("Done with the function")
    return wrapper

@announce
def hello():
    print("Hello World!")

hello()