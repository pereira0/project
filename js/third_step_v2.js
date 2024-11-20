import { formatDate, getDaysBetweenDates, options } from '../components/reusable.js'
import { generateCalendar } from '../components/reusable.js';
import { helpThirdStep } from '../components/help_text.js';
import { secondStep } from './second_step.js';

// Function to set up the form after selecting the baby's birth date
export function thirdStepSecond(data_storage) {
     // get return button
    const returnButton = document.getElementById('return-btn')

    // populate help button for this page
    const helpContent = document.getElementById('help-content-sp');
    helpContent.innerHTML = helpThirdStep;

    // get app div
    const appDiv = document.getElementById('app');

    // start content
    appDiv.innerHTML = `<div id='content'></div>`;
    // populate appDiv
    choicesCreation('content', data_storage);

}


function choicesCreation(divName, data_storage) {
    const containerDiv = document.getElementById(divName)
    containerDiv.innerHTML = `<h2>O resto da licença inicial</h2>`

    const optionsSection = document.createElement('div');
    optionsSection.classList.add('second-step-options-container'); 

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
            // FOR EACH BUTTON
            // remove the current div or replace with empty
            containerDiv.innerHTML = ``

            // check which button was clicked and generate logic to populate mom and dad leave arrays into the THIRD STEP of data_storage

            // show the calendar
            // THIS NEEDS TO CHANGE TO THIRD STEP
            const calendarLoc = generateCalendar(data_storage.babyBirthDate, data_storage.secondStep)
            containerDiv.appendChild(calendarLoc)

        });

    });
}