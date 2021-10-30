const buttons = document.querySelectorAll('.buttons button');

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, operator, b) {
    switch(operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case ":":
            if (a === 0) {
                return undefined;
            }
            return divide(a, b);
        default:
            return null;
    }
}

function handleInput(input) {
    console.log(input);
}

buttons.forEach(button => button.addEventListener('click', function(e) {
    handleInput(e.target.id);
}));

document.addEventListener('keypress', function(e) {
    handleInput(e.key);
});