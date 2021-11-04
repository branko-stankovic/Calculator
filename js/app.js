const buttons = document.querySelectorAll('.buttons button');
const errorAudio = document.querySelector('audio');
let screen = document.querySelector('.screen input');

let firstOperand = '';
let secondOperand = '';
let currentOperator = '';

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
                playErrorAudio();
                alert("ERROR! Division by 0 is undefined!");
                return undefined;
            }
            return divide(a, b);
        default:
            return null;
    }
}

function isOperatorAssigned() {
    return Boolean(currentOperator);
}

function isFirstOperandAssigned() {
    return Boolean(firstOperand);
}

function isSecondOperandAssigned() {
    return Boolean(secondOperand);
}

function updateScreenDisplay(content) {
    screen.value = content;
}

function playErrorAudio() {
    errorAudio.currentTime = 0;
    errorAudio.play();
}

function calculateResult() {
    let result = operate(+firstOperand, currentOperator, +secondOperand);

    if (!result) {
        playErrorAudio();
        return "ERROR: Invalid result.";
    }

    if (result % 1 != 0) {
        result = result.toFixed(2);
    }

    firstOperand = result.toString();
    currentOperator = '';
    secondOperand = '';
    updateScreenDisplay(result);
}

function addDigit(digit) {
    if (isOperatorAssigned() && secondOperand.length < 12) {
        secondOperand += digit;
        updateScreenDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    } else if (firstOperand.length < 12) {
        firstOperand += digit;
        updateScreenDisplay(firstOperand);
    }
}

function addOperator(operator) {
    if (isFirstOperandAssigned() && isOperatorAssigned() && isSecondOperandAssigned()) {
        calculateResult();
        currentOperator = operator;
        updateScreenDisplay(firstOperand + " " + currentOperator);
    } else if (isFirstOperandAssigned()) {
        currentOperator = operator;
        updateScreenDisplay(firstOperand + " " + currentOperator);
    }
}

function clearEverything() {
    firstOperand = '';
    currentOperator = '';
    secondOperand = '';
    updateScreenDisplay('0');
}

function deleteLastChar() {
    if (isSecondOperandAssigned()) {
        secondOperand = secondOperand.slice(0, -1);
        updateScreenDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    } else if (isOperatorAssigned()) {
        currentOperator = '';
        updateScreenDisplay(firstOperand);
    } else if (isFirstOperandAssigned()) {
        firstOperand = firstOperand.slice(0, -1) || '0';
        updateScreenDisplay(firstOperand);
    }
}

function insertFloatingPoint() {
    if (isOperatorAssigned() && !secondOperand.includes('.')) {
        if (isSecondOperandAssigned()) {
            secondOperand += '.';
        } else {
            secondOperand += '0.';
        }
        updateScreenDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    } else {
        if (isFirstOperandAssigned() && !firstOperand.includes('.')) {
            firstOperand += '.';
        } else {
            firstOperand += '0.';
        }
        updateScreenDisplay(firstOperand);
    }
}

function handleInput(input) {
    if (input == "Enter" || input == "=") {
        if (isFirstOperandAssigned() && isSecondOperandAssigned() && isOperatorAssigned()) {
            calculateResult();
        } else {
            console.log("Enter both values and an operator to calculate the results.");
        }
    } else if (/[0-9]/.test(input)) {
        addDigit(input);
    } else if (/[+\-/*]/.test(input)) {
        addOperator(input);
    } else if (input == "CE") {
        clearEverything();
    } else if (input == "Backspace") {
        deleteLastChar();
    } else if (input == ".") {
        insertFloatingPoint();
    }
}

buttons.forEach(button => button.addEventListener('click', function(e) {
    handleInput(e.target.innerText);
}));

document.addEventListener('keypress', function(e) {
    handleInput(e.key);
});