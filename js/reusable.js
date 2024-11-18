// Utility function to format a date as "DD/MM/YYYY"
function formatDate(date) {
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

// Export the classes so that they can be imported in other files like script.js
export { formatDate };