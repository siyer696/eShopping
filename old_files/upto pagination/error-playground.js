const sum = (a, b) => {
    if (a && b) {
        return a + b;
    }
    throw new Error("Invalid aurguments");
};

try {
    console.log(sum(1));
} catch (error) {
    console.log("Error occurred");
    // console.log(error);
}

// This is not executed if try catch is not used
console.log("This workds");