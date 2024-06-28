import { Calculator } from './Calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    const calculatorDisplay = document.getElementById('display') as HTMLInputElement;
    new Calculator(calculatorDisplay);
});
