const buttons = document.querySelectorAll('.buttons button');
const errorAudio = document.querySelector('audio');
const exitButton = document.querySelector('.exit');
const minimizeButton = document.querySelector('.minimize');
const maximizeButton = document.querySelector('.maximize');
const calculator = document.querySelector('.calculator');
const titleBar = document.querySelector('.titleBar');
let screen = document.querySelector('.screen input');

const MAX_DECIMAL_LENGTH = 6;
const MAX_INPUT_LENGTH = 12;

let firstOperand = '';
let secondOperand = '';
let currentOperator = '';
let isMouseClickDown = false;

// starting point for drag n drop
let mouseClickedCoords = {
    x: 0,
    y: 0
}

let previousCalculatorOffset = {
    x: 0,
    y: 0
}

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
    // convert strings to numbers when calculating
    let result = operate(+firstOperand, currentOperator, +secondOperand);

    // if there's a decimal part
    if (result % 1 != 0) {
        // limit the length and remove trailing zeroes if any
        result = parseFloat(result.toFixed(MAX_DECIMAL_LENGTH));
    }

    // reset values after performing calculation
    firstOperand = '';
    currentOperator = '';
    secondOperand = '';
    updateScreenDisplay(result);
}

function addDigit(digit) {
    if (isOperatorAssigned() && secondOperand.length <= MAX_INPUT_LENGTH) {
        // if operator is already assigned, then  we add to the second digit
        // if there is space left on the screen
        secondOperand += digit;
        updateScreenDisplay(firstOperand + " " + currentOperator + " " + secondOperand);
    } else if (!isFirstOperandAssigned() && screen.value !== '0') {
        // if user has performed a calculation already and enters a new digit
        // start a new calculation
        screen.value = '';
        firstOperand += digit;
        updateScreenDisplay(firstOperand);
    } else if (firstOperand.length <= MAX_INPUT_LENGTH) {
        // otherwise, add input to the first operand
        firstOperand += digit;
        updateScreenDisplay(firstOperand);
    }
}

function addOperator(operator) {
    if (!isFirstOperandAssigned() && screen.value !== '0') {
        // if the user clicks on operator and there are previous results on the screen left
        // pick up the results as first operand, and keep on calculating
        firstOperand = screen.value;
        currentOperator = operator;
        updateScreenDisplay(firstOperand + " " + currentOperator);
    } else if (isFirstOperandAssigned() && isOperatorAssigned() && isSecondOperandAssigned()) {
        // if both operators and operand are already in and the user clicks another operand
        // calculate the results into first operand and set operator input to current
        calculateResult();
        firstOperand = screen.value;
        currentOperator = operator;
        updateScreenDisplay(firstOperand + " " + currentOperator);
    } else if (isFirstOperandAssigned()) {
        // if we're done with the first operand, set the operator to current
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
        // if we delete the only digit left on the screen, set screen to '0'
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
    } else if (!isOperatorAssigned()) {
        if (isFirstOperandAssigned() && !firstOperand.includes('.')) {
            firstOperand += '.';
        } else if (!isFirstOperandAssigned()) {
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
    } else if (input == "CE" || input == "Delete") {
        clearEverything();
    } else if (input == "Backspace") {
        deleteLastChar();
    } else if (input == ".") {
        insertFloatingPoint();
    }
}

// stop moving the calculator, remember its position for the next drag
function rememberCalculatorPosition() {
    if (isMouseClickDown) {
        isMouseClickDown = false;
        previousCalculatorOffset.x = parseInt(calculator.style.left);
        previousCalculatorOffset.y = parseInt(calculator.style.top);
    }
}

buttons.forEach(button => button.addEventListener('click', function(e) {
    handleInput(e.target.innerText);
}));

document.addEventListener('keydown', function(e) {
    // filter keyboard input before passing to the calculator
    if (/^[0-9]|[+\-/*=.]|Enter|Backspace|Delete/.test(e.key)) {
        handleInput(e.key);
    }
});

exitButton.addEventListener('click', function() {
    calculator.classList.add('invisible');
});

minimizeButton.addEventListener('click', function() {
    if (!calculator.classList.contains('minimized')) {
        calculator.classList.add('minimized');
    }
});

maximizeButton.addEventListener('click', function() {
    if (calculator.classList.contains('minimized')) {
        calculator.classList.remove('minimized');
    }
});

titleBar.addEventListener('mousedown', function(e) {
    if (e.target.classList != "minimize" &&
        e.target.classList != "maximize" &&
        e.target.classList != "exit") {
            isMouseClickDown = true;
            mouseClickedCoords.x = e.clientX;
            mouseClickedCoords.y = e.clientY;
        }
});

titleBar.addEventListener('mouseup', rememberCalculatorPosition);

titleBar.addEventListener('mouseleave', rememberCalculatorPosition);

titleBar.addEventListener('mousemove', function(e) {
    if (isMouseClickDown) {
        calculator.style.top = `${previousCalculatorOffset.y + e.clientY - mouseClickedCoords.y}px`;
        calculator.style.left = `${previousCalculatorOffset.x + e.clientX - mouseClickedCoords.x}px`;
    }
});