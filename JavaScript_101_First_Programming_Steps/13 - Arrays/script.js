// script.js

let database = ['turtle', 'cat', 'dog', 'bird'];
console.log(database);
console.log(database.length);

let animal = database[1];
console.log(animal);

database[0] = 'dinosaur';
console.log(database);

let last = database[database.length - 1];
console.log(last);

database.push('lizard');
console.log(database);

// Remove the last element.
database.pop();

console.log(database);
