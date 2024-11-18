class MomsLeave {
    constructor(babyBirthDate) {
        this.startDate = new Date(babyBirthDate);
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + 42); // Mom's leave is 42 days
    }

    // Check if a date is within Mom's leave period
    isInLeave(date) {
        return date >= this.startDate && date <= this.endDate;
    }

    getLeaveDetails() {
        return `Mom has 42 days of leave between ${this.formatDate(this.startDate)} and ${this.formatDate(this.endDate)}`;
    }

    getLeaveDates() {
        return {
            startDates: [this.startDate],
            endDates: [this.endDate]
        };
    }

    formatDate(date) {
        return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
}

class DadsLeave {
    constructor(babyBirthDate) {
        this.startDate = new Date(babyBirthDate);
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + 7); // Dad's leave is 7 days
        this.additionalLeaveStart = new Date(this.startDate);
        this.additionalLeaveStart.setDate(this.startDate.getDate() + 7); // Additional leave starts after Dad's 7 days
    }

    // Check if a date is within Dad's leave period
    isInLeave(date) {
        return date >= this.startDate && date <= this.endDate ||
               (date >= this.additionalLeaveStart && date <= new Date(this.additionalLeaveStart.setDate(this.additionalLeaveStart.getDate() + 7)));
    }

    getLeaveDetails() {
        return `Dad has 7 days of leave between ${this.formatDate(this.startDate)} and ${this.formatDate(this.endDate)}`;
    }

    getLeaveDates() {
        return {
            startDates: [this.startDate, this.additionalLeaveStart],
            endDates: [this.endDate, new Date(this.additionalLeaveStart.setDate(this.additionalLeaveStart.getDate() + 7))]
        };
    }

    formatDate(date) {
        return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
}

// Export the classes so that they can be imported in other files like script.js
export { MomsLeave, DadsLeave };
