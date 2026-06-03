// DOM Elements
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

// Object containing our random generator functions
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Copy to clipboard event listener
clipboardEl.addEventListener('click', () => {
    const password = resultEl.innerText;
    
    if (!password) {
        return;
    }
    
    navigator.clipboard.writeText(password).then(() => {
        // Brief visual feedback on the button
        const originalText = clipboardEl.innerText;
        clipboardEl.innerText = 'Copied!';
        setTimeout(() => {
            clipboardEl.innerText = originalText;
        }, 1500);
    });
});

// Generate password event listener
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value; // The + converts the string to a number
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
});

// Generate password function
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    
    // Filter out unchecked types
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    // If no checkboxes are selected, return empty string
    if (typesCount === 0) {
        return '';
    }
    
    // Loop over the length to generate characters
    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    
    // Slice to the exact length chosen (in case typesCount doesn't divide evenly into length)
    // Then shuffle the characters so it doesn't always follow the same pattern (e.g., lower, upper, num, sym)
    const finalPassword = generatedPassword.slice(0, length);
    return shuffleString(finalPassword);
}

// Function to shuffle the generated password string for better randomness
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Generator Functions using Browser Character Codes (ASCII)
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}
