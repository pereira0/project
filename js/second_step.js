import { formatDate } from './reusable.js'

// Function to set up the form after selecting the baby's birth date
export function secondStep(babyBirthDate, momLeave, dadLeave) {
    const appDiv = document.getElementById('app');

    const formattedDate = formatDate(new Date(babyBirthDate));

    // Replace the landing page content with the form content
    appDiv.innerHTML = `
        <h1>Parte 2 de 3 - Segunda parte da licença inicial</h1>
        <div id="calendar"></div>
    `;

    generateCalendar(babyBirthDate, momLeave, dadLeave)

    // Display Mom's leave periods
    for (let i = 0; i < momLeave.length; i++) {
        appDiv.innerHTML += `<p>Licença da mãe: ${formatDate(momLeave[i][0])} a ${formatDate(momLeave[i][1])}.</p>`;
    }

    // Display Dad's leave periods (fixing the incorrect label)
    for (let i = 0; i < dadLeave.length; i++) {
        appDiv.innerHTML += `<p>Licença do pai: ${formatDate(dadLeave[i][0])} a ${formatDate(dadLeave[i][1])}.</p>`;
    }

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

            // Check if it'sbirthdate
            const isBirthDate = currentDate == babyBirthDate

            // Apply joint-leave if the day is in both Mom's and Dad's leave periods
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
    }
}

// Function to find the biggest (latest) date from both momLeave and dadLeave
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