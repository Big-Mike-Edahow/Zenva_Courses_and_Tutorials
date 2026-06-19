// script.js

function sendSignal() {
    console.log('HELP!');
}

let i = 0;

while (i < 1000) {
    sendSignal();
    i++;
}

let result = 0;

let j = 1;

while (j <= 10) {
    result = result + j;
    console.log(result);
    j++;
}

console.log(result);
