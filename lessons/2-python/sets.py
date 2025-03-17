s = set() # mathematical set, always prints in order

# add elements to the set
s.add(1)
s.add(3)
s.add(4)
s.add(2)
s.add(2) # it does not repeat a number in the set, this number will appear only once

print(s)

#remove elements from the set
s.remove(4)

print(s)

print(f"The set has {len(s)} elements.")