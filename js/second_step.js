import { generateCalendar } from '../components/reusable.js'
import { thirdStep } from './third_step.js';
import { setupForm } from './first_step.js';

// Function to set up the form after selecting the baby's birth date
export function secondStep(data_storage) {
    // get data from storage
    const babyBirthDate = data_storage.secondStep.babyBirthDate
    const momLeave = data_storage.secondStep.momLeave
    const dadLeave = data_storage.secondStep.dadLeave

    // get app div
    const appDiv = document.getElementById('app');

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
        <div id="calendar"></div>
        <p>Estas são as primeiras 6 semanas da licença inicial! No próximo passo vamos perceber quais são as opções para o resto da licença inicial.</p>
        <button id="next-step-second">Próximo passo</button>
    `;

    generateCalendar(babyBirthDate, momLeave, dadLeave)

    // Add event listener for the "Generate Calendar" button
    document.getElementById('next-step-second').addEventListener('click', () => { 
        // passar para o proximo passo com a informação das licenças escolhidas e da data de nascimento
        thirdStep(data_storage);
    });

    // return button
    document.getElementById('return-btn').addEventListener('click', () => {
        setupForm(data_storage)
    });

}