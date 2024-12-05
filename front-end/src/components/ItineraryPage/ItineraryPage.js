import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryActivityListComponent } from "../ItineraryActivityListComponent/ItineraryActivityListComponent.js";
import ItineraryHeaderComponent from "../ItineraryHeaderComponent/ItineraryHeaderComponent.js";
import { MapComponent } from "../ItineraryMapComponent/ItineraryMapComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import Itinerary from "../../Models/Itinerary.js";

export default class ItineraryPage extends BaseComponent {
    #container = null;
    #selectedDay = 1;
    constructor() {
        super();
    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-page');
        this.#container.id = 'itineraryPage';
    }

    #loadHeader() {
        const itineraryHeaderComponent = new ItineraryHeaderComponent();
        this.#container.appendChild(itineraryHeaderComponent.render());
    }

    #loadMap() {
        const x = Array.from(Itinerary.getInstance().activities.values());
        console.log(x);
        const mapComponent = new MapComponent(x);
        this.#container.appendChild(mapComponent.render());
    }

    #loadActivityList() {
        const activityListComponent = new ItineraryActivityListComponent();
        this.#container.appendChild(activityListComponent.render());
    }

    #attachEventListeners() {
        EventHub.getInstance().subscribe(Events.ChangeDay, day => this.#changeDay(day))
    }

    #changeDay(day) {
        this.#selectedDay = day;
    }

    render() {
        this.#initContainer();
        this.#attachEventListeners();
        this.#loadHeader();
        this.#loadMap();
        this.#loadActivityList();
        return this.#container;
    }
}
