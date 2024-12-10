import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityItemComponent } from "../ActivityItemComponent/ActivityItemComponent.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class ItineraryActivityListComponent extends BaseComponent {
    /** 
     * @type {HTMLElement}
     */
    #container;
    #activityDB = null;
    #itineraryDB = null;
    #activities;
    #itinerary;
    #selectedDay = 1;

    constructor(activities, selectedDay) {
        super();
        this.loadCSS('ItineraryActivityListComponent');
        // this.#activities = activities;
        // this.#selectedDay = selectedDay;
        this.#activityDB = new ActivityDatabase('ActivityDB');
        this.#itineraryDB = new ActivityDatabase('ItineraryDB');
    }

    async render() {
        this.#createContainer();
        await this.#fetchItinerary();
        this.#createDropdown();
        this.#createListContainer();
        await this.#displayActivities(1);
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-activity-list');
        this.#container.id = 'itineraryActivityList';
    }

    // #setupContainerContent() {
    //     this.#container.innerHTML = `
    //         <div>
    //             <h2>Activity List</h2>
    //             <select id="tripDay" name="tripDay">
    //                 <option value="Day 1">Day 1</option>
    //                 <option value="Day 2">Day 2</option>
    //                 <option value="Day 3">Day 3</option>
    //             </select>
    //         </div>
    //         <ul id="itineraryActivityList"></ul>
    //     `
    // }

    #addActivityToList(activityData) {
        const activityList = this.#getActivityListElement();

        const activity = new ActivityItemComponent(activityData);
        activityList.appendChild(activity.render());
    }

    #getActivityListElement() {
        return this.#container.querySelector('#itineraryActivityList');
    }

    async #fetchActivities() {
        try {
           return await this.#activityDB.getAllActivity();
        } catch (error) {
            console.log('Failed to fetch activities from ActivityDB:', error);
        }
    }

    async #fetchItinerary() {
        try {
            this.#itinerary = await this.#itineraryDB.getActivity(window.location).id;
        } catch (error) {
            console.log('Failed to fetch activities from ActivityDB:', error);
        }
    }

    #calculateDays() {
        const startDateString = this.#itinerary.startDate;
        const endDateString = this.#itinerary.endDate;
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const differenceInMilliseconds = endDate - startDate;
        return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
    }

    #createDropdown() {
        const daySelector = document.createElement('select');
        daySelector.classList.add("day-selector");
        daySelector.id = "daySelector";
        const differenceInDays = this.#calculateDays();
        for (let i = 1; i <= differenceInDays; i++) {
            const option = document.createElement("option");
            option.value = i; // Value for the dropdown option
            option.textContent = `Day ${i}`; // Label for the dropdown option
            daySelector.appendChild(option);

        }
        daySelector.addEventListener("change", (event) => {
            const day = event.target.value;
            this.#displayActivities(day);
            EventHub.getInstance().publish(Events.ChangeDay, day);
        });
        this.#container.appendChild(daySelector);

    }

    #createListContainer() {
        const listContainer = document.createElement('div');
        listContainer.classList.add("activity-list-container");
        listContainer.id = "activityListContainer";
        this.#container.appendChild(listContainer);
    }

    async #displayActivities(day) {
        const ul = document.createElement('ul');
        const activities = await this.#getActivitiesToDisplay(day);
        if (day === 1) {
            const startDetails = document.createElement('li');
            startDetails.innerHTML = `<h2>Start trip from ${this.#itinerary.startLocation.address}</h2>`;
            ul.appendChild(startDetails);
        }
        // add in code to check if day is first or last and add starting and ending details accordingly
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = new ActivityItemComponent(activity);
            ul.appendChild(li);
        });
        if (day === this.#calculateDays()) {
            const endDetails = document.createElement('li');
            endDetails.innerHTML = `<h2>End trip at ${this.#itinerary.startLocation.address}</h2>`;
            ul.appendChild(endDetails);
        }
        if (ul.innerHTML === "") {
            ul.innerHTML = `<h2>No activities on this day.</h2>`;
        }
        const listContainer = this.#container.querySelector("#activityListContainer");
        listContainer.innerHTML = ul;
    }

    async #getActivitiesToDisplay(day) {
        const activities = await this.#fetchActivities();
        return activities.filter(activity => activity.day.includes(day));
    }


    // async #fetchAndDisplayActivities() {
    //     try {
    //       this.#activities = await this.#activityDB.getAllActivity();
    //       this.#itinerary = await this.#itineraryDB.getActivity(window.location).id;
    //       activities.forEach(activityData => {
    //         this.#activities = activities;
    //         const startDate = new Date(startDateString);
    //         const endDate = new Date(endDateString);

    //         const differenceInMilliseconds = endDate - startDate;
    //         const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
    //         this.#addActivityToList(activityData);

    //       });
    //     } catch (error) {
    //       console.log('Failed to fetch activities from ActivityDB:', error);
    //     }
    // }
}