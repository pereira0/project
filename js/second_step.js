import { generateCalendar } from '../components/reusable.js'
import { thirdStep } from './third_step.js';
import { setupForm } from './first_step.js';
import { thirdStepSecond } from './third_step_v2.js';

// Function to set up the form after selecting the baby's birth date
export function secondStep(data_storage) {
    // get app div
    const appDiv = document.getElementById('app');

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>As primeiras seis semanas!</h1>
        <div id="calendar"></div>
        <p>No próximo passo vamos perceber quais são as opções para o resto da licença inicial.</p>
        <button id="next-step-second">Próximo passo</button>
    `;

    const calendarSecondStep = generateCalendar(data_storage.babyBirthDate, data_storage.secondStep) // generate calendar
    const calendarLocation = document.getElementById('calendar') // check calendar location
    calendarLocation.appendChild(calendarSecondStep) // add calendar

    // Add event listener for the "Generate Calendar" button
    document.getElementById('next-step-second').addEventListener('click', () => { 
        // passar para o proximo passo com a informação das licenças escolhidas e da data de nascimento
        // thirdStep(data_storage);

        // TEST THIRD STEP
        thirdStepSecond(data_storage);
    });

    // return button
    document.getElementById('return-btn').addEventListener('click', () => {
        setupForm(data_storage)
    });
}