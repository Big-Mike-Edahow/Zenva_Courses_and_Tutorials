// script.js

// Select the sign element by it's id.
let sign = document.getElementById('sign');

// Select the button element. Add an event listener.
let changeButton = document.getElementById("change-button");
changeButton.addEventListener("click", changeSign);

// Modify the text content and color.
function changeSign() {
    sign.textContent = 'Welcome, travelers!';
    sign.style.color = 'blue';

    // Hide the instructions and button.
    let instructions = document.getElementById('instructions');
    instructions.style.display = 'none';
    changeButton.style.display = 'none';
}
