import { formatDate } from './reusable.js'
import { secondStep } from './second_step.js';
import { helpFirstStep } from './help_text.js';
import { renderLandingPage } from './app.js';

// Function to set up the form after selecting the baby's birth date
export function setupForm(data_storage) {
    // get data from previous step
    const babyBirthDate = data_storage.firstStep.babyBirthDate
    // get app div
    const appDiv = document.getElementById('app');

    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp')
    helpContent.innerHTML = helpFirstStep

    // update the mom's leave
    const momLeave = []; // Array to store the leave periods
    const startDate = new Date(babyBirthDate); // Convert the babyBirthDate into a Date object
    // Calculate the end date for the first leave (42 days after start date)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 41); // Add 41 days to the start date
    momLeave.push([startDate, endDate]);

    const formattedBirthDate = formatDate(new Date(babyBirthDate)); 
    const momLeaveStart = formatDate(new Date(momLeave[0][0])); 
    const momLeaveEnds = formatDate(new Date(momLeave[0][1])); 

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 1 de 3 - Licença Parental Inicial</h1>
        <p>Na licença parental inicial, a mãe tem a obrigação de tirar 6 semanas (42 dias) logo após o nascimento, e o pai 1 semana (7 dias). O pai também tem obrigação de tirar mais 3 semanas (21 dias) durante as restantes 5 semanas da mãe.</p>
        <p>Data de nascimento: <b>${formattedBirthDate}</b>.</p>
        <p>A mãe tem a licença inicial de 6 semanas (42 dias): <b>${momLeaveStart} a ${momLeaveEnds}</b>.</p>
        <div id="form-container">
            <!-- Questions will be dynamically added here -->
        </div>
        <div/>
        <button id="generate-calendar">Próximo passo</button>
        <button id="quick-fill-second">Quick fill</button>
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
        // confirmar que foram selecionadas as semanas corretas e receber a licença do pai
        const dadLeave = getSelectedWeeks(babyBirthDate);

        if (dadLeave === null) {
            // Stop further processing if validation fails
            return;
        }
        
        // populate object
        data_storage.secondStep.babyBirthDate = babyBirthDate
        data_storage.secondStep.momLeave = momLeave
        data_storage.secondStep.dadLeave = dadLeave
        // passar para o proximo passo com a informação das licenças escolhidas e da data de nascimento
        secondStep(data_storage);
    });

    document.getElementById('quick-fill-second').addEventListener('click', () => {
        document.getElementById('week-2').checked = true;
        document.getElementById('week-3').checked = true;
        document.getElementById('week-4').checked = true;
        document.getElementById('week-5').checked = false;
        document.getElementById('week-6').checked = false;
    });

    // return button 
    const returnButton = document.getElementById('return-btn')
    returnButton.hidden = false
    returnButton.addEventListener('click', () => {
        renderLandingPage()
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

    for (let i = 0; i < 6; i++) { // 5 weeks of potential joint leave, select 3
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

        if (i === 0) {
            checkbox.disabled = true;
            label.textContent = `Semana ${i + 1} (obrigatório): ${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
        }

        jointLeaveWeeksDiv.appendChild(checkbox);
        jointLeaveWeeksDiv.appendChild(label);
        jointLeaveWeeksDiv.appendChild(document.createElement('br'));
    }

    jointLeaveWeeksDiv.appendChild(document.createElement('br'));
}

// Function to retrieve selected weeks for Dad's joint leave
function getSelectedWeeks(babyBirthDate) {
    const checkboxes = document.querySelectorAll('.week-checkbox:checked');
    const selectedWeeks = Array.from(checkboxes).map(cb => parseInt(cb.value, 10));

    // Validation
    if (selectedWeeks.length < 3) {
        alert('Tens de selecionar 3 semanas.'); // Alert if less than 3
        return null; // Return null to indicate invalid selection
    }

    if (selectedWeeks.length > 3) {
        alert('Máximo de 3 semanas.'); // Alert if more than 3
        return null; // Return null to indicate invalid selection
    }

    // Now calculate the Dad's leave periods based on the selected weeks
    const dadLeave = [];

    const weekStart = new Date(babyBirthDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End date is 6 days after the start date
    dadLeave.push([weekStart, weekEnd]); // initial week

    selectedWeeks.forEach(week => {
        // Calculate the start date for this week
        const weekStart = new Date(babyBirthDate);
        weekStart.setDate(weekStart.getDate() + (7 * week)); // Add 7 days per week for the starting point

        // Calculate the end date (7 days later)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End date is 6 days after the start date

        // Push the leave period (startDate, endDate) to dadLeave array
        dadLeave.push([weekStart, weekEnd]);
    });

    return dadLeave; // Return the dadLeave array
}