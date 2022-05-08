// const fs = require('fs');
// console.log("Hello from Node.js");

// fs.writeFileSync('test.txt', "This is text script inside test.txt");

const person = {
    name: "sachin",
    age: 23,
    greet() {
        console.log("Hi I am ", this.name);
    }
}



//Spread Operator
// const copiedPerson = { ...person};
// console.log(copiedPerson);


// Object Descruturing
const printName = ({ age }) => {
    console.log(age);
}
printName(person);

const { name,age} = person;
console.log(name, age);

// for (const key in person) {
//     console.log(key);
//     console.log(person[key]);
// }

// console.log(Array.from(person));

// Object.keys(person).forEach((value) => {
//     console.log(value);
// })

//Spread Operator
// const hobbies = ["Sports", "Cooking"];
// const copiedArray = [...hobbies];
// console.log(copiedArray);

// const toArray = (...args) => {
//     return args;
// };

//Rest Operator
// console.log(toArray(1, 2, 3));



//Array Descruturing
// const hobbies = ["Sports", "Cooking"];
// const [hobby1, hobby2] = hobbies;
// console.log(hobby1, hobby2);


