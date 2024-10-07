class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand += number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') this.compute();
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        this.currentOperand = prev + current;
        break;
      case '-':
        this.currentOperand = prev - current;
        break;
      case '*':
        this.currentOperand = prev * current;
        break;
      case '÷':
        this.currentOperand = prev / current;
        break;
      default:
        return;
    }

    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    const [integerDigits, decimalDigits] = number.toString().split('.');
    const integerDisplay = isNaN(parseFloat(integerDigits)) ? '' : parseFloat(integerDigits).toLocaleString('en');
    return decimalDigits != null ? `${integerDisplay}.${decimalDigits}` : integerDisplay;
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    this.previousOperandTextElement.innerText = this.operation
      ? `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      : '';
  }
}

const calculator = new Calculator(
  document.querySelector('[data-previous-operand]'),
  document.querySelector('[data-current-operand]')
);

// Event Listeners for button clicks
document.querySelectorAll('[data-number]').forEach(button =>
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
);

document.querySelectorAll('[data-operation]').forEach(button =>
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
);

document.querySelector('[data-equals]').addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

document.querySelector('[data-all-clear]').addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

document.querySelector('[data-delete]').addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (event) => {
  if (event.key >= '0' && event.key <= '9') {
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  }
  
  if (event.key === '.') {
    calculator.appendNumber('.');
    calculator.updateDisplay();
  }

  if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
    const operationMap = { '+': '+', '-': '-', '*': '*', '/': '÷' }; // Map keyboard operators to the correct button text
    calculator.chooseOperation(operationMap[event.key]);
    calculator.updateDisplay();
  }

  if (event.key === 'Enter') {
    calculator.compute();
    calculator.updateDisplay();
  }

  if (event.key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
  }

  if (event.key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
});
