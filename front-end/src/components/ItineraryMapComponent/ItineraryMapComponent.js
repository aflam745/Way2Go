import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

export class MapComponent extends BaseComponent {
    #container = null;
    #activityDB;
    #itineraryDB;
    #activities = null;
    #itinerary = null;
    #day = 1;

    constructor() {
        super();
        this.map = null;
        this.#activityDB = new ActivityDatabase('ActivityDB');
        this.#itineraryDB = new ActivityDatabase('ItineraryDB');
        EventHub.getInstance().subscribe(Events.ChangeDay, day => {
            this.#container = null;
            this.#day = day;
            this.render();

        })
    }

    async render() {
        this.#createContainer();
        await this.#fetchItinerary();
        const activities = await this.#getActivitiesOnDay();
        this.#loadLeafletResources(() => this.#initializeMap(activities));
        return this.#container;
    }

    async #getActivitiesOnDay() {
        const activities = await this.#fetchActivities();
        return activities.filter(activity => activity.day.includes(this.#day));
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

    removeSelf() {
        this.map.off();
        this.map.remove();
        this.map = null;
        this.geometry = null;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.style.height = '400px';
        this.#container.style.width = '100%';
        this.#container.id = 'map'; 
    }

    #loadLeafletResources(callback) {
        const mapScript = document.createElement('script');
        mapScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        mapScript.onload = () => {
            const polylineScript = document.createElement('script');
            polylineScript.src = "https://unpkg.com/@mapbox/polyline@1.1.1/src/polyline.js";
            polylineScript.onload = callback.bind(this); 
            document.head.appendChild(polylineScript);
        };
        document.head.appendChild(mapScript);

        this.loadCSS('ItineraryMapComponent');
        const mapStyles = document.createElement('link');
        mapStyles.rel = 'stylesheet';
        mapStyles.href = "https://unpkg.com/leaflet/dist/leaflet.css";
        document.head.appendChild(mapStyles);
    }

    #initializeMap(activities) {   
        if (activities.length === 0) {
            this.map = document.createElement('div').innerHTML = '';
            return;
        }   
        this.map = L.map(this.#container, { zoomSnap: 0.1});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        const markers = activities.map((activity, index) => {
            const originalTooltipText = `${index + 1}. ${activity.name}`;

            // marker images stored locally to avoid marker render issue
            const icon = L.icon({
                iconUrl: '/components/ItineraryMapComponent/images/marker-icon.png',
                shadowUrl: '/components/ItineraryMapComponent/images/marker-shadow.png',

                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41]
                
            });

            // regular tooltip
            const marker = L.marker([activity.lat, activity.lon], {icon} )
                .bindTooltip(originalTooltipText, {
                    permanent: true,
                    direction: "top",
                    className: "leaflet-label",
                })
                .addTo(this.map);

            // show address on hover
            marker.on('mouseover', () => {
                const tooltip = marker.getTooltip();
                tooltip.setContent(
                    `${originalTooltipText}<br><i>${activity.address}</i>`
                );
                tooltip.options.permanent = false;
                marker.openTooltip();
            });

            // reset to normal display when mouse leaves
            marker.on('mouseout', () => {
                const tooltip = marker.getTooltip();
                tooltip.setContent(originalTooltipText);
                tooltip.options.permanent = true;
                marker.openTooltip();
            });

            return marker;
        });


        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            this.map.fitBounds(group.getBounds(), {padding: [80, 80]});
        }

        // add line to map if geometry is given
        if (this.geometry) {
            const geojson = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": this.geometry
                }
                
            };

            L.geoJSON(geojson).addTo(this.map);
        }
    }
}
