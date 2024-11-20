import { setupForm } from './first_step.js';
import { helpLanding } from './help_text.js'
import { data_storage } from './reusable.js';

const appDiv = document.getElementById('app');

// Function to render the landing page
export function renderLandingPage() {
    appDiv.innerHTML = `
        <img src="img/expecting.svg" alt="Expecting Parents Illustration" width="150" height="150">
        <h1>Simulador de Licença Parental</h1>
        <p>Planeiem a vossa licença parental com facilidade e descompliquem as regras da Segurança Social!</p>
        <br/>
        <p>Quando nasceu o bebé ou qual a data prevista de nascimento?</p>
        <input type="date" id="baby-birth-date" />
        <button id="start-simulation">Começar simulação</button>
        <button id="quick-fill-first">Quick fill</button>
        
    `;

    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp')
    helpContent.innerHTML = helpLanding

    // Add event listener for starting the simulation
    document.getElementById('start-simulation').addEventListener('click', () => {
        const dateInput = document.getElementById('baby-birth-date').value;
        if (!dateInput) {
            alert('Seleciona uma data!');
            return;
        }
        data_storage.firstStep.babyBirthDate = dateInput // populate the dictionary with the data info
        console.log(data_storage)
        setupForm(data_storage);
    });

    // Add event listener for quick fill
    document.getElementById('quick-fill-first').addEventListener('click', () => {
        document.getElementById('baby-birth-date').value = '2024-11-18';
        const dateInput = document.getElementById('baby-birth-date').value;
    });

    // return button 
    const returnButton = document.getElementById('return-btn')
    returnButton.hidden = true
}

// Initial render
renderLandingPage();
