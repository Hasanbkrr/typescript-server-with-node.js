import { Calculator } from './Calculator.js';
document.addEventListener('DOMContentLoaded', () => {
    const calculatorDisplay = document.getElementById('display');
    new Calculator(calculatorDisplay);
});
