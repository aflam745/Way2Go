import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import ItineraryHeaderComponent from "../ItineraryHeaderComponent/ItineraryHeaderComponent.js";
import { MapComponent } from "../ItineraryMapComponent/ItineraryMapComponent.js";

export class ItineraryDetailsComponent extends BaseComponent {
    /** @type {HTMLDivElement | null} */
    #container = null;
    #dropdown = null;

    constructor(itinerary) {
        super();
        this.itinerary = itinerary;
        this.map = null;
        this.selectedDay = 1;
    }

    #filterByDay = () => Array.from(this.itinerary.activities.values()).filter(
        (activity) => activity.day.includes(this.selectedDay) // can straddle midnight
    );

    #loadMap() {
        const filteredActivities = this.#filterByDay();
        const polyline = null;

        let mapContainer = this.#container.querySelector('#mapContainer');
        if (!mapContainer) {
            mapContainer = document.createElement('div');
            mapContainer.id = 'mapContainer';
            this.#container.appendChild(mapContainer);
        } else {
            mapContainer.removeChild(this.#container.querySelector("#map"));
            if (this.map) this.map.removeSelf();
        }

        // Initialize the map
        if (!this.map) {
            this.map = new MapComponent(filteredActivities, polyline);
        } else {
            this.map.activities = filteredActivities;
            this.map.polyline = polyline;
        }

        mapContainer.appendChild(this.map.render());
    }


    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-page');
        this.#container.id = 'itineraryPage';
    }

    #createHeader() {
        const header = new ItineraryHeaderComponent();
        this.#container.append(header.render());
    }

    #createDropdown() {
        this.#dropdown = document.createElement('select');
        this.#dropdown.classList.add('day-dropdown');

        const days = [
            ...new Set(
                this.itinerary.activities.values()
                    .flatMap((activity) => {
                        return activity.day.flat()})
            )
        ].sort();
        days.forEach((day) => {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = `Day ${day}`;
            if (day === this.selectedDay) option.selected = true;
            this.#dropdown.appendChild(option);
        });

        this.#dropdown.addEventListener('change', (event) => {
            this.selectedDay = parseInt(event.target.value);
            this.renderNewDay();
        });

        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-container');
        dropdownContainer.appendChild(this.#dropdown);

        this.#container.appendChild(dropdownContainer);
    }

    #loadActivities() {
        const activitiesForDay = this.#filterByDay();

        // Ensure previous content is cleared
        const existingList = this.#container.querySelector('.activities-list');
        if (existingList) {
            existingList.remove();
        }

        const activitiesListContainer = document.createElement('div');
        activitiesListContainer.classList.add('activities-list');

        if (activitiesForDay.length === 0) {
            const noActivitiesMessage = document.createElement('p');
            noActivitiesMessage.textContent = 'No activities for this day.';
            activitiesListContainer.appendChild(noActivitiesMessage);
        } else {
            activitiesForDay.forEach((activity, index) => {
                const activityDiv = document.createElement('div');
                activityDiv.classList.add('activity-item');

                const activityNumber = document.createElement('span');
                activityNumber.classList.add('activity-number');
                activityNumber.textContent = `${index + 1}. `;

                const activityName = document.createElement('h3');
                activityName.classList.add('activity-name');
                activityName.textContent = activity.name;

                const activityDetails = document.createElement('div');
                activityDetails.innerHTML = `
                <p>Address: ${activity.location.address}</p>
                <p>Duration: ${activity.duration}</p>
                <p>Arrival time: ${activity.startTime}</p>
                <p>Departure time: ${activity.endTime}</p>
                <p>Description: ${activity.description}</p>
            `;

                activityDiv.appendChild(activityNumber);
                activityDiv.appendChild(activityName);
                activityDiv.appendChild(activityDetails);
                activitiesListContainer.appendChild(activityDiv);
            });
        }

        this.#container.appendChild(activitiesListContainer);
    }

    renderNewDay() {
        this.#loadMap();
        this.#loadActivities();
    }

    render() {
        if (!this.#container) {
            this.#createContainer();
            this.#createHeader();
            this.#createDropdown();
            document.body.appendChild(this.#container);
        }

        this.#loadMap();
        this.#loadActivities();
        return this.#container;
    }
}
