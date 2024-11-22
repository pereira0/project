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
    appDiv.innerHTML = `
        <div id='content-general'>
            <div id='top-content'></div>
            <div id='content'></div>
            <div id='bottom-content'></div>
        </div>
    `;

    // populate appDiv
    const topContentDiv = document.getElementById('top-content')
    const contentDiv = document.getElementById('content')
    choicesCreation(contentDiv, topContentDiv, data_storage);

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
function choicesCreation(contentDiv, topContentDiv, data_storage) {
    // change title
    topContentDiv.innerHTML = `<h2>O resto da licença inicial</h2>`

    // create the options selection
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
    contentDiv.appendChild(optionsSection);

    // add functionality to the option buttons
    options.forEach(option => {
        document.getElementById(option.id).addEventListener('click', () => {
            populateCalendarAndData(contentDiv, option.id, data_storage, topContentDiv)
        });
    });
}

// logic for after an option is selected
function populateCalendarAndData(containerDiv, optionID, data_storage, topContentDiv) {
    // replace current div
    topContentDiv.innerHTML = `<h2>Selecionado</h2>`

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
        datePickerContainer(containerDiv, optionID, data_storage, topContentDiv)
    }
}

// for the 150 and 180 ddays logic
function datePickerContainer(containerDiv, optionID, data_storage, topContentDiv) {
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

    // restart the current div or replace with empty
    topContentDiv.innerHTML = `
        <h2>É preciso escolher como vai acontecer o resto da licença</h2>
        <p>A duração escolhida foi de <b>${duration} dias</b>, da qual o pai tem de tirar um mínimo de <b>${dadMin} dias</b> para além do que foi tirado nas primeiras 6 semanas. Estes períodos têm de ser no mínimo de 15 dias.</p>
    `

    // create array with the dates that have already been picked
    const alreadyPickedDatesArr = alreadyPickedDates(data_storage.secondStep)

    containerDiv.innerHTML = `<p>Primeiras 6 semanas:</p>`
    
    // populate the existing days of license
    for (let i = 0; i < alreadyPickedDatesArr.length; i++) {
        const element = alreadyPickedDatesArr[i]
        containerDiv.appendChild(addNewLineExisting(element));
      }

    containerDiv.innerHTML += `<p>O restante:</p>`

    selectionLogic(data_storage, duration, dadMin, containerDiv)

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

// Main function to handle the selection logic.
function selectionLogic(data_storage, duration, dadMin, containerDiv) {
    // Run data cleanup and validation to get the processed data.
    let data = dataCleanupValidation(data_storage, duration, dadMin);

    // Create the container div for the leave period line.
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('leave-period-line');

    // HELPER INFORMATION
    const infoDiv = document.getElementById('bottom-content');
    infoDiv.appendChild(data.htmlDisplay); 

    // Create the new line content using the addNewLine function (if you need more complex lines).
    addNewLine(data, infoDiv, containerDiv);

    // lineDiv.appendChild(newLine);
    
    // Return the completed `lineDiv` containing both the static text and dynamic line.
    containerDiv.appendChild(infoDiv);
}

// Helper function to create and return the leave period line.
function addNewLine(data, infoDiv, containerDiv) {
    // get necessary values
    const startDate = data.nextDate
    const maxEndDate = data.maxDate
    const daysLeftToPick = data.daysBetweenMaxDateLatestDate
    const duration = data.duration
    const dadMin = data.dadMin

    // create lineDiv
    const lineDiv = document.createElement('div')

    // initialize newLine div
    const newLine = document.createElement('div');
    newLine.classList.add('leave-period-line');

    // Dropdown for Mom/Dad
    const personSelect = document.createElement('select');
    personSelect.innerHTML = `
        <option value="mom">A mãe</option>
        <option value="dad">O pai</option>
    `;

    // Text between dropdowns
    const midText = document.createElement('span');
    midText.textContent = 'vai ficar de licença durante';

    // construct the options
    let optionsArr = []
    // if there are less than 30 days to pick, then there's only the option of picking the full amount of days left, because the person going after can't pick less than 15
    if (daysLeftToPick < 30) {
        optionsArr = ['', daysLeftToPick];
    } 
    // if this is the first time picking the leave, give the last option of the mom taking the first period all at once and the dad taking the second period all at once
    else if (daysLeftToPick === duration) {
        optionsArr = ['', 15, 30, 60, 90, duration - dadMin - 42];
    } 
    else {
        optionsArr = ['', 15, 30, 60, 90, 120];
    }
    

    // Dropdown for duration
    const durationSelect = document.createElement('select');
    
    const daysLeft = getDaysBetweenDates(startDate, maxEndDate);

    // Populate duration dropdown
    optionsArr.forEach((option) => {
        if (option <= daysLeft) {
            const optionElement = document.createElement('option'); // create element
            optionElement.value = option; // set it's value to the current option
            optionElement.textContent = `${option} dias`; // display text
            durationSelect.appendChild(optionElement); // append to element
        }
    });

    // Display calculated dates
    const datesDisplay = document.createElement('span');

    // Update dates dynamically
    durationSelect.addEventListener('change', () => {
        const selectedDuration = parseInt(durationSelect.value, 10);
        updateDatesDisplay(startDate, selectedDuration, datesDisplay);
        const end = calculateEndDate(startDate, selectedDuration);
        // update the data on leave for mom or dad
        personSelect.value === 'mom' ? data.momLeaveNew.push([startDate, end]) : data.dadLeaveNew.push([startDate, end]);

        // update data
        data = dataCleanupValidation(undefined, undefined, undefined, data);

        // update the info helper text
        infoDiv.innerHTML = ``;
        infoDiv.appendChild(data.htmlDisplay);
        // disable the dropdowns for the current display
        durationSelect.disabled = true;
        personSelect.disabled = true;

        // if dad min is not achieved and last date is not reached -> create new line with the updated information
        if (data.dadMinAchieved === false && data.maxDateAchieved === false) {
            addNewLine(data, infoDiv, lineDiv)
        }
        // if last date is achieved but dad doesn't have his min -> error, will have to restart
        else if (data.dadMinAchieved === false && data.maxDateAchieved === true) {

        }
        // if both conditions are true -> generate calendar and move on
        else if (data.dadMinAchieved === true && data.maxDateAchieved === true) {
            
        } 
    });

    // Append elements to the line
    newLine.appendChild(personSelect);
    newLine.appendChild(midText);
    newLine.appendChild(durationSelect);
    newLine.appendChild(datesDisplay);

    // Return the newly created line and updated data (if needed).
    lineDiv.appendChild(newLine);
    containerDiv.appendChild(lineDiv);
}


// Update dates display
function updateDatesDisplay(startDate, duration, displayElement) {
    const start = new Date(startDate);
    const end = calculateEndDate(start, duration);
    displayElement.textContent = `: ${formatDate(start)} a ${formatDate(end)}`;
}

function dataCleanupValidation(data_storage=null, duration = null, dadMin=null, dataCleaning={}) {
    console.log(dataCleaning)
    // initialize array if non is parsed
    if (Object.keys(dataCleaning).length === 0 && data_storage && duration && dadMin) {
        dataCleaning.babyBirthDate = new Date(data_storage.babyBirthDate);
        dataCleaning.duration = duration; // total duration of leave
        dataCleaning.maxDate = new Date(dataCleaning.babyBirthDate.getTime() + duration * 24 * 60 * 60 * 1000); // last date of license based on duration
        dataCleaning.momLeave = data_storage.secondStep.momLeave || []; // existing mom leave from last step
        dataCleaning.dadLeave = data_storage.secondStep.dadLeave || []; // existing dad leave from last step
        dataCleaning.momLeaveNew = data_storage.thirdStep.momLeave || []; // new mom leave to populate next step
        dataCleaning.dadLeaveNew = data_storage.thirdStep.dadLeave || []; // new dad leave to populate next step
        dataCleaning.dadMin = dadMin;

        // calculated fields
        dataCleaning.dadLeaveNewQt = getTotalLeaveDays(dataCleaning.dadLeaveNew); // quantity of days of leave dad has in this new section
        dataCleaning.dadDaysRemainingForMin = dataCleaning.dadMin - dataCleaning.dadLeaveNewQt; // days remaining until finish the min
        dataCleaning.latestDate = getLatestLeaveDate(dataCleaning.momLeave, dataCleaning.dadLeave, dataCleaning.momLeaveNew, dataCleaning.dadLeaveNew); // last day of leave of either mom or dad
        dataCleaning.nextDate = new Date(dataCleaning.latestDate.getTime() + 1 * 24 * 60 * 60 * 1000); // start date of next period of leave
        dataCleaning.daysBetweenMaxDateLatestDate = (dataCleaning.maxDate - dataCleaning.latestDate) / (1000 * 3600 * 24) - 1; // days left to decide on 
    }

    // update if already got into
    else {
        dataCleaning.dadLeaveNewQt = getTotalLeaveDays(dataCleaning.dadLeaveNew) // quantity of days of leave dad has in this new section
        dataCleaning.latestDate = getLatestLeaveDate(dataCleaning.momLeave, dataCleaning.dadLeave, dataCleaning.momLeaveNew, dataCleaning.dadLeaveNew); // last day of leave of either mom or dad
        if (dataCleaning.dadDaysRemainingForMin > 0) {
            dataCleaning.dadDaysRemainingForMin = dataCleaning.dadMin - dataCleaning.dadLeaveNewQt

        }
        dataCleaning.nextDate = new Date(dataCleaning.latestDate.getTime() + 1 * 24 * 60 * 60 * 1000); // start date of next period of leave
        dataCleaning.daysBetweenMaxDateLatestDate = (dataCleaning.maxDate - dataCleaning.latestDate) / (1000 * 3600 * 24) - 1; // days left to decide on 
    }

    // dad min achieved?
    dataCleaning.dadMinAchieved = dataCleaning.dadDaysRemainingForMin > 0 ? false : true; 
    // max date achieved?
    dataCleaning.maxDateAchieved = dataCleaning.daysBetweenMaxDateLatestDate > 0 ? false : true;

    // helper text
    const textNode = document.createElement('div');
    textNode.innerHTML = `
        <p>Baby was born on ${formatDate(dataCleaning.babyBirthDate)} and the maxDate that can be picked is ${formatDate(dataCleaning.maxDate)}, which should be ${dataCleaning.duration} days after the birthday.</p>
        <p>Lastest day of the leave is ${formatDate(dataCleaning.latestDate)} and they still have to decide on ${dataCleaning.daysBetweenMaxDateLatestDate} days of leave.</p>
        <p>Dad already took ${dataCleaning.dadLeaveNewQt} days, still has to take ${dataCleaning.dadDaysRemainingForMin} days.</p>
        <p>Dad condition is met? ${dataCleaning.dadMinAchieved}. Max date achieved? ${dataCleaning.maxDateAchieved}.</p>
    `;
    dataCleaning.htmlDisplay = textNode;

    console.log(dataCleaning);
    
    return dataCleaning;
}


function getLatestLeaveDate(momLeave, dadLeave, momLeaveNew, dadLeaveNew) {
    // Combine momLeave and dadLeave
    const combinedLeaves = [...momLeave, ...dadLeave, ...momLeaveNew, ...dadLeaveNew];

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
