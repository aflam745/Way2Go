import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { MapComponent } from "../MapComponent/MapComponent.js";

export class ItineraryComponent extends BaseComponent {
    /** @type {HTMLDivElement | null} */
    #container = null;
    #dropdown = null;

    constructor(itinerary) {
        super();
        this.itinerary = itinerary;
        this.map = null;
        this.selectedDay = 1;
    }

    #filterByDay = () => this.itinerary.activities.values().filter(
        (activity) => activity.day.includes(this.selectedDay) // can straddle midnight
    );

    #loadMap() {
        console.log("Hello")
        const filteredActivities = this.#filterByDay();
        const polyline = null;

        // Remove existing map container and map instance
        const mapContainer = this.#container.querySelector('#mapContainer');
        console.log(mapContainer);
        if (mapContainer) {
            mapContainer.removeChild(this.#container.querySelector("#map"));
            if (this.map) {
                this.map.removeSelf();
                this.map = null;
            }
        }

        // Create a new map container
        const newMapContainer = document.createElement('div');
        newMapContainer.id = 'mapContainer';
        this.#container.appendChild(newMapContainer); // Append to DOM first

        // Initialize the map
        if (!this.map) {
            this.map = new MapComponent(filteredActivities, polyline);
        } else {
            this.map.activities = filteredActivities;
            this.map.polyline = polyline;
        }

        // Render the map only after it's in the DOM
        newMapContainer.appendChild(this.map.render());
    }


    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-page');
        this.#container.id = 'itineraryPage';
    }

    #createHeader() {
        const header = document.createElement('h1');
        header.textContent = this.itinerary.tripName;
        this.#container.prepend(header);
    }

    #createDropdown() {
        this.#dropdown = document.createElement('select');
        this.#dropdown.classList.add('day-dropdown');

        const days = [
            ...new Set(
                // Flatten the array of days for each activity
                this.itinerary.activities.values()
                    .flatMap((activity) => {
                        return activity.day.flat()})  // Flattening each activity's 'day' array
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
            this.render();
        });

        const dropdownContainer = document.createElement('div');
        dropdownContainer.classList.add('dropdown-container');
        dropdownContainer.appendChild(this.#dropdown);

        this.#container.appendChild(dropdownContainer);
    }

    #createDisplay() {
        const activitiesForDay = this.#filterByDay();

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
                `
                
                activityDiv.appendChild(activityNumber);
                activityDiv.appendChild(activityName);
                activityDiv.appendChild(activityDetails);
    
                activitiesListContainer.appendChild(activityDiv);
            });
        }

        this.#container.appendChild(activitiesListContainer);
    }

    render() {
        console.log("hereeee")
        this.#createContainer();
        this.#createHeader();
        this.#loadMap();
        this.#createDropdown();
        this.#createDisplay();
        return this.#container;
    }
}
