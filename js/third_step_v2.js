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
    // replace current div
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

// for the 150 and 180 ddays logic
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
        <p>A duração escolhida foi de <b>${duration} dias</b>, da qual o pai tem de tirar um mínimo de <b>${dadMin} dias</b> para além do que foi tirado nas primeiras 6 semanas. Estes períodos têm de ser no mínimo de 15 dias.</p>
    `

    // create array with the dates that have already been picked
    const alreadyPickedDatesArr = alreadyPickedDates(data_storage.secondStep)

    containerDiv.innerHTML += `<p>Primeiras 6 semanas:</p>`
    
    // populate the existing days of license
    for (let i = 0; i < alreadyPickedDatesArr.length; i++) {
        const element = alreadyPickedDatesArr[i]
        containerDiv.appendChild(addNewLineExisting(element));
      }

    containerDiv.innerHTML += `<p>O restante:</p>`

    containerDiv.appendChild(selectionLogic(data_storage, duration, dadMin))

    return containerDiv
}

// add a new line for the license already picked - will be used multiple times
function addNewLineExisting(arrayElement) {
    // clean dates
    let startDate = new Date(arrayElement[1])
    let endDate = new Date(arrayElement[2])
    startDate = formatDate(startDate)
    endDate = formatDate(endDate)

    // create span
    const lineDiv = document.createElement('span');
    lineDiv.classList.add('leave-period-line');

    // mom or dad?
    const constName = arrayElement[0] === 'mom' ? 'mãe' : 'pai';
    lineDiv.textContent = `A ${constName} vai ficar de licença de ${startDate} a ${endDate}.`

    return lineDiv
}

// get already picked dates
function alreadyPickedDates(dataStorageStep) {
    const momLeave = dataStorageStep.momLeave
    const dadLeave = dataStorageStep.dadLeave

    // Combine and format
    let combinedLeave = [
        ...momLeave.map(([start, end]) => ["mom", start, end]),
        ...dadLeave.map(([start, end]) => ["dad", start, end]),
    ];
    
    // Sort by startDate
    combinedLeave.sort((a, b) => new Date(a[1]) - new Date(b[1]));
    
    // Combine adjacent leaves for the same person if `endDate` and `startDate` differ by 1 day
    const mergedLeave = combinedLeave.reduce((result, current) => {
        if (result.length === 0) {
        result.push(current); // Start with the first item
        return result;
        }
    
        const last = result[result.length - 1];
        const lastEndDate = new Date(last[2]);
        const currentStartDate = new Date(current[1]);
    
        // Check if last and current leave can be merged
        if (
        last[0] === current[0] && // Same person (mom or dad)
        (lastEndDate.getTime() + 86400000 === currentStartDate.getTime()) // End date + 1 day === Start date
        ) {
        // Merge leaves by updating the end date of the last item
        last[2] = current[2];
        } else {
        // Otherwise, add the current item as a new entry
        result.push(current);
        }
    
        return result;
    }, []);
    return mergedLeave
}

// Update dates display
function updateDatesDisplay(startDate, duration, displayElement) {
    const start = new Date(startDate);
    const end = calculateEndDate(start, duration);
    displayElement.textContent = `: ${formatDate(start)} a ${formatDate(end)}`;
}



function getAllData () {

}

// /// NEW CODE STARTS HERE
// function selectionLogic(data_storage, duration, dadMin) {
//     // Step 1: Run data cleanup and validation to get the processed data.
//     let data = dataCleanupValidation(data_storage, duration, dadMin);

//     // Step 2: Create the line div.
//     const lineDiv = document.createElement('div');
    
//     // Ensure the content is valid HTML string or directly append DOM nodes.
//     if (data.htmlDisplay) {
//         lineDiv.innerHTML = data.htmlDisplay; // If htmlDisplay is a string of HTML, this works fine.
//     }

//     // Step 3: Create new lines (using addNewLine, ensure it returns DOM nodes).
//     const { newLine, updatedData } = addNewLine(data);
    
//     // Step 4: Append the new line to the lineDiv (newLine should be a DOM element).
//     lineDiv.appendChild(newLine);

//     // Step 5: Return the lineDiv (which contains the updated content).
//     return lineDiv;
// }


// // Main function to assemble the leave period line
// function addNewLine(data) {
//     const lineDiv = document.createElement('div');
//     lineDiv.classList.add('leave-period-line');

//     const textToDisplay = `<p>mom or dad will pick a leave from ${formatDate(data.nextDate)} to THIS_DATE. Still have ${data.daysBetweenMaxDateLatestDate} days to pick.</p>`

//     lineDiv.innerHTML = textToDisplay;

//     return {lineDiv, data};
// }

// Main function to handle the selection logic.
function selectionLogic(data_storage, duration, dadMin) {
    // Step 1: Run data cleanup and validation to get the processed data.
    let data = dataCleanupValidation(data_storage, duration, dadMin);

    // Step 2: Create the container div for the leave period line.
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('leave-period-line');

    // Step 3: Add HTML content to the lineDiv (only here, not in addNewLine)
    const textToDisplay = `mom or dad will pick a leave from ${formatDate(data.nextDate)} to THIS_DATE. Still have ${data.daysBetweenMaxDateLatestDate} days to pick.`;

    // Use text nodes to prevent the risk of XSS and improve performance
    const textNode = document.createElement('p');
    textNode.textContent = textToDisplay;
    lineDiv.appendChild(textNode);

    // Step 4: Create the new line content using the addNewLine function (if you need more complex lines).
    const { newLine, updatedData } = addNewLine(data);
    
    // Step 5: Append the newly created line to the `lineDiv` (newLine should not have text again).
    lineDiv.appendChild(newLine); // Ensure the newLine doesn't have text, it's just the layout.

    // Step 6: Return the completed `lineDiv` containing both the static text and dynamic line.
    return lineDiv;
}

// Helper function to create and return the leave period line.
function addNewLine(data) {
    const newLine = document.createElement('div');
    newLine.classList.add('leave-period-line');

    // Add only layout-related content or dynamic content here (no text content)
    const textToDisplay = `This is a new dynamic line for ${formatDate(data.nextDate)}.`;

    const textNode = document.createElement('p');
    textNode.textContent = textToDisplay; // Using textContent for plain text content.
    
    // Append the text content into the newLine div.
    newLine.appendChild(textNode);

    // Return the newly created line and updated data (if needed).
    return { newLine, updatedData: data };
}




function dataCleanupValidation(data_storage=null, duration = null, dadMin=null, dataCleaning={}) {
    console.log(dataCleaning)
    // initialize array if non is parsed
    if (Object.keys(dataCleaning).length === 0 && data_storage && duration && dadMin) {
        dataCleaning.babyBirthDate = new Date(data_storage.babyBirthDate);
        dataCleaning.duration = duration;
        dataCleaning.maxDate = new Date(dataCleaning.babyBirthDate.getTime() + duration * 24 * 60 * 60 * 1000);
        dataCleaning.momLeave = data_storage.secondStep.momLeave || [];
        dataCleaning.dadLeave = data_storage.secondStep.dadLeave || [];
        dataCleaning.momLeaveNew = data_storage.thirdStep.momLeave || [];
        dataCleaning.dadLeaveNew = data_storage.thirdStep.dadLeave || [];
        dataCleaning.dadLeaveNewQt = getTotalLeaveDays(dataCleaning.dadLeaveNew)
        dataCleaning.latestDate = getLatestLeaveDate(dataCleaning.momLeave, dataCleaning.dadLeave);
        dataCleaning.nextDate = new Date(dataCleaning.latestDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        dataCleaning.daysBetweenMaxDateLatestDate = (dataCleaning.maxDate - dataCleaning.latestDate) / (1000 * 3600 * 24) - 1;
    }

    // dad min achieved?
    dataCleaning.dadMinAchieved = dataCleaning.dadLeaveNewQt < dadMin ? false : true; 
    // max date achieved?
    dataCleaning.maxDateAchieved = dataCleaning.daysBetweenMaxDateLatestDate > 0 ? false : true;

    dataCleaning.htmlDisplay = `
        <p>Baby was born on ${formatDate(dataCleaning.babyBirthDate)} and the maxDate that can be picked is ${formatDate(dataCleaning.maxDate)}, which should be ${dataCleaning.duration} days after the birthday.</p>
        <p>Lastest day of the 6-week leave is ${formatDate(dataCleaning.latestDate)} and they still have to decide on ${dataCleaning.daysBetweenMaxDateLatestDate} days of leave.</p>
        <p>Dad already took ${dataCleaning.dadLeaveNewQt} days, still has to take ${dadMin - dataCleaning.dadLeaveNewQt} days.</p>
        <p>Dad condition is met? ${dataCleaning.dadMinAchieved}. Max date achieved? ${dataCleaning.maxDateAchieved}.</p>
    `;


    console.log(dataCleaning)
    
    return dataCleaning
}


function getLatestLeaveDate(momLeave, dadLeave) {
    // Combine momLeave and dadLeave
    const combinedLeaves = [...momLeave, ...dadLeave];

    // Extract only the end dates
    const endDates = combinedLeaves.map(leave => new Date(leave[1])); // Leave[1] is the endDate

    // Find the latest date
    const latestDate = endDates.reduce((latest, current) => {
        return current > latest ? current : latest;
    }, new Date(0)); // Use an early date as the initial value

    return latestDate;
}

// Function to calculate total number of days
function getTotalLeaveDays(leavePeriods) {
    let totalDays = 0;

    leavePeriods.forEach(period => {
        const startDate = new Date(period[0]);
        const endDate = new Date(period[1]);
        
        // Calculate the difference in days
        const diffTime = endDate - startDate; // Difference in milliseconds
        const diffDays = diffTime / (1000 * 3600 * 24); // Convert to days
        
        totalDays += diffDays;
    });

    return totalDays;
}
