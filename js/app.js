const buttons = document.querySelectorAll('.buttons button');
let screen = document.querySelector('.screen input');

let firstOperand = '';
let secondOperand = '';
let currentOperator = '';
let decimal = false;

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
    // console.log(input);

    if (input == "Enter" || input == "=") {
        if (firstOperand && secondOperand && currentOperator) {
            let result = operate(+firstOperand, currentOperator, +secondOperand);
            firstOperand = result;
            screen.value = result;
            currentOperator = undefined;
            secondOperand = '';
        } else {
            return;
        }
    } else if (/[0-9]/.test(input)) {
        if (!currentOperator) {
            firstOperand += input;
            screen.value = firstOperand;
        } else {
            secondOperand += input;
            screen.value = firstOperand + " " + currentOperator + " " + secondOperand;
        }
    }
}

buttons.forEach(button => button.addEventListener('click', function(e) {
    handleInput(e.target.innerText);
}));

// document.addEventListener('keypress', function(e) {
//     handleInput(e.key);
// });