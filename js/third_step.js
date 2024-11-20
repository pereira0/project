import { formatDate, getDaysBetweenDates } from '../components/reusable.js'
import { generateCalendar } from '../components/reusable.js';
import { helpThirdStep } from '../components/help_text.js';
import { secondStep } from './second_step.js';

// Function to set up the form after selecting the baby's birth date
export function thirdStep(data_storage) {
    // hide original return button 
    const returnButton = document.getElementById('return-btn')
    returnButton.hidden = true

    // get data from storage
    const babyBirthDate = data_storage.secondStep.babyBirthDate;
    let momLeave = data_storage.secondStep.momLeave;
    let dadLeave = data_storage.secondStep.dadLeave;

    // get app div
    const appDiv = document.getElementById('app');

    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp');
    helpContent.innerHTML = helpThirdStep;
    
    // start content
    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
        <div id="calendar"></div>
        <div id="choices-li"></div>
        <button id="return-btn" class="return-button">&#8592;</button>
    `;

    generateOptions(babyBirthDate, momLeave, dadLeave);  // Call the new function to generate the options

    document.getElementById('return-btn').addEventListener('click', () => {
        const calendarElement = document.getElementById('calendar');
        const choicesElement = document.getElementById('choices-li');
    
        // Check if calendar has content
        if (calendarElement && calendarElement.innerHTML.trim() !== '') {
            console.log('Calendar has content, moving to generate options...');
            calendarElement.innerHTML = ''
            generateOptions(babyBirthDate, momLeave, dadLeave);  // Call the new function to generate the options
        } 
        // Check if choices-li has content
        else if (choicesElement && choicesElement.innerHTML.trim() !== '') {
            console.log('Choices have content, moving to the second step...');
            secondStep(data_storage); // Proceed to second step
        } 
        // Handle case where neither has content
        else {
            console.error('Neither calendar nor choices have valid content.');
        }
    });
    
}

// Function to generate the 3 options for the user to choose from
function generateOptions(babyBirthDate, momLeave, dadLeave) {
    const optionsDiv = document.getElementById('choices-li')

    optionsDiv.innerHTML = `
        <p>A segunda parte da licença inicial é um bocado mais complexa. Basicamente existem 5 hipóteses:</p>
        `;

    const optionsSection = document.createElement('div');
    optionsSection.classList.add('second-step-options-container'); 
      

    const options = [
        { id: 'option-1', title: 'Opção 1', total: '120 dias', description: 'tirados inteiramente pela mãe.', price: '100% RR' },
        { id: 'option-2', title: 'Opção 2', total: '150 dias', description: 'tirados inteiramente pela mãe.', price: '80% RR' },
        { id: 'option-3', title: 'Opção 3', total: '150 dias partilhados', description: '120 (ou menos) são tirados pela mãe e 30 (ou mais) são tirados pelo pai (para além do período incial).', price: '100% RR' },
        { id: 'option-4', title: 'Opção 4', total: '180 dias partilhados', description: '150 (ou menos) são tirados pela mãe e 30 (ou mais) são tirados pelo pai (para além do período incial).', price: '83% RR' },
        { id: 'option-5', title: 'Opção 5', total: '180 dias partilhados', description: '120 (ou menos) são tirados pela mãe e 60 (ou mais) são tirados pelo pai (para além do período incial).', price: '90% RR' }
    ];

    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('second-step-option'); 
        optionDiv.innerHTML = `
            <h3>${option.title}</h3>
            <h4>${option.total}</h4>
            <p>${option.description}</p>
            <p><strong>${option.price}</strong></p>
            <button id="${option.id}">Escolher</button>
        `;
        optionsSection.appendChild(optionDiv);
    });

    // add to HTML    
    optionsDiv.appendChild(optionsSection);

    document.getElementById('option-1').addEventListener('click', () => {
        momLeave = updateMomLeaveWith120Days(babyBirthDate, momLeave) // update mom array
        removeOptionsContainer() // remove options container
        generateCalendar(babyBirthDate, momLeave, dadLeave) // generate new calendar
    });

    document.getElementById('option-2').addEventListener('click', () => {
        momLeave = updateMomLeaveWith150Days(babyBirthDate, momLeave) // update mom array
        removeOptionsContainer() // remove options container
        generateCalendar(babyBirthDate, momLeave, dadLeave) // generate new calendar
    });

    document.getElementById('option-3').addEventListener('click', () => {
        removeOptionsContainer() // remove options container
        const leavePeriodSelection = createLeavePeriodSelection(babyBirthDate) // Generate the calendar with selectors
        appDiv.appendChild(leavePeriodSelection); // Append it to the appDiv or another container
        addResetAndValidateButton(appDiv, babyBirthDate);
    });

}

// Function to update the momLeave array when option of 120 days is chosen
function updateMomLeaveWith120Days(babyBirthDate, momLeave) {
    const startDate = new Date(babyBirthDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 119); // Add 120 days

    // Update the momLeave array
    momLeave.length = 0; // Clear any existing entries
    momLeave.push([startDate, endDate]);

    return momLeave
}

// function to update the momLeave array when option of 150 days is chosen
function updateMomLeaveWith150Days(babyBirthDate, momLeave) {
    const startDate = new Date(babyBirthDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 149); // Add 120 days

    // Update the momLeave array
    momLeave.length = 0; // Clear any existing entries
    momLeave.push([startDate, endDate]);

    return momLeave
}

// Function to create leave period selection
function createLeavePeriodSelection(babyBirthDate, momLeave = [], dadLeave = [], duracao = 150, minPai = 30, minMae = 42) {
    const container = document.getElementById('calendar')
    container.innerHTML = `
        <div if='leave-period-selection-container'>
            <h2>Planeie os períodos de licença</h2>
        
        </div>`;

    // Initialize start date
    let currentStartDate = new Date(babyBirthDate);
    const maxEndDate = new Date(currentStartDate);
    maxEndDate.setDate(maxEndDate.getDate() + duracao - 1);

    // Function to calculate and update mom/dad leave arrays
    const updateLeaveData = (startDate, duration, person) => {
        const endDate = calculateEndDate(startDate, duration);
        if (person === 'mom') {
            momLeave.push([startDate, endDate]);
        } else {
            dadLeave.push([startDate, endDate]);
        }
        return endDate;
    };

    // Function to validate if dad meets the minimum leave requirement
    const validateDadLeave = () => {
        const dadDays = dadLeave.reduce((total, range) => {
            const [start, end] = range;
            return total + getDaysBetweenDates(start, end);
        }, 0);
        return dadDays >= minPai;
    };

    // Function to add a new selection line
    const addNewLine = (startDate) => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('leave-period-line');

        // Dropdown for Mom/Dad
        const personSelect = document.createElement('select');
        personSelect.innerHTML = `
            <option value="mom">A mãe</option>
            <option value="dad">O pai</option>
        `;

        // Text between dropdowns
        const midText = document.createElement('span');
        midText.textContent = 'vai ficar de licença durante';

        // Dropdown for duration
        const durationSelect = document.createElement('select');
        const optionsArr = [15, 30, 60, 90, 120];
        const daysLeft = getDaysBetweenDates(startDate, maxEndDate);

        // Populate duration dropdown
        optionsArr.forEach((option) => {
            if (option <= daysLeft) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = `${option} dias`;
                durationSelect.appendChild(optionElement);
            }
        });

        if (daysLeft >= 15 && !optionsArr.includes(daysLeft)) {
            const customOption = document.createElement('option');
            customOption.value = daysLeft;
            customOption.textContent = `${daysLeft} dias`;
            durationSelect.appendChild(customOption);
        }

        // Display calculated dates
        const datesDisplay = document.createElement('span');
        updateDatesDisplay(startDate, 15, datesDisplay); // Default to 15 days

        // Update dates dynamically
        durationSelect.addEventListener('change', () => {
            const selectedDuration = parseInt(durationSelect.value, 10);
            updateDatesDisplay(startDate, selectedDuration, datesDisplay);
        });

        // Add a button to add more lines
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.classList.add('add-line-button');

        addButton.addEventListener('click', () => {
            const selectedDuration = parseInt(durationSelect.value, 10);
            const person = personSelect.value;

            const endDate = updateLeaveData(startDate, selectedDuration, person);

            if (endDate < maxEndDate) {
                // Disable the current line inputs
                addButton.disabled = true;
                personSelect.disabled = true;
                durationSelect.disabled = true;

                // Start a new line
                currentStartDate = new Date(endDate);
                currentStartDate.setDate(currentStartDate.getDate() + 1); // Next day
                addNewLine(currentStartDate);
            } else {
                alert('A data final ultrapassa o limite permitido de 150 dias.');
            }
        });

        // Append elements to the line
        lineDiv.appendChild(personSelect);
        lineDiv.appendChild(midText);
        lineDiv.appendChild(durationSelect);
        lineDiv.appendChild(datesDisplay);
        lineDiv.appendChild(addButton);

        // Add line to the container
        container.appendChild(lineDiv);
    };

    // Mom's mandatory leave (42 days)
    const momInitialLeave = () => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('leave-period-line');
        const textoInside = document.createElement('span');
        textoInside.textContent = `A mãe vai ficar de licença inicial obrigatória durante ${minMae} dias:`;

        // Dates display
        const datesDisplay = document.createElement('span');
        updateDatesDisplay(currentStartDate, minMae, datesDisplay);

        // Append elements to the line
        lineDiv.appendChild(textoInside);
        lineDiv.appendChild(datesDisplay);

        // Add line to the container
        container.appendChild(lineDiv);

        const endDate = updateLeaveData(currentStartDate, minMae, 'mom');
        currentStartDate = new Date(endDate);
        currentStartDate.setDate(currentStartDate.getDate() + 1); // Next day
    };

    // Initialize with mom's leave and first line
    momInitialLeave();
    addNewLine(currentStartDate);

    return container;
}

// Function to create and append a reset button
function addResetAndValidateButton(container, babyBirthDate) {
    // Add validation button
    const validateButton = document.createElement('button');
    validateButton.textContent = 'Validar Licença';
    validateButton.classList.add('validate-button');
    validateButton.addEventListener('click', () => {
        if (!validateDadLeave()) {
            alert('O pai não cumpre o mínimo de licença obrigatória.');
        } else {
            alert('Planeamento válido.');
        }
    });

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Recomeçar';
    resetButton.classList.add('reset-button');  // You can add styling here if needed

    // Button listener to reset and remove the section
    resetButton.addEventListener('click', () => {
        // Remove the leave period selection container
        const selectionsContainer = document.getElementById('leave-period-selection-container');
        if (selectionsContainer) {
            selectionsContainer.remove(); // Removes the element from the DOM
            resetButton.remove(); // Removes the element from the DOM
            validateButton.remove(); // Removes the element from the DOM
            
            // RESTART PROCESS
            // Generate the calendar with selectors
            const leavePeriodSelection = createLeavePeriodSelection(babyBirthDate);
            // Append it to the appDiv or another container
            container.appendChild(leavePeriodSelection);
            addResetAndValidateButton(container, babyBirthDate);
        }
    });

    // Append the reset button to the container
    container.appendChild(validateButton);
    container.appendChild(resetButton);
}

// Helper: Update dates display
function updateDatesDisplay(startDate, duration, displayElement) {
    const start = new Date(startDate);
    const end = calculateEndDate(start, duration);
    displayElement.textContent = `: ${formatDate(start)} a ${formatDate(end)}`;
}

// Helper: Calculate end date based on duration
function calculateEndDate(startDate, duration) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration - 1);
    return endDate;
}

// remove options buttons
function removeOptionsContainer(){
    const optionsContainer = document.querySelector('.second-step-options-container');
    if (optionsContainer) {
        optionsContainer.remove(); // Removes the element from the DOM
    }

}