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



export {updateDatesDisplay, getLatestLeaveDate, getTotalLeaveDays, alreadyPickedDates}