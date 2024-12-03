import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import Itinerary from "../../Models/Itinerary.js";
import { convertDateToUnixTimestamp, convertUnixToDateString } from "../../utils/TimeConversions.js";

export default class ItineraryHeaderComponent extends BaseComponent {
    #container = null;
    constructor() {
        super();
        this.loadCSS("ItineraryHeaderComponent");
        this.itinerary = Itinerary.getInstance();
    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-header-component');
        this.#container.id = 'itineraryHeader';
    }

    #createHeader() {
        // trip name
        const tripNameElement = document.createElement('h1');
        tripNameElement.textContent = this.itinerary.tripName;
        this.#container.appendChild(tripNameElement);

        // image
        if (this.itinerary.image instanceof Blob) {
            const imageElement = document.createElement('img');
            imageElement.src = this.itinerary.image;
            imageElement.alt = "Image";
            imageElement.classList.add('itinerary-image')
            this.#container.appendChild(imageElement);
        }

        // start and end dates
        const formattedStartDate = convertUnixToDateString(this.itinerary.startDate);
        const formattedEndDate = convertUnixToDateString(this.itinerary.endDate);

        const timeframeElement = document.createElement('h3');
        timeframeElement.textContent = `From ${formattedStartDate} to ${formattedEndDate}`;
        this.#container.appendChild(timeframeElement);

        // start and end locations
        const startLocation = this.itinerary.startLocation.address;
        const endLocation = this.itinerary.endLocation.address;

        const startLocationElement = document.createElement('h3');
        startLocationElement.textContent = `Starting at ${startLocation}`;
        this.#container.appendChild(startLocationElement);

        const endLocationElement = document.createElement('h3');
        endLocationElement.textContent = `Ending at ${endLocation}`;
        this.#container.appendChild(endLocationElement);

        // transportation
        const transportationElement = document.createElement('h3');
        transportationElement.textContent = `Transportation: ${this.itinerary.transportation}`;
        this.#container.appendChild(transportationElement);

        // description
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = this.itinerary.description;
        this.#container.appendChild(descriptionElement);
    }

    render() {
        this.#initContainer();
        this.#createHeader();
        return this.#container;
    }
}