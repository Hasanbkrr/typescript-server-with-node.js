import { Calculator } from './Calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    const calculatorDisplay = document.getElementById('display') as HTMLInputElement;
    if (calculatorDisplay) {
        new Calculator(calculatorDisplay);
    }
});
