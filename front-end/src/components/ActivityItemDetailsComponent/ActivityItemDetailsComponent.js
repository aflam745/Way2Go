import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ActivityItemDetailsComponent extends BaseComponent {
    #container = null;

    constructor(activityData = {}){
        super();
        this.loadCSS('ActivityItemDetailsComponent');
        this.activityData = activityData;
    }

    render() {
        this.#createContainer();
        this.#displayData();
        return this.#container;
    }

    #createContainer(){
        this.#container = document.createElement('div');
        this.#container.id = 'activityItemDetails';
        this.#container.innerHTML = this.#getTemplate();
    }

    #getTemplate(){
        return `
            <h4>Additional details:</h4>
            <div class="activity-item-data">
                <strong>Specific Day:</strong> <span id="displaySpecificDay"></span>
            </div>
            <div class="activity-item-data">
                <strong>Day:</strong> <span id="displayDay"></span>
            </div>
            <div class="activity-item-data">
                <strong>Address:</strong> <span id="displayAddress"></span>
            </div>
            <div class="activity-item-data">
                <strong>Duration:</strong> <span id="displayDuration"></span>
            </div>
            <div class="activity-item-data">
                <strong>Opens at:</strong> <span id="displayOpenTime"></span>
            </div>
            <div class="activity-item-data">
                <strong>Closes at:</strong> <span id="displayCloseTime"></span>
            </div>
            <div class="activity-item-data">
                <strong>Notes:</strong> <span id="displayNotes"></span>
            </div>
        `
    }

    #displayData(){
        this.#container.querySelector('#displaySpecificDay').textContent = this.activityData.specificDay;
        this.#container.querySelector('#displayDay').textContent = this.activityData.day;
        this.#container.querySelector('#displayAddress').textContent = this.activityData.address;
        this.#container.querySelector('#displayDuration').textContent = this.activityData.duration;
        this.#container.querySelector('#displayOpenTime').textContent = this.activityData.openTime;
        this.#container.querySelector('#displayCloseTime').textContent = this.activityData.closeTime;
        this.#container.querySelector('#displayNotes').textContent = this.activityData.notes;
    }
}
