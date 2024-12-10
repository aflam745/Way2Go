import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ActivityItemDetailsComponent extends BaseComponent {
    #container = null;

    constructor(activityData = {}) {
        super();
        this.loadCSS('ActivityItemDetailsComponent');
        this.activityData = activityData;
    }

    render() {
        this.#createContainer();
        this.#displayData();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('activity-details-section');
        this.#container.id = 'activityItemDetails';
        this.#container.innerHTML = this.#getTemplate();
    }

    #getTemplate() {
        return `
        <h4>Additional details:</h4>
        <div class="activity-item-data">
            <strong>Address:</strong> <span id="displayAddress"></span>
        </div>
        <div class="activity-item-data">
            <strong>Activity type:</strong> <span id="displayActivityType"></span>
        </div>
        <div class="activity-item-data">
            <strong>Duration:</strong> <span id="displayDuration"></span>
        </div>
        <div class="activity-item-data">
            <strong>Scheduling range:</strong> <span id="displayInterval"></span>
        </div>
        <div class="activity-item-data">
            <strong>Notes:</strong> <span id="displayNotes"></span>
        </div>
    `;
    }


    #formatTimeframe(start, end) {
        // format of the date
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        console.log(start);
        console.log(end);

        if (!start || !end) {
            return "No specified date range.";
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        return startDate.toLocaleString('en-US', options) + " to " + endDate.toLocaleString('en-US', options);
    }

    #formatTime(hours, minutes) {
        let hoursString = "";
        let minutesString = "";
        console.log(hours);
        console.log(minutes);
        if (hours > 0) {
            hoursString = hours + "h";
        }
        if (minutes > 0) {
            minutesString = minutes + "m";
        }
        let formattedString = "";
        if (hoursString && minutesString) {
            formattedString = hoursString + " " + minutesString;
        } else if (hoursString) {
            formattedString = hoursString;
        } else if (minutesString) {
            formattedString = minutesString;
        }
        console.log(formattedString);
        console.log(formattedString || "N/A");
        return formattedString;
    }

    #displayData() {
        this.#container.querySelector('#displayInterval').textContent = this.#formatTimeframe(this.activityData.earliestStartTime, this.activityData.latestEndTime) || "N/A";
        this.#container.querySelector('#displayDuration').textContent = this.#formatTime(this.activityData.durationHours, this.activityData.durationMinutes) || "N/A";
        this.#container.querySelector('#displayAddress').textContent = this.activityData.address || "N/A";
        this.#container.querySelector('#displayNotes').textContent = this.activityData.notes || "N/A";
        this.#container.querySelector('#displayActivityType').textContent = this.activityData.activityType || "N/A";
    }
}
