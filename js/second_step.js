import { formatDate, getDaysBetweenDates } from './reusable.js'

// Function to set up the form after selecting the baby's birth date
export function secondStep(babyBirthDate, momLeave, dadLeave) {
    const appDiv = document.getElementById('app');

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
        <div id="calendar"></div>
    `;

    generateCalendar(babyBirthDate, momLeave, dadLeave)

    // appDiv.innerHTML += `
    //     <p>A segunda parte da licença inicial é um bocado mais complexa. Basicamente existem 5 hipóteses:</p>
    // `;

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
        addResetButton(appDiv, babyBirthDate);
    });

}

// Function to generate and display the calendar
function generateCalendar(babyBirthDate, momsLeave, dadsLeave) {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = ''; // Clear any previous calendar

    // Set the start and end dates for the calendar
    const startDate = new Date(babyBirthDate);
    const endDate = findLatestDate(momsLeave, dadsLeave);
    
    let currentDate = new Date(startDate);

    // Loop through each month
    while (currentDate <= endDate) {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        const monthName = currentDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = monthName;

        monthDiv.appendChild(monthHeader);

        // Create a grid for the days
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Fill in empty spaces for the first row
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-day');
            daysGrid.appendChild(emptyDiv);
        }

        // Fill in the days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;

            const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            // Check if the currentDay is in Mom's leave
            const isMomLeave = momsLeave.some(range => {
                const leaveStart = new Date(range[0]);
                const leaveEnd = new Date(range[1]);
                return currentDay >= leaveStart && currentDay <= leaveEnd;
            });

            // Check if the currentDay is in Dad's leave
            const isDadLeave = dadsLeave.some(range => {
                const leaveStart = new Date(range[0]);
                const leaveEnd = new Date(range[1]);
                return currentDay >= leaveStart && currentDay <= leaveEnd;
            });

            // apply birth date styling
            const isBirthDate = currentDay.getFullYear() === new Date(babyBirthDate).getFullYear() &&
                    currentDay.getMonth() === new Date(babyBirthDate).getMonth() &&
                    currentDay.getDate() === new Date(babyBirthDate).getDate();

 
            if (isBirthDate) {
                dayDiv.classList.add('birthdate');
            }
            
            else if (isMomLeave && isDadLeave) {
                dayDiv.classList.add('joint-leave');
            }
            // Apply mom-leave if the day is only in Mom's leave
            else if (isMomLeave) {
                dayDiv.classList.add('mom-leave');
            }
            // Apply dad-leave if the day is only in Dad's leave
            else if (isDadLeave) {
                dayDiv.classList.add('dad-leave');
            }

            daysGrid.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysGrid);
        calendarDiv.appendChild(monthDiv);

        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
    }

    // add legend
    addLegend(calendarDiv);
}

// Function to find the latest date from both momLeave and dadLeave
function findLatestDate(momsLeave, dadsLeave) {
    // Initialize a variable to hold the latest date
    let latestDate = new Date(0);  // Start with the earliest possible date (Unix epoch)

    // Loop through mom's leave periods and check the end date
    momsLeave.forEach(leavePeriod => {
        const endDate = new Date(leavePeriod[1]);
        if (endDate > latestDate) {
            latestDate = endDate;
        }
    });

    // Loop through dad's leave periods and check the end date
    dadsLeave.forEach(leavePeriod => {
        const endDate = new Date(leavePeriod[1]);
        if (endDate > latestDate) {
            latestDate = endDate;
        }
    });

    // Return the latest date found
    return latestDate;
}

// Function to add the legend under the calendar
function addLegend(calendarDiv) {
    const legendDiv = document.createElement('div');
    legendDiv.classList.add('legend');

    const legendItems = [
        { color: '#5e6472', label: "Nascimento (conta para licença)" },
        { color: '#fb7e3c', label: "Licença conjunta" },
        { color: '#f3d13c', label: "Licença da mãe" },
        { color: '#02a890', label: "Licença do pai" }
        
    ];

    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');

        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = item.color;
        colorBox.classList.add('color-box');
        colorBox.style.width = "10px";
        colorBox.style.height = "10px";
        colorBox.style.display = "inline-block";
        colorBox.style.marginRight = "8px";

        const label = document.createElement('span');
        label.textContent = item.label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendItem.style.display = "flex";
        legendItem.style.alignItems = "center";
        legendItem.style.marginBottom = "8px";
        legendItem.style.fontSize = '0.9rem';

        legendDiv.appendChild(legendItem);
    });

    legendDiv.style.width = '100%';
    legendDiv.style.alignItems = 'center';
    legendDiv.style.justifyContent = 'center';
    legendDiv.style.marginTop = "20px";
    legendDiv.style.display = "flex";
    legendDiv.style.flexDirection = "row";
    legendDiv.style.gap = "10px";
    calendarDiv.appendChild(legendDiv);
}

// Function to generate the 3 options for the user to choose from
function generateOptions() {
    const appDiv = document.getElementById('app');

    const optionsSection = document.createElement('div');
    optionsSection.classList.add('second-step-options-container'); 
    
    optionsSection.innerHTML = `<p>A segunda parte da licença inicial é um bocado mais complexa. Basicamente existem 5 hipóteses:</p>`;

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

// functionality to help select longer range for 150 days+
function createLeavePeriodSelection(babyBirthDate, momLeave=[], dadLeave=[], duracao=150, minPai=0, minMae=42) {
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

    // Function to add a new selection line
    const addNewLine = (startDate, duration_leave=0, whoLeave='mãe') => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('leave-period-line');

        // Dropdown for Mom/Dad
        const personSelect = document.createElement('select');
        personSelect.innerHTML = `
            <option value="mom">A mãe</option>
            <option value="dad">O pai</option>
        `;

        // Text in between
        const midText = document.createElement('span');
        midText.textContent = 'vai ficar de licença durante';

        // Calculate the difference in milliseconds
        console.log(maxEndDate)
        console.log(startDate)

        const daysDifference = getDaysBetweenDates(startDate, maxEndDate)
        console.log(daysDifference)
        const optionsArr = [15,30,60,90,120]
        const durationSelect = document.createElement('select');
        durationSelect.innerHTML = ``

        for (let i = 0; i < optionsArr.length; i++) {
            if (daysDifference >= optionsArr[i]) {
                durationSelect.innerHTML += `
                    <option value="${optionsArr[i]}">${optionsArr[i]} dias</option>
                `;
            }
            else if (daysDifference - optionsArr[i-1] > 0 && daysDifference - optionsArr[i-1] >= 15){
                durationSelect.innerHTML += `
                    <option value="${daysDifference}">${daysDifference} dias</option>
                `;
            }
        }


        // Dropdown for duration
        
        // durationSelect.innerHTML = `
        //     <option value="15">15 dias</option>
        //     <option value="30">30 dias</option>
        //     <option value="60">60 dias</option>
        //     <option value="90">90 dias</option>
        //     <option value="120">120 dias</option>
        // `;

        // Dates display
        const datesDisplay = document.createElement('span');
        updateDatesDisplay(startDate, 15, datesDisplay); // Default to 15 days

        // Add listeners to update dates dynamically
        durationSelect.addEventListener('change', () => {
            const selectedDuration = parseInt(durationSelect.value, 10);
            updateDatesDisplay(startDate, selectedDuration, datesDisplay);
        });

        // Add the `+` button
        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.classList.add('add-line-button');

        // Button listener to add a new line
        addButton.addEventListener('click', () => {
            const selectedDuration = parseInt(durationSelect.value, 10);
            const endDate = calculateEndDate(startDate, selectedDuration);

            if (endDate < maxEndDate) {
                // update values on mom and dad leave
                if (durationSelect.value === "mom") {
                    momLeave.push([startDate, endDate]);

                }
                else if (durationSelect.value === "dad") {
                    dadLeave.push([startDate, endDate]);
                }

                // disable buttons
                addButton.disabled = true;
                durationSelect. disabled = true;
                personSelect.disabled = true;

                // reset date start for following line
                currentStartDate = new Date(endDate);
                currentStartDate.setDate(currentStartDate.getDate() + 1); // Start next day
                // remove text explanation
                const textInfo = document.getElementById('text-explanation');
                textInfo.remove() 
                // add a new line
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

        // add text line
        const explainerText = document.createElement('div');
        explainerText.id = 'text-explanation';
        explainerText.innerHTML = `
            <p>A licença inicial de <b>42 dias (6 semanas)</b> para a mãe é obrigatória. Como selecionaram <b>${duracao}</b> de licença total, os restantes ${duracao - 42} dias poderão ser gozados por ambos, em períodos mínimos de 15 dias.</p>
        `;
        container.appendChild(explainerText);
    };

    // Function to add a new selection line
    const momInitialLeave = (startDate, duration_leave=0, whoLeave='mãe') => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('leave-period-line');
        lineDiv.innerHTML = `
            <p>A mãe vai ficar de licença inicial obrigatória durante 42 dias</option>
        `;

        // Dates display
        const datesDisplay = document.createElement('span');
        updateDatesDisplay(startDate, 42, datesDisplay); 

        // Append elements to the line
        lineDiv.appendChild(datesDisplay);

        // Add line to the container
        container.appendChild(lineDiv);

        const selectedDuration = 43;
        const endDate = calculateEndDate(startDate, selectedDuration);
        return endDate;
    }

    // Mom leave
    currentStartDate = momInitialLeave(currentStartDate);
    // add starter line
    addNewLine(currentStartDate);

    return container;
}

// Function to create and append a reset button
function addResetButton(container, babyBirthDate) {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Recomeçar';
    resetButton.classList.add('reset-button');  // You can add styling here if needed

    // Button listener to reset and remove the section
    resetButton.addEventListener('click', () => {
        // Remove the leave period selection container
        const selectionsContainer = document.getElementById('leave-period-selection-container');
        if (selectionsContainer) {
            selectionsContainer.remove(); // Removes the element from the DOM
            // remove itself
            const removeButton = document.querySelector('.reset-button');
            if (removeButton) {
                removeButton.remove(); // Removes the element from the DOM
            }
            // RESTART PROCESS
            // Generate the calendar with selectors
            const leavePeriodSelection = createLeavePeriodSelection(babyBirthDate);
            // Append it to the appDiv or another container
            container.appendChild(leavePeriodSelection);
            addResetButton(container, babyBirthDate);
        }
    });

    // Append the reset button to the container
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