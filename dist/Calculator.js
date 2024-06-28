export class Calculator {
    constructor(display) {
        this.currentOperation = '';
        this.firstOperand = '';
        this.secondOperand = '';
        this.display = display;
        this.attachEventListeners();
    }
    appendNumber(number) {
        if (this.currentOperation) {
            this.secondOperand += number;
            this.display.value = this.secondOperand;
        }
        else {
            this.firstOperand += number;
            this.display.value = this.firstOperand;
        }
    }
    setOperation(operation) {
        if (this.firstOperand) {
            this.currentOperation = operation;
        }
    }
    clearDisplay() {
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperation = '';
        this.display.value = '';
    }
    calculateResult() {
        if (this.firstOperand && this.secondOperand && this.currentOperation) {
            const result = eval(this.firstOperand + this.currentOperation + this.secondOperand);
            this.display.value = result.toString();
            this.firstOperand = result.toString();
            this.secondOperand = '';
            this.currentOperation = '';
        }
    }
    attachEventListeners() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                const value = target.innerText;
                if (!isNaN(Number(value))) {
                    this.appendNumber(value);
                }
                else if (value === 'C') {
                    this.clearDisplay();
                }
                else if (value === '=') {
                    this.calculateResult();
                }
                else {
                    this.setOperation(value);
                }
            });
        });
    }
}
