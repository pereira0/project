// Utility function to format a date as "DD/MM/YYYY"
function formatDate(date) {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function getDaysBetweenDates(startDate, endDate) {
    // Convert the start and end dates to Date objects (in case they aren't already)
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in time between the two dates in milliseconds
    const timeDifference = end - start;

    // Convert the time difference from milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
}

// Export the classes so that they can be imported in other files like script.js
export { formatDate, getDaysBetweenDates };