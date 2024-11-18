// Import the leave classes from leave.js
import { MomsLeave, DadsLeave } from './leave.js';

// Function to update the display based on the leave logic
function updateLeaveDisplay() {
    const startDateInput = document.getElementById('baby-birth-date').value;

    if (!startDateInput) {
        alert("Please select a baby's birth date.");
        return;
    }

    // Create instances of MomsLeave and DadsLeave based on the selected birth date
    const momsLeave = new MomsLeave(startDateInput);
    const dadsLeave = new DadsLeave(startDateInput);

    // Get leave details and dates
    const momDetails = momsLeave.getLeaveDetails();
    const dadDetails = dadsLeave.getLeaveDetails();

    // Get start and end dates for each period of leave for Mom and Dad
    const momLeaveDates = momsLeave.getLeaveDates();
    const dadLeaveDates = dadsLeave.getLeaveDates();

    // Logging to console for debugging
    console.log('Mom Leave Details:', momDetails);
    console.log('Dad Leave Details:', dadDetails);
    console.log('Mom Start Dates:', momLeaveDates.startDates);
    console.log('Mom End Dates:', momLeaveDates.endDates);
    console.log('Dad Start Dates:', dadLeaveDates.startDates);
    console.log('Dad End Dates:', dadLeaveDates.endDates);

    // Update the leave display text
    document.getElementById('moms-leave-details').textContent = momDetails;
    document.getElementById('dads-leave-details').textContent = dadDetails;

    document.getElementById('moms-start-dates').textContent = `Mom's start dates: ${momLeaveDates.startDates.map(date => formatDate(date)).join(', ')}`;
    document.getElementById('moms-end-dates').textContent = `Mom's end dates: ${momLeaveDates.endDates.map(date => formatDate(date)).join(', ')}`;

    document.getElementById('dads-start-dates').textContent = `Dad's start dates: ${dadLeaveDates.startDates.map(date => formatDate(date)).join(', ')}`;
    document.getElementById('dads-end-dates').textContent = `Dad's end dates: ${dadLeaveDates.endDates.map(date => formatDate(date)).join(', ')}`;

    // Generate and display the calendar with leave information
    generateCalendar(momsLeave, dadsLeave);
}

// Utility function to format date into a readable format (e.g., "Jan 1, 2024")
function formatDate(date) {
    return date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function generateCalendar(momsLeave, dadsLeave) {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';  // Clear the calendar before regenerating it

    // Get the start and end dates for the calendar range (we will display a full 2 years)
    const startDate = new Date(momsLeave.startDate);
    const endDate = new Date(momsLeave.startDate);
    endDate.setFullYear(startDate.getFullYear() + 2);  // 2 years range

    const currentDate = new Date(startDate);
    
    const months = [];
    while (currentDate < endDate) {
        const month = currentDate.getMonth();
        if (!months.includes(month)) {
            months.push(month);
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Loop through each month and render it in the calendar
    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');
        
        // Reset currentDate to the first day of the current month
        const firstDayOfMonth = new Date(startDate.getFullYear(), month, 1);
        
        // Format the month and year in Portuguese
        const monthName = firstDayOfMonth.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });

        // Create month header
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = monthName;
        monthDiv.appendChild(monthHeader);

        // Create days grid (weeks)
        const daysGrid = document.createElement('div');
        daysGrid.classList.add('days-grid');

        let dayOfMonth = 1;
        const firstDayOfMonthDate = new Date(firstDayOfMonth.getFullYear(), month, 1);
        const lastDayOfMonth = new Date(firstDayOfMonth.getFullYear(), month + 1, 0);

        // Add empty spaces for the first week
        for (let i = 0; i < firstDayOfMonthDate.getDay(); i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('empty-day');
            daysGrid.appendChild(dayDiv);
        }

        // Add the actual days in the month
        for (let i = 0; dayOfMonth <= lastDayOfMonth.getDate(); i++) {
            const dayDiv = document.createElement('div');
            const currentDay = new Date(firstDayOfMonth.getFullYear(), month, dayOfMonth);

            // Check if the current day is in the leave period for Mom or Dad
            if (momsLeave.isInLeave(currentDay)) {
                dayDiv.classList.add('mom-leave');
            }
            if (dadsLeave.isInLeave(currentDay)) {
                dayDiv.classList.add('dad-leave');
            }

            // Display the day number
            dayDiv.textContent = dayOfMonth;
            daysGrid.appendChild(dayDiv);
            dayOfMonth++;
        }

        monthDiv.appendChild(daysGrid);
        calendarDiv.appendChild(monthDiv);

        // Move to the next month
        startDate.setMonth(startDate.getMonth() + 1);
    });
}



function loadCSS(filename) {
    // Create a <link> element
    const link = document.createElement('link');
    
    // Set the attributes for the <link> element
    link.rel = 'stylesheet';  // Specifies the relationship between the current document and the linked document
    link.type = 'text/css';   // Specifies the type of the linked document
    link.href = filename;     // The path to your styles.css file
    
    // Append the <link> element to the <head> of the document
    document.head.appendChild(link);
}

// Event listener for the baby birth date input
document.getElementById('baby-birth-date').addEventListener('change', updateLeaveDisplay);

// Use DOMContentLoaded to ensure the page is fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {
    loadCSS('styles.css');
    updateLeaveDisplay(); // Populate the leave details on page load if the birth date is set
});
