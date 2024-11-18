import { MomsLeave, DadsLeave } from './leave.js';
import { formatDate } from './reusable.js'

// Function to set up the form after selecting the baby's birth date
export function setupForm(babyBirthDate) {
    const appDiv = document.getElementById('app');

    console.log("Baby Birth Date:", babyBirthDate);
    const formattedDate = formatDate(new Date(babyBirthDate));

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 1 de 3 - Licença Parental Inicial</h1>
        <p>Na licença parental inicial, a mãe tem a obrigação de tirar 6 semanas (42 dias) logo após o nascimento, e o pai 1 semana (7 dias). O pai também tem obrigação de tirar mais 3 semanas (21 dias) durante as restantes 5 semanas da mãe.</p>
        <p>O bebé nasceu ou vai nascer a <b>${formattedDate}</b>.</p>
        <div id="form-container">
            <!-- Questions will be dynamically added here -->
        </div>
        <div/>
        <button id="generate-calendar">Próximo passo</button>
        <div id="calendar"></div>
    `;

    const formContainer = document.getElementById('form-container');

    // Add questions to the form dynamically

    formContainer.innerHTML += `
        <div class="form-group">
            <label for="joint-leave-weeks">Quais as semanas que o pai quer tirar após a semana inicial? Escolhe 3.</label>
            <div id="joint-leave-weeks">
                <!-- Weeks will be generated here dynamically -->
            </div>
        </div>
    `;

    // Generate joint leave week checkboxes
    generateWeekSelection(babyBirthDate);

    // Add event listener for the "Generate Calendar" button
    document.getElementById('generate-calendar').addEventListener('click', () => {
        // criar variáveis da licença da mãe e pai
        // passar para o proximo passo com a informação das licenças escolhidas e da data de nascimento
        const momDays = parseInt(document.getElementById('mom-leave-duration').value, 10);
        const dadDays = parseInt(document.getElementById('dad-leave-duration').value, 10);
        const selectedWeeks = getSelectedWeeks();

        // Create Mom's and Dad's leave objects
        const momsLeave = new MomsLeave(babyBirthDate, momDays);
        const dadsLeave = new DadsLeave(babyBirthDate, dadDays, selectedWeeks);

        // Generate and display the calendar
        generateCalendar(momsLeave, dadsLeave);
    });
}

// Function to generate week checkboxes for Dad's joint leave
function generateWeekSelection(babyBirthDate) {
    const jointLeaveWeeksDiv = document.getElementById('joint-leave-weeks');
    jointLeaveWeeksDiv.innerHTML = ''; // Clear previous content

    const startDate = new Date(babyBirthDate);

    // Calculate the end date for the first week
    const firstWeekEnd = new Date(startDate);
    firstWeekEnd.setDate(startDate.getDate() + 6);

    const primeiraSemana = document.createElement('p');
    primeiraSemana.textContent = `Semana 1 (obrigatória): ${formatDate(startDate)} a ${formatDate(firstWeekEnd)}`;
    jointLeaveWeeksDiv.appendChild(primeiraSemana);

    for (let i = 1; i < 6; i++) { // 5 weeks of potential joint leave, select 3
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + i * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `week-${i + 1}`;
        checkbox.value = i;
        checkbox.className = 'week-checkbox';

        const label = document.createElement('label');
        label.setAttribute('for', `week-${i + 1}`);
        label.textContent = `Semana ${i + 1}: ${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

        jointLeaveWeeksDiv.appendChild(checkbox);
        jointLeaveWeeksDiv.appendChild(label);
        jointLeaveWeeksDiv.appendChild(document.createElement('br'));
    }

    jointLeaveWeeksDiv.appendChild(document.createElement('br'));
}

// Function to retrieve selected weeks for Dad's joint leave
function getSelectedWeeks() {
    const checkboxes = document.querySelectorAll('.week-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.value, 10));
}