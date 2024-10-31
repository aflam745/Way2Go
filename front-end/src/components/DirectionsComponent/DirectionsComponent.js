import { BaseComponent } from "../BaseComponent/BaseComponent";
require('dotenv').config();

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

    async #getDirections() {
        const req =
        {
            "jobs": [],
            "shipments": [],
            "vehicles": [],
            "options": {
                "g": true
            }
        }

        req.vehicles.push({
            "id": 1,
            "profile": this.itinerary.transportation,
            "start": [this.itinerary.start.lon, this.itinerary.start.lat], // ORS takes coords in lon, lat format
            "end": [this.itinerary.end.lon, this.itinerary.end.lat],
        });

        this.itinerary.activities.forEach((a, i) => {
            req.jobs.push({
                "id": i + 1,
                "location": [a.lon, a.lat] 
            });
        });

        const response = await fetch(`https://api.openrouteservice.org/v2/directions/${mode}/geojson`, {
            method: 'POST',
            headers: {
                'Authorization': process.env.ORS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req)
        });

        const data = await response.json();

        this.#container.innerHTML = '';

        data.features[0].properties.segments.forEach((segment, i) => {
            const label = document.createElement('h3');
            label.innerText = "Directions to stop " + (i + 1);
            this.#container.appendChild(label);
            const ol = document.createElement('ol');
            segment.steps.forEach(step => {
                console.log(step.instruction);
                const li = document.createElement('li');
                li.textContent = step.instruction;
                ol.appendChild(li);

            });
            this.#container.appendChild(ol);
        });

    }
}