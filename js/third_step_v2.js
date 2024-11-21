import { formatDate, getDaysBetweenDates, options, calculateEndDate } from '../components/reusable.js'
import { generateCalendar } from '../components/reusable.js';
import { helpThirdStep } from '../components/help_text.js';
import { secondStep } from './second_step.js';

// Function to set up the form after selecting the baby's birth date
export function thirdStepSecond(data_storage) {
    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp');
    helpContent.innerHTML = helpThirdStep;

    // get app div
    const appDiv = document.getElementById('app');

    // start content
    appDiv.innerHTML = `<div id='content'></div>`;

    // populate appDiv
    choicesCreation('content', data_storage);

    // get return button
    const returnButton = document.getElementById('return-btn');
    returnButton.hidden = false;

    // return button functionality
    document.getElementById('return-btn').addEventListener('click', () => {
        const calendarDiv = document.getElementById('calendar')
        if (calendarDiv) {
            choicesCreation('content', data_storage);
        } else {
            secondStep(data_storage)
        }
    });
}

// creates all 5 options
function choicesCreation(divName, data_storage) {
    const containerDiv = document.getElementById(divName)
    containerDiv.innerHTML = `<h2>O resto da licença inicial</h2>`

    const optionsSection = document.createElement('div');
    optionsSection.classList.add('second-step-options-container'); 
    optionsSection.id = 'options-section'

    // create options container and each level      
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
    containerDiv.appendChild(optionsSection);

    // add functionality to the option buttons
    options.forEach(option => {
        document.getElementById(option.id).addEventListener('click', () => {
            populateCalendarAndData(divName, option.id, data_storage)
        });
    });
}

// logic for after an option is selected
function populateCalendarAndData(divName, optionID, data_storage) {
    const containerDiv = document.getElementById(divName)


    // remove the current div or replace with empty
    containerDiv.innerHTML = `<h2>Selecionado</h2>`

    // check which button was clicked 
    // logic for options 1 and 2
    if (optionID === 'option-1' || optionID === 'option-2') {
        // get duration of leave
        let duration = 0
        if (optionID === 'option-1') {
            duration = 120;            
        }
        else if (optionID === 'option-2') {
            duration = 150;
        }
        // populate mom & dad leave leave for the first two options
        data_storage.thirdStep.dadLeave = data_storage.secondStep.dadLeave
        data_storage.thirdStep.momLeave = [[new Date(data_storage.babyBirthDate), calculateEndDate(data_storage.babyBirthDate, duration)]]

        // show the calendar for the first two options
        const calendarThirdStep = generateCalendar(data_storage.babyBirthDate, data_storage.thirdStep) // generate calendar
        containerDiv.appendChild(calendarThirdStep)
    } 

    // logic for options 3, 4 or 5
    else if (optionID === 'option-3' || optionID === 'option-4' || optionID === 'option-5') {
        datePickerContainer(divName, optionID, data_storage)
    }

}

function datePickerContainer(divName, optionID, data_storage) {
    // get duration of leave and minimum dad leave
    let duration = 0;
    let dadMin = 0;
    if (optionID === 'option-3') {
        duration = 150;
        dadMin = 30;            
    }
    else if (optionID === 'option-4') {
        duration = 180;
        dadMin = 30;
    } else if (optionID === 'option-5') {
        duration = 180;
        dadMin = 60;
    }

    // get container
    const containerDiv = document.getElementById(divName)

    // restart the current div or replace with empty
    containerDiv.innerHTML = `
        <h2>É preciso escolher como vai acontecer o resto da licença</h2>
        <p>A duração escolhida foi de <b>${duration} dias</b>, da qual o pai tem de tirar um mínimo de <b>${dadMin} dias para além do que foi tirado nas primeiras 6 semanas.</b></p>
    `

    const alreadyPickedDatesArr = alreadyPickedDates(data_storage.secondStep)

    console.log(alreadyPickedDatesArr)

    for (let i = 0; i < alreadyPickedDatesArr.length; i++) {
        const element = alreadyPickedDatesArr[i]
        containerDiv.appendChild(addNewLineExisting(element));
      }

    containerDiv.appendChild(addNewLine(optionID, '2024-11-21'))

    return containerDiv
}

function addNewLineExisting(arrayElement) {
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('leave-period-line');

    const textoInicial = ``
    if (arrayElement[0] === 'mom') {
        textoInicial = `<p>A mãe vai ficar de licença de ${formatDate(arrayElement[1])} a ${formatDate(arrayElement[2])}.</p>`
    } else {
        textoInicial = `<p>O pai vai ficar de licença de ${arrayElement[1]} a ${arrayElement[2]}.</p>`
    }

    lineDiv.appendChild(textoInicial)

    return lineDiv
}

function addNewLine(optionID, startDate) {
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
    // const daysLeft = getDaysBetweenDates(startDate, maxEndDate);

    // Populate duration dropdown
    optionsArr.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = `${option} dias`;
        durationSelect.appendChild(optionElement);

        // if (option <= daysLeft) {
        //     const optionElement = document.createElement('option');
        //     optionElement.value = option;
        //     optionElement.textContent = `${option} dias`;
        //     durationSelect.appendChild(optionElement);
        // }
    });

    // if (daysLeft >= 15 && !optionsArr.includes(daysLeft)) {
    //     const customOption = document.createElement('option');
    //     customOption.value = daysLeft;
    //     customOption.textContent = `${daysLeft} dias`;
    //     durationSelect.appendChild(customOption);
    // }

    // Display calculated dates
    const datesDisplay = document.createElement('span');
    updateDatesDisplay(startDate, 15, datesDisplay); // Default to 15 days

    // Update dates dynamically
    durationSelect.addEventListener('change', () => {
        const selectedDuration = parseInt(durationSelect.value, 10);
        updateDatesDisplay(startDate, selectedDuration, datesDisplay);
    });

    lineDiv.appendChild(personSelect);
    lineDiv.appendChild(midText);
    lineDiv.appendChild(durationSelect);
    lineDiv.appendChild(datesDisplay);
    // lineDiv.appendChild(addButton);

    return lineDiv
}

// get already picked dates
function alreadyPickedDates(dataStorageStep) {
    const momLeave = dataStorageStep.momLeave
    const dadLeave = dataStorageStep.dadLeave

    // Combine and format
    const combinedLeave = [
        ...momLeave.map(([start, end]) => ["mom", start, end]),
        ...dadLeave.map(([start, end]) => ["dad", start, end]),
    ];
    
    // Sort by startDate
    combinedLeave.sort((a, b) => new Date(a[1]) - new Date(b[1]));
    
    console.log(combinedLeave);

    // return combinedLeave
}

// Update dates display
function updateDatesDisplay(startDate, duration, displayElement) {
    const start = new Date(startDate);
    const end = calculateEndDate(start, duration);
    displayElement.textContent = `: ${formatDate(start)} a ${formatDate(end)}`;
}