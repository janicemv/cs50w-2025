people = [
    {"name": "Harry", "house": "Gryffindor"},
    {"name": "Luna", "house": "Ravenclaw"},
    {"name": "Draco", "house": "Slytherin"}
]


people.sort(key=lambda person: person["name"]) # sort dictionary list by key

print(people)