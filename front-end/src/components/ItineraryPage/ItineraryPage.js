import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryActivityListComponent } from "../ItineraryActivityListComponent/ItineraryActivityListComponent.js";
import ItineraryHeaderComponent from "../ItineraryHeaderComponent/ItineraryHeaderComponent.js";
import { MapComponent } from "../ItineraryMapComponent/ItineraryMapComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import Itinerary from "../../Models/Itinerary.js";
import { getQueryParams } from "../../lib/router.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

export default class ItineraryPage extends BaseComponent {
    #container = null;
    #header;
    #map;
    #activityList;
    #selectedDay = 1;
    #itinerary;
    #activityDB = null;
    #itineraryDB = null;
    constructor() {
        super();
        this.#activityDB = new ActivityDatabase('ActivityDB');
        this.#itineraryDB = new ActivityDatabase('ItineraryDB');
    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-page');
        this.#container.id = 'itineraryPage';
    }

    async #fetchItineraryAndActivityData() {
        const queryParams = getQueryParams(window.location);
        const itineraryId = queryParams.id;
        let { itinerary, activities } = await Itinerary.fetchItineraryAndActivityData(itineraryId);
        itinerary = JSON.parse(itinerary.data);
        activities = activities.map(activity => JSON.parse(activity));
        this.#storeInIndexedDB(itinerary, activities);
    }    

    #storeInIndexedDB(itinerary, activities) {
        this.#itineraryDB.addActivity(itinerary);
        activities.forEach(activity => this.#activityDB.addActivity(activity));
    }

    async #loadHeader() {
        const itineraryHeaderComponent = new ItineraryHeaderComponent();
        this.#container.appendChild(await itineraryHeaderComponent.render());
    }

    async #loadMap() {
        const mapComponent = new MapComponent();
        this.#container.appendChild(await mapComponent.render());
    }

    async #loadActivityList() {
        const activityListComponent = new ItineraryActivityListComponent();
        this.#container.appendChild(await activityListComponent.render());
    }

    // #loadMap() {
    //     let mapContainer = document.getElementById('mapContainer');
    //     if (!mapContainer) {
    //         mapContainer = document.createElement('div');
    //         mapContainer.id = 'mapContainer';
    //         this.#container.appendChild(mapContainer);
    //     } else {
    //         if (this.#map) {
    //             this.#map.removeSelf();
    //             this.#map = null;
    //         }
    //         mapContainer.innerHTML = '';
    //     }

    //     const activities = this.#filterByDay();
    //     const geometry = null;

    //     this.#map = new MapComponent(activities, geometry);
    //     mapContainer.appendChild(this.#map.render());
    // }

    // #loadActivityList() {
    //     const activityListContainer = this.#container.querySelector('#itineraryActivityList');
    //     if (activityListContainer) activityListContainer.remove();
    //     const activityListComponent = new ItineraryActivityListComponent(this.#itinerary.activities, this.#selectedDay);
    //     this.#container.appendChild(activityListComponent.render());
    // }

    // #attachEventListeners() {
    //     EventHub.getInstance().subscribe(Events.ChangeDay, day => this.#changeDay(day))
    // }

    // #changeDay(day) {
    //     this.#selectedDay = day;
    //     const activities = this.#filterByDay();
    //     this.#loadMap(activities);
    //     this.#loadActivityList(activities, this.#selectedDay);


    // }

    async #loadContent() {
        // this.#attachEventListeners();
        await this.#loadHeader();
        await this.#loadMap();
        await this.#loadActivityList();
    }

    async render() {
        this.#initContainer();
        await this.#fetchItineraryAndActivityData()
            .then(async () => await this.#loadContent())
            .catch(e => console.error('Failed to fetch itinerary and activities:', e));
        
        console.log(this.#container);
        return this.#container;
    }

    // #filterByDay = () => this.#itinerary.activities.filter(
    //     (activity) => activity.day.includes(this.#selectedDay) // can straddle midnight
    // );
}
