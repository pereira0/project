import { formatDate, getDaysBetweenDates } from './reusable.js'

// Function to set up the form after selecting the baby's birth date
export function thirdStep(babyBirthDate, momLeave, dadLeave) {
    const appDiv = document.getElementById('app');

    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
    `;

    generateOptions();  // Call the new function to generate the options

    document.getElementById('option-1').addEventListener('click', () => {
        // update mom array
        momLeave = updateMomLeaveWith120Days(babyBirthDate, momLeave)
        // remove options buttons
        const optionsContainer = document.querySelector('.second-step-options-container');
        if (optionsContainer) {
            optionsContainer.remove(); // Removes the element from the DOM
        }
        // generate new calendar
        generateCalendar(babyBirthDate, momLeave, dadLeave)
    });

    document.getElementById('option-2').addEventListener('click', () => {
        // update mom array
        momLeave = updateMomLeaveWith150Days(babyBirthDate, momLeave)
        // remove options buttons
        const optionsContainer = document.querySelector('.second-step-options-container');
        if (optionsContainer) {
            optionsContainer.remove(); // Removes the element from the DOM
        }
        // generate new calendar
        generateCalendar(babyBirthDate, momLeave, dadLeave)
    });

    document.getElementById('option-3').addEventListener('click', () => {

        // remove options buttons
        const optionsContainer = document.querySelector('.second-step-options-container');
        if (optionsContainer) {
            optionsContainer.remove(); // Removes the element from the DOM
        }

        // Generate the calendar with selectors
        const leavePeriodSelection = createLeavePeriodSelection(babyBirthDate)
        // Append it to the appDiv or another container
        appDiv.appendChild(leavePeriodSelection);
        addResetAndValidateButton(appDiv, babyBirthDate);
    });

}

// Function to generate the 3 options for the user to choose from
function generateOptions() {
    const appDiv = document.getElementById('app');

    appDiv.innerHTML += `
        <p>RR é a Remuneração de Referência - média das remunerações registadas na SS no período dos seis meses mais antigos dos últimos oito prévios ao mês do impedimento para o trabalho.</p>
        <p>A segunda parte da licença inicial é um bocado mais complexa. Basicamente existem 5 hipóteses:</p></span>
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

    appDiv.appendChild(optionsSection);
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

// // functionality to help select longer range for 150 days+
// function createLeavePeriodSelection(babyBirthDate, momLeave=[], dadLeave=[], duracao=150, minPai=0, minMae=42) {
//     const container = document.createElement('div');
//     container.id = 'leave-period-selection-container';

//     // Header
//     const header = document.createElement('h2');
//     header.textContent = 'Planeie os períodos de licença';
//     container.appendChild(header);

//     // Initialize start date
//     let currentStartDate = new Date(babyBirthDate);
//     const maxEndDate = new Date(currentStartDate);
//     maxEndDate.setDate(maxEndDate.getDate() + duracao - 1);
//     console.log(maxEndDate)

//     // Function to add a new selection line
//     const addNewLine = (startDate) => {
//         const lineDiv = document.createElement('div');
//         lineDiv.classList.add('leave-period-line');

//         // Dropdown for Mom/Dad
//         const personSelect = document.createElement('select');
//         personSelect.innerHTML = `
//             <option value="mom">A mãe</option>
//             <option value="dad">O pai</option>
//         `;

//         // Text in between
//         const midText = document.createElement('span');
//         midText.textContent = 'vai ficar de licença durante';

//         const daysDifference = getDaysBetweenDates(startDate, maxEndDate)

//         console.log(daysDifference)

//         const optionsArr = [15,30,60,78,90,120]
//         const durationSelect = document.createElement('select');
//         durationSelect.innerHTML = ``


//         for (let i = 0; i < optionsArr.length; i++) {
//             console.log(daysDifference)
//             if (daysDifference >= optionsArr[i]) {
//                 durationSelect.innerHTML += `
//                     <option value="${optionsArr[i]}">${optionsArr[i]} dias</option>
//                 `;
//             }
//             else if (daysDifference - optionsArr[i-1] > 0 && daysDifference - optionsArr[i-1] >= 15){
//                 durationSelect.innerHTML += `
//                     <option value="${daysDifference}">${daysDifference} dias</option>
//                 `;
//             }
//         }

//         // Dates display
//         const datesDisplay = document.createElement('span');
//         updateDatesDisplay(startDate, 15, datesDisplay); // Default to 15 days

//         // Add listeners to update dates dynamically
//         durationSelect.addEventListener('change', () => {
//             const selectedDuration = parseInt(durationSelect.value, 10);
//             updateDatesDisplay(startDate, selectedDuration, datesDisplay);
//         });

//         // Add the `+` button
//         const addButton = document.createElement('button');
//         addButton.textContent = '+';
//         addButton.classList.add('add-line-button');

//         // Button listener to add a new line
//         addButton.addEventListener('click', () => {
//             const selectedDuration = parseInt(durationSelect.value, 10);
//             const endDate = calculateEndDate(startDate, selectedDuration);

//             if (endDate < maxEndDate) {
//                 // update values on mom and dad leave
//                 if (durationSelect.value === "mom") {
//                     momLeave.push([startDate, endDate]);

//                 }
//                 else if (durationSelect.value === "dad") {
//                     dadLeave.push([startDate, endDate]);
//                 }

//                 // disable buttons
//                 addButton.disabled = true;
//                 durationSelect. disabled = true;
//                 personSelect.disabled = true;

//                 // reset date start for following line
//                 currentStartDate = new Date(endDate);
//                 currentStartDate.setDate(currentStartDate.getDate() + 1); // Start next day
//                 // remove text explanation
//                 const textInfo = document.getElementById('text-explanation');
//                 textInfo.remove() 
//                 // add a new line
//                 addNewLine(currentStartDate);
//             } else {
//                 alert('A data final ultrapassa o limite permitido de 150 dias.');
//             }
//         });

//         // Append elements to the line
//         lineDiv.appendChild(personSelect);
//         lineDiv.appendChild(midText);
//         lineDiv.appendChild(durationSelect);
//         lineDiv.appendChild(datesDisplay);
//         lineDiv.appendChild(addButton);

//         // Add line to the container
//         container.appendChild(lineDiv);

//         // add text line
//         const explainerText = document.createElement('div');
//         explainerText.id = 'text-explanation';
//         explainerText.innerHTML = `
//             <p>A licença inicial de <b>42 dias (6 semanas)</b> para a mãe é obrigatória. Como selecionaram <b>${duracao}</b> de licença total, os restantes ${duracao - 42} dias poderão ser gozados por ambos, em períodos mínimos de 15 dias. Para a opção da mãe gozar 120 dias seguidos e o pai gozer os 30 dias finais, selecionar 78 dias.</p>
//         `;
//         container.appendChild(explainerText);
//     };

//     // Function to add mom's initial leave
//     const momInitialLeave = (startDate) => {
//         const lineDiv = document.createElement('div');
//         lineDiv.classList.add('leave-period-line');
//         const textoInside = document.createElement('span');
//         textoInside.textContent = `A mãe vai ficar de licença inicial obrigatória durante 42 dias:`;

//         // Dates display
//         const datesDisplay = document.createElement('span');
//         updateDatesDisplay(startDate, 42, datesDisplay); 

//         // Append elements to the line
//         lineDiv.appendChild(textoInside);
//         lineDiv.appendChild(datesDisplay);

//         // Add line to the container
//         container.appendChild(lineDiv);

//         const selectedDuration = 43;
//         const endDate = calculateEndDate(startDate, selectedDuration);
//         return endDate;
//     }

//     // Mom leave
//     currentStartDate = momInitialLeave(currentStartDate);
//     // add starter line
//     addNewLine(currentStartDate);

//     return container;
// }

// Function to create leave period selection
function createLeavePeriodSelection(babyBirthDate, momLeave = [], dadLeave = [], duracao = 150, minPai = 30, minMae = 42) {
    const container = document.createElement('div');
    container.id = 'leave-period-selection-container';

    // Header
    const header = document.createElement('h2');
    header.textContent = 'Planeie os períodos de licença';
    container.appendChild(header);

    // Initialize start date
    let currentStartDate = new Date(babyBirthDate);
    const maxEndDate = new Date(currentStartDate);
    maxEndDate.setDate(maxEndDate.getDate() + duracao - 1);
    console.log(maxEndDate)

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