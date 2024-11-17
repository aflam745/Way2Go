import { BaseComponent } from "../BaseComponent/BaseComponent";

export class MapComponent extends BaseComponent {
    #container = null;

    constructor(activities, polyline=null) {
        super();
        this.activities = activities;
        this.polyline = polyline;
        this.map = null;
    }

    render() {
        this.#createContainer();
        this.#loadLeafletResources(() => this.#initializeMap());
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.style.height = '400px';
        this.#container.style.width = '100%';
        this.#container.id = 'map'; // Required for Leaflet to initialize
    }

    #loadLeafletResources(callback) {
        // Load Leaflet JS
        const mapScript = document.createElement('script');
        mapScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        mapScript.onload = callback.bind(this);
        document.head.appendChild(mapScript);

        // Load Leaflet CSS
        this.loadCSS('MapComponent'); // Ensure you have a MapComponent.css file
        const mapStyles = document.createElement('link');
        mapStyles.rel = 'stylesheet';
        mapStyles.href = "https://unpkg.com/leaflet/dist/leaflet.css";
        document.head.appendChild(mapStyles);
    }

    #initializeMap() {
        this.map = L.map(this.#container.id);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.map);

        const markers = this.activities.map((activity, index) => {
            const originalTooltipText = `${index + 1}. ${activity.name}`

            // default tooltip
            const marker = L.marker([activity.location.lat, activity.location.lon])
                .bindTooltip(
                    originalTooltipText,
                    { permanent: true, direction: "right", className: "leaflet-label" }
                )
                .addTo(this.map);
            
            // tooltip hover effect
            marker.on('mouseover', () => {
                marker.unbindTooltip();
                marker.bindTooltip(
                    originalTooltipText + `<br><i>${activity.location.address}</i>`,
                    { permanent: false, direction: "right", className: "leaflet-label" }
                ).openTooltip();
            });

            // reset tooltip off hover
            marker.on('mouseout', () => {
                marker.unbindTooltip(); 
                marker.bindTooltip(
                    originalTooltipText,
                    { permanent: true, direction: "right", className: "leaflet-label" }
                );
            });
            
            return marker;
        });


        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            this.map.fitBounds(group.getBounds());
        }

        if (polyline) L.geoJSON(this.polyline).addTo(this.map);
    }
}
