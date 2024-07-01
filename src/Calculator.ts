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

    private async calculateResult(): Promise<void> {
        if (this.firstOperand && this.secondOperand && this.currentOperation) {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstOperand: this.firstOperand,
                    secondOperand: this.secondOperand,
                    operation: this.currentOperation,
                }),
            });
            const result = await response.json();
            this.display.value = result.result.toString();
            this.firstOperand = result.result.toString();
            this.secondOperand = '';
            this.currentOperation = '';
        }
    }

    private async fetchHistory(): Promise<void> {
        const response = await fetch('/api/history');
        const history = await response.json();
        const historyList = document.getElementById('historyList');
        if (historyList) {
            historyList.innerHTML = '';
            history.forEach((item: { operation: string; result: number }) => {
                const li = document.createElement('li');
                li.textContent = `${item.operation} = ${item.result}`;
                historyList.appendChild(li);
            });
        }
        const historyContainer = document.getElementById('historyContainer');
        if (historyContainer) {
            historyContainer.style.display = 'block';
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
                } else if (value === 'History') {
                    this.fetchHistory();
                } else {
                    this.setOperation(value);
                }
            });
        });
    }
}
