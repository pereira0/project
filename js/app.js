import { setupForm } from './first_step.js';
import { helpLanding } from '../components/help_text.js'
import { data_storage } from '../components/reusable.js';

const appDiv = document.getElementById('app');

// Function to render the landing page
export function renderLandingPage() {
    appDiv.innerHTML = `
        <img src="img/expecting.svg" alt="Expecting Parents Illustration" width="150" height="150">
        <h1>Simulador de Licença Parental</h1>
        <p>Planeiem a vossa licença parental com facilidade e descompliquem as regras da Segurança Social!</p>
        <br/>
        <p>Quando nasceu o bebé ou qual a data prevista de nascimento?</p>
        <div>
            <input type="date" id="baby-birth-date"/>
        </div>
        <div class='button-wrapper'>
            <button id="start-simulation">Começar simulação</button>
            <button id="quick-fill-first">Quick fill</button>
        </div>
        
    `;

    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp')
    helpContent.innerHTML = helpLanding

    const nextButton = document.getElementById('start-simulation');
    nextButton.disabled = true;

    document.getElementById('baby-birth-date').addEventListener('change', () => {
        const dateInput = document.getElementById('baby-birth-date').value;
        if (dateInput) {
            nextButton.disabled = false;
        }
    })

    // Add event listener for starting the simulation
    document.getElementById('start-simulation').addEventListener('click', () => {
        const dateInput = document.getElementById('baby-birth-date').value;
        // if (!dateInput) {
        //     alert('Seleciona uma data!');
        //     return;
        // }
        data_storage.babyBirthDate = dateInput // populate the dictionary with the data info
        setupForm(data_storage);
    });

    // Add event listener for quick fill
    document.getElementById('quick-fill-first').addEventListener('click', () => {
        // AUTOFILL
        document.getElementById('baby-birth-date').value = '2024-11-18';
        nextButton.disabled = false;
        const dateInput = document.getElementById('baby-birth-date').value;
    });

    // return button 
    const returnButton = document.getElementById('return-btn')
    returnButton.hidden = true
}

// Initial render
renderLandingPage();
