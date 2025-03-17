# OOP in Python

# class Point():
#     def __init__(self, x, y): # magical function that is called when I create the object | self references the object itself
#         self.x = x # store the values in the object
#         self.y = y

# p = Point(2, 8)

# print(p.x)
# print(p.y)

class Flight():
    def __init__(self, capacity):
        self.capacity = capacity
        self.passengers = []

    def add_passenger(self, name):
        if not self.open_seats(): # if there are no open seats
            return  False # bool: uppercase F!
        self.passengers.append(name)
        return True

    def open_seats(self):
        return self.capacity - len(self.passengers)

flight = Flight(3) # creating an object Flight with capacity of 3 passengers

people = ["Harry", "Ron", "Hermione", "Ginny"]

for person in people:
    success = flight.add_passenger(person)
    if success:
        print(f"Added {person} successfully")
    else:
        print(f"Could not add {person}")

print(flight.passengers)