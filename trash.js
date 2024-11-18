// Function to generate and display the calendar
function generateCalendar(momsLeave, dadsLeave) {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = ''; // Clear any previous calendar

    // Set the start and end dates for the calendar
    const startDate = new Date(momsLeave.startDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1); // Display up to 1 year

    let currentDate = new Date(startDate);

    // Loop through each month
    while (currentDate <= endDate) {
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');

        const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
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

            // Highlight days in Mom's or Dad's leave periods
            if (momsLeave.isInLeave(currentDay)) dayDiv.classList.add('mom-leave');
            if (dadsLeave.isInLeave(currentDay)) dayDiv.classList.add('dad-leave');

            daysGrid.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysGrid);
        calendarDiv.appendChild(monthDiv);

        // Move to the next month
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}