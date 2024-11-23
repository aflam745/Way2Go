/**
 * Converts a UNIX timestamp to a string representation of a date.
 * @param {number} timestamp 
 * @returns {string} the date as a string
 */
export function convertUnixToDateString(timestamp) {
    const date = new Date(timestamp);

    const day = date.getUTCDate();
    const year = date.getUTCFullYear(); 

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getUTCMonth()];

    return `${month} ${day}, ${year}`;
}

/**
 * Converts a date to a UNIX timestamp.
 * @param {Date} date 
 * @returns {number} the date as a UNIX timestamp
 */
export function convertDateToUnixTimestamp(date) {
    return Math.floor(date.getTime() / 1000);
}