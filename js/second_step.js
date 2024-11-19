import { generateCalendar } from './reusable.js'
import { thirdStep } from './third_step.js';

// Function to set up the form after selecting the baby's birth date
export function secondStep(babyBirthDate, momLeave, dadLeave) {
    const appDiv = document.getElementById('app');

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
        <div id="calendar"></div>
    `;

    generateCalendar(babyBirthDate, momLeave, dadLeave)

    appDiv.innerHTML += `
        <p>Estas são as primeiras 6 semanas da licença inicial! No próximo passo vamos perceber quais são as opções para o resto da licença inicial.</p>
        <button id="next-step-second">Próximo passo</button>

    `;

    // Add event listener for the "Generate Calendar" button
    document.getElementById('next-step-second').addEventListener('click', () => { 
        // passar para o proximo passo com a informação das licenças escolhidas e da data de nascimento
        thirdStep(babyBirthDate, momLeave, dadLeave);
    });

}