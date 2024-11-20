// object for the data to be parsed back and forth
const data_storage = {
    babyBirthDate: null,
    firstStep: {
        momLeave: [], // Array of leave periods for mom
        dadLeave: []  // Array of leave periods for dad
    },
    secondStep: {
        momLeave: [],
        dadLeave: []
    },
    thirdStep: {
        momLeave: [],
        dadLeave: []
    },
    fourthStep: {
        momLeave: [],
        dadLeave: []
    }
};

// Utility function to format a date as "DD/MM/YYYY"
function formatDate(date) {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function getDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Include the start date by adding 1
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

// Function to generate and display the calendar
function generateCalendar(babyBirthDateIn, data_storage_step) {
    // get variables
    const babyBirthDate = babyBirthDateIn;
    const momsLeave = data_storage_step.momLeave;
    const dadsLeave = data_storage_step.dadLeave;

    const calendarDiv = document.createElement('div')
    calendarDiv.id = 'calendar'

    // const calendarDiv = document.getElementById('calendar');
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

    return calendarDiv
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

// options for initial leave
const options = [
    { id: 'option-1', title: 'Opção 1', total: '120 dias', description: 'tirados inteiramente pela mãe.', price: '100% RR' },
    { id: 'option-2', title: 'Opção 2', total: '150 dias', description: 'tirados inteiramente pela mãe.', price: '80% RR' },
    { id: 'option-3', title: 'Opção 3', total: '150 dias partilhados', description: '120 (ou menos) são tirados pela mãe e 30 (ou mais) são tirados pelo pai (para além do período incial).', price: '100% RR' },
    { id: 'option-4', title: 'Opção 4', total: '180 dias partilhados', description: '150 (ou menos) são tirados pela mãe e 30 (ou mais) são tirados pelo pai (para além do período incial).', price: '83% RR' },
    { id: 'option-5', title: 'Opção 5', total: '180 dias partilhados', description: '120 (ou menos) são tirados pela mãe e 60 (ou mais) são tirados pelo pai (para além do período incial).', price: '90% RR' }
];

// Export the classes so that they can be imported in other files like script.js
export { formatDate, getDaysBetweenDates, generateCalendar, data_storage, options };

