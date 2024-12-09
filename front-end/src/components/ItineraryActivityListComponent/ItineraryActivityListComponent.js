import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityItemComponent } from "../ActivityItemComponent/ActivityItemComponent.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

export class ItineraryActivityListComponent extends BaseComponent {
    #container = null;
    #itineraryDB = null;

    constructor() {
        super();
        this.loadCSS('ItineraryActivityListComponent');
        this.#itineraryDB = new ActivityDatabase('ItineraryDB');
    }

    render() {
        this.#createContainer();
        this.#setupContainerContent();
        this.#fetchAndDisplayActivities();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-activity-list');
    }

    #setupContainerContent() {
        this.#container.innerHTML = `
            <div>
                <h2>Activity List</h2>
                <select id="tripDay" name="tripDay">
                    <option value="Day 1">Day 1</option>
                    <option value="Day 2">Day 2</option>
                    <option value="Day 3">Day 3</option>
                </select>
            </div>
            <ul id="itineraryActivityList"></ul>
        `
    }

    #addActivityToList(activityData) {
        const activityList = this.#getActivityListElement();

        const activity = new ActivityItemComponent(activityData);
        activityList.appendChild(activity.render());
    }

    #getActivityListElement() {
        return this.#container.querySelector('#itineraryActivityList');
    }

    async #fetchAndDisplayActivities() {
        try {
          const activities = await this.#itineraryDB.getAllActivity();
          activities.forEach(activityData => {
            this.#addActivityToList(activityData);
          });
        } catch (error) {
          console.log('Failed to fetch activities from ActivityDB:', error);
        }
    }
}
