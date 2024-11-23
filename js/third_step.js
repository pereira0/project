import { secondStep } from './second_step.js';
import { helpThirdStep } from '../components/help_text.js';
import { formatDate, getDaysBetweenDates, options, calculateEndDate, generateCalendar } from '../components/reusable.js'
import { updateDatesDisplay, getLatestLeaveDate, getTotalLeaveDays, alreadyPickedDates, createDashboard} from '../components/helper_fun_ts.js';

// Function to set up the form after selecting the baby's birth date
export function thirdStep(data_storage) {
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
            <div id='dashboard-container'></div>
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
        <p>O bebé nasceu ou vai nascer em ${formatDate(data_storage.babyBirthDate)}</p>
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

    // Example container to replace
    const newData = dataHandling(data_storage, duration, dadMin);
    const dashboardContainer = document.getElementById('dashboard-container');
    // Create and replace the dashboard
    createDashboard(dashboardContainer, newData);
}

// function to create and return the leave period line.
function addNewLine(data, infoDiv, containerDiv) {


    // DATA START
    // get necessary values
    const startDate = data.nextDate
    // construct options array
    const optionsArr = createOptionsArray(data)
    // const maxEndDate = data.maxDate
    // const daysLeftToPick = data.daysBetweenMaxDateLatestDate
    // const duration = data.duration
    // const dadMin = data.dadMin
    // const durationWithoutInitial = data.durationWithoutInitial



    // VISUAL ELEMENTS
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
    // Dropdown for duration
    const durationSelect = document.createElement('select');
    // Display calculated dates
    const datesDisplay = document.createElement('span');
    // Populate duration dropdown
    optionsArr.forEach((option) => {
        const optionElement = document.createElement('option'); // create element
        optionElement.value = option; // set it's value to the current option
        optionElement.textContent = `${option} dias`; // display text
        durationSelect.appendChild(optionElement); // append to element
    });

    // FUNCTIONALITY
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

    
    // BACK TO VISUALS
    // Append elements to the line
    newLine.appendChild(personSelect);
    newLine.appendChild(midText);
    newLine.appendChild(durationSelect);
    newLine.appendChild(datesDisplay);

    // Return the newly created line
    lineDiv.appendChild(newLine);
    containerDiv.appendChild(lineDiv);
}


function dataCleanupValidation(data_storage = null, duration = null, dadMin = null, dataCleaning = {}) {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000; // Milliseconds in one day

    // Initialize dataCleaning if it is empty and other required parameters are provided
    if (Object.keys(dataCleaning).length === 0 && data_storage && duration && dadMin) {
        const babyBirthDate = new Date(data_storage.babyBirthDate);
        const maxDate = calculateEndDate(babyBirthDate, duration)

        // Populate dataCleaning object
        dataCleaning = {
            babyBirthDate,
            duration,
            durationWithoutInitial: duration - 42,
            maxDate,
            momLeave: data_storage.secondStep.momLeave || [],
            dadLeave: data_storage.secondStep.dadLeave || [],
            momLeaveNew: data_storage.thirdStep.momLeave || [],
            dadLeaveNew: data_storage.thirdStep.dadLeave || [],
            dadMin,
        };
    }

    // Always calculate these fields
    const dadLeaveNewQt = getTotalLeaveDays(dataCleaning.dadLeaveNew); // Total dad leave in new section
    const latestDate = getLatestLeaveDate(dataCleaning.momLeave,dataCleaning.dadLeave,dataCleaning.momLeaveNew,dataCleaning.dadLeaveNew); // Latest leave date

    // Update calculated fields
    dataCleaning = {
        ...dataCleaning,
        dadLeaveNewQt,
        dadDaysRemainingForMin: Math.max(dataCleaning.dadMin - dadLeaveNewQt, 0),
        latestDate,
        nextDate: calculateEndDate(dataCleaning.latestDate, 1),
        daysBetweenMaxDateLatestDate: getDaysBetweenDates(latestDate, dataCleaning.maxDate),

        // two conditions to secure
        dadMinAchieved: dataCleaning.dadLeaveNewQt >= dataCleaning.dadMin,
        maxDateAchieved: dataCleaning.daysBetweenMaxDateLatestDate <= 1,
    };

    // Generate helper text
    dataCleaning.htmlDisplay = createHelperText(dataCleaning);

    return dataCleaning;
}


/// NEW VERSION OF THE DATA CLEANUP AND VALIDATION
function dataHandling(data_storage = null, duration = null, dadMin = null, dataCleaning = {}) {
    // Initialize dataCleaning if it is empty and other required parameters are provided
    if (Object.keys(dataCleaning).length === 0 && data_storage && duration && dadMin) {
        const babyBirthDate = new Date(data_storage.babyBirthDate);
        const maxDate = calculateEndDate(babyBirthDate, duration);
        // const lastDayLastLeave = getLatestLeaveDate(data_storage.secondStep.momLeave, data_storage.secondStep.dadLeave);

        // Populate dataCleaning object
        dataCleaning = {
            // THIS STAYS THE SAME
            babyBirthDate, 
            maxDate,
            momLastLeave: data_storage.secondStep.momLeave,
            dadLastLeave: data_storage.secondStep.dadLeave,
            totalLeave: duration, 
            // UPDATES OUTSIDE FUNCTION
            daysPicked: 0,
            person: '',
            // NEEDS UPDATING INSIDE FUNCTION
            momNewLeave: [],
            dadNewLeave: [], 
            dadLeaveNewTime: 0,
            daysLeft: duration - 42,
        };
    }  
    
    // update dates on new leave
    if (dataCleaning.personPicked === 'mom') {
        dataCleaning.momNewLeave.push([dataCleaning.firstDayNextLeave, calculateEndDate(dataCleaning.firstDayNextLeave, daysPicked)])
    } 
    else if(dataCleaning.personPicked === 'dad') {
        dataCleaning.dadNewLeave.push([dataCleaning.firstDayNextLeave, calculateEndDate(dataCleaning.firstDayNextLeave, daysPicked)])
    }

    // update rest of data
    dataCleaning = {
        ...dataCleaning,
        // ALWAYS UPDATES BASED ON DATA
        lastDaysPicked: dataCleaning.lastDaysPicked,
        dadLeaveNewTime: dataCleaning.dadLeaveNewTime + dataCleaning.daysPicked,
    
        // Step 1: Calculate lastDayLastLeave
        lastDayLastLeave: getLatestLeaveDate(
            dataCleaning.momLastLeave,
            dataCleaning.dadLastLeave,
            dataCleaning.momNewLeave,
            dataCleaning.dadNewLeave
        ),
    };
    
    // Step 2: Use lastDayLastLeave to calculate firstDayNextLeave
    dataCleaning = {
        ...dataCleaning,
        firstDayNextLeave: calculateEndDate(dataCleaning.lastDayLastLeave, 1),
        daysLeft: dataCleaning.daysLeft - dataCleaning.lastDaysPicked,
    };

    console.log(dataCleaning)
    return dataCleaning
}

// Helper to create helper text
function createHelperText(dataCleaning) {
    const textNode = document.createElement("div");
    textNode.innerHTML = `
        <p>Baby was born on ${formatDate(dataCleaning.babyBirthDate)} and the max date that can be picked is ${formatDate(dataCleaning.maxDate)}, which should be ${dataCleaning.duration} days after the birthday.</p>
        <p>Latest day of the leave is ${formatDate(dataCleaning.latestDate)} and they still have to decide on ${dataCleaning.daysBetweenMaxDateLatestDate} days of leave.</p>
        <p>Dad already took ${dataCleaning.dadLeaveNewQt} days, still has to take ${dataCleaning.dadDaysRemainingForMin} days.</p>
        <p>Dad condition is met? ${dataCleaning.dadMinAchieved}. Max date achieved? ${dataCleaning.maxDateAchieved}.</p>
    `;
    return textNode;
}

// helper function to create options array
function createOptionsArray(data) {
    const daysLeftToPick = data.daysLeftToPick;
    const durationWithoutInitial = data.durationWithoutInitial;
    const duration = data.duration;
    const dadMin = data.dadMin;

    // construct the options
    let optionsArr = []
    // if there are less than 30 days to pick, then there's only the option of picking the full amount of days left, because the person going after can't pick less than 15
    if (daysLeftToPick < 30) {
        optionsArr = ['', daysLeftToPick];
    } 
    // if this is the first time picking the leave, give the last option of the mom taking the first period all at once and the dad taking the second period all at once
    else if (daysLeftToPick === durationWithoutInitial) {
        optionsArr = ['', 15, 30, 60, 90, duration - dadMin - 42];
    } 
    else {
        optionsArr = ['', 15, 30, 60, 90, 120];
    }

    return optionsArr
}