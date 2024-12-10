import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import Itinerary from "../../Models/Itinerary.js";
import { convertDateToUnixTimestamp, convertUnixToDateString } from "../../utils/TimeConversions.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";
import { getQueryParams } from "../../lib/router.js";

export default class ItineraryHeaderComponent extends BaseComponent {
    #container = null;
    #itineraryDB = null;
    #itinerary = null;
    constructor() {
        super();
        this.loadCSS("ItineraryHeaderComponent");
        this.#itineraryDB = new ActivityDatabase('ItineraryDB');
    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-header-component');
        this.#container.id = 'itineraryHeader';
    }

    #createHeader() {
        // trip name
        const tripNameElement = document.createElement('h1');
        tripNameElement.textContent = this.#itinerary.location;
        this.#container.appendChild(tripNameElement);

        // image
        // if (this.#itinerary.picture instanceof Blob) {
        //     const imageElement = document.createElement('img');
        //     imageElement.src = this.#itinerary.picture;
        //     imageElement.alt = "Image";
        //     imageElement.classList.add('itinerary-image')
        //     this.#container.appendChild(imageElement);
        // }

        // start and end dates
        const formattedStartDate = new Date(this.#itinerary.startDate).toLocaleString('en-us');
        const formattedEndDate = new Date(this.#itinerary.endDate).toLocaleString('en-us');

        const timeframeElement = document.createElement('h3');
        timeframeElement.textContent = `From ${formattedStartDate} to ${formattedEndDate}`;
        this.#container.appendChild(timeframeElement);

        // start and end locations
        const startLocation = this.#itinerary.startLocation.address;
        const endLocation = this.#itinerary.endLocation.address;

        const startLocationElement = document.createElement('h3');
        startLocationElement.textContent = `Starting at ${startLocation}`;
        this.#container.appendChild(startLocationElement);

        const endLocationElement = document.createElement('h3');
        endLocationElement.textContent = `Ending at ${endLocation}`;
        this.#container.appendChild(endLocationElement);

        // description
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = this.#itinerary.description;
        this.#container.appendChild(descriptionElement);
    }

    async render() {
        this.#initContainer();
        await this.#fetchItinerary();
        this.#createHeader();
        return this.#container;
    }

    async #fetchItinerary() {
        try {
            const itineraryID = getQueryParams(window.location).id;
            this.#itinerary = await this.#itineraryDB.getActivity(itineraryID);
        } catch (error) {
            console.log('Failed to fetch itinerary from ActivityDB:', error);
        }
    }
}