import { formatDate, getDaysBetweenDates, options, calculateEndDate } from '../components/reusable.js'

// Update dates display
function updateDatesDisplay(startDate, duration, displayElement) {
    const start = new Date(startDate);
    const end = calculateEndDate(start, duration);
    displayElement.textContent = `: ${formatDate(start)} a ${formatDate(end)}`;
}

// input 4 arrays of arrays
// output the last date that's in all the arrays
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

/**
 * Creates a dashboard-style div to display data and replaces the provided container with it.
 * @param {HTMLElement} containerDiv - The div to be replaced with the new dashboard div.
 * @param {Object} data - The data to display.
 * @param {number} data.totalLeave - Total initial leave days.
 * @param {number} data.daysLeft - Remaining leave days to be chosen.
 * @param {number} data.dadMin - Minimum leave days required for the father.
 * @param {number} data.dadLeaveNewTime - Leave days the father has already chosen.
 */
function createDashboard(containerDiv, data) {
    // Destructure the data object for easier access.
    const totalLeave = data.totalLeave;
    const daysLeft = data.daysLeft;
    const dadMin = data.dadMin;
    const dadLeaveNewTime = data.dadLeaveNewTime;

    // Create the dashboard container.
    const dashboardDiv = document.createElement('div');
    dashboardDiv.classList.add('dashboard');

    // Create individual data boxes.
    const totalLeaveBox = createDataBox('Licença inicial total', `${totalLeave} dias`);
    const daysLeftBox = createDataBox('Dias por escolher', `${daysLeft} dias`);
    const dadMinBox = createDataBox('Mínimo do pai', `${dadMin} dias`);

    // Conditionally formatted box for dad's leave time.
    const dadLeaveNewTimeBox = createDataBox(
        'Dias do pai já escolhidos',
        `${dadLeaveNewTime} dias`,
        dadLeaveNewTime >= dadMin ? 'green' : 'red'
    );

    // Append all data boxes to the dashboard.
    dashboardDiv.appendChild(totalLeaveBox);
    dashboardDiv.appendChild(daysLeftBox);
    dashboardDiv.appendChild(dadMinBox);
    dashboardDiv.appendChild(dadLeaveNewTimeBox);

    // Replace the existing container with the new dashboard.
    if (containerDiv && containerDiv.parentNode) {
        containerDiv.parentNode.replaceChild(dashboardDiv, containerDiv);
    }
}

/**
 * Helper function to create a styled data box.
 * @param {string} label - The label for the data box.
 * @param {string} value - The value to display in the data box.
 * @param {string} [textColor] - Optional text color for the value (e.g., "green" or "red").
 * @returns {HTMLElement} - The created data box element.
 */
function createDataBox(label, value, textColor) {
    // Create the container for the data box.
    const dataBox = document.createElement('div');
    dataBox.classList.add('data-box');

    // Create the label element.
    const labelElement = document.createElement('span');
    labelElement.classList.add('data-label');
    labelElement.textContent = label;

    // Create the value element.
    const valueElement = document.createElement('span');
    valueElement.classList.add('data-value');
    valueElement.textContent = value;

    // Apply conditional formatting if textColor is provided.
    if (textColor) {
        valueElement.style.color = textColor;
    }

    // Append the label and value to the data box.
    dataBox.appendChild(labelElement);
    dataBox.appendChild(valueElement);

    return dataBox;
}




export {updateDatesDisplay, getLatestLeaveDate, getTotalLeaveDays, alreadyPickedDates, createDashboard}