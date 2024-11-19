// Select elements
const helpBtn = document.getElementById('helpBtn');
const helpBox = document.getElementById('helpBox');
const closeHelp = document.getElementById('closeHelp');

// Show the help box when the Help button is clicked
helpBtn.addEventListener('click', () => {
    helpBox.classList.add('visible');
});

// Hide the help box when the close button is clicked
closeHelp.addEventListener('click', () => {
    helpBox.classList.remove('visible');
});

// Hide the help box when clicking outside the help content
helpBox.addEventListener('click', (event) => {
    if (event.target === helpBox) {
        helpBox.classList.remove('visible');
    }
});