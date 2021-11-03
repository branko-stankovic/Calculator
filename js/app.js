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
        case "/":
            if (b === 0) {
                return undefined;
            }
            return divide(a, b);
        default:
            return null;
    }
}

function handleInput(input) {
    if (input == "Enter" || input == "=") {
        if (firstOperand && secondOperand && currentOperator) {
            let result = operate(+firstOperand, currentOperator, +secondOperand);
            if (!result) {
                console.log("ERROR");
                return;
            }
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
    } else if (/[+-/*]/.test(input) && firstOperand) {
        currentOperator = input;
        screen.value = firstOperand + " " + currentOperator;
    } else if (input == "CE") {
        firstOperand = '';
        secondOperand = '';
        currentOperator = '';
        screen.value = '0';
    } else if (input == "Backspace") {
        if (!currentOperator && firstOperand) {
            firstOperand = firstOperand.slice(0, -1);
            screen.value = firstOperand;
        } else if (secondOperand) {
            secondOperand = secondOperand.slice(0, -1);
            screen.value = firstOperand + " " + currentOperator + " " + secondOperand;
        }
    }// else if (input == ".") {
    //     if (!currentOperator && firstOperand && !firstOperand.includes(input)) {
    //         firstOperand += input;
    //         screen.value = firstOperand;
    //     } else if (secondOperand && !secondOperand.includes(input)) {
    //         secondOperand += input;
    //         screen.value = firstOperand + " " + currentOperator + " " + secondOperand;
    //     }
    // }
}

buttons.forEach(button => button.addEventListener('click', function(e) {
    handleInput(e.target.innerText);
}));

document.addEventListener('keypress', function(e) {
    handleInput(e.key);
});