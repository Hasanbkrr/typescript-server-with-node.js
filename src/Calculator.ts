export class Calculator {
    private display: HTMLInputElement;
    private currentOperation: string = '';
    private firstOperand: string = '';
    private secondOperand: string = '';

    constructor(display: HTMLInputElement) {
        this.display = display;
        this.attachEventListeners();
    }

    private appendNumber(number: string): void {
        if (this.currentOperation) {
            this.secondOperand += number;
            this.display.value = this.secondOperand;
        } else {
            this.firstOperand += number;
            this.display.value = this.firstOperand;
        }
    }

    private setOperation(operation: string): void {
        if (this.firstOperand) {
            this.currentOperation = operation;
        }
    }

    private clearDisplay(): void {
        this.firstOperand = '';
        this.secondOperand = '';
        this.currentOperation = '';
        this.display.value = '';
    }

    private calculateResult(): void {
        if (this.firstOperand && this.secondOperand && this.currentOperation) {
            const result = eval(this.firstOperand + this.currentOperation + this.secondOperand);
            this.display.value = result.toString();
            this.firstOperand = result.toString();
            this.secondOperand = '';
            this.currentOperation = '';
        }
    }

    private attachEventListeners(): void {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target as HTMLButtonElement;
                const value = target.innerText;

                if (!isNaN(Number(value))) {
                    this.appendNumber(value);
                } else if (value === 'C') {
                    this.clearDisplay();
                } else if (value === '=') {
                    this.calculateResult();
                } else {
                    this.setOperation(value);
                }
            });
        });
    }
}
