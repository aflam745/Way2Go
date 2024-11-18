import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export default class DirectionsComponent extends BaseComponent {
    #container = null;

    constructor(itinerary, transportation) {
        super();
        this.itinerary = itinerary;
        this.transportation = transportation;
        this.loadCSS('DirectionsComponent');
    }

    render() { 
        this.#createContainer();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('directions');
        this.#getDirections();
    }

    /**
     * Retrieves and forms directions for the locations of the activities comprising the itinerary. Itinerary is already in the optimal order.
     */
    async #getDirections() {
        // ORS takes coords in lon, lat format

        // Update the below line to use itinerary.days
        const coordinatesList = this.itinerary.activities.map(activity => [activity.lon, activity.lat]);

        const transportation = this.transportation;

        const response = await fetch(`/directions`, {
            method: 'POST',
            body: JSON.stringify({coordinatesList, transportation})
        });

        const data = await response.json();

        this.#container.innerHTML = '';

        data.features[0].properties.segments.forEach((segment, i) => {
            const label = document.createElement('h3');
            label.innerText = "Directions to " + this.itinerary.activities[i].name;
            this.#container.appendChild(label);
            const ol = document.createElement('ol');
            segment.steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step.instruction;
                ol.appendChild(li);

            });
            this.#container.appendChild(ol);
        });

    }
}