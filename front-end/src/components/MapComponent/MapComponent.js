import { BaseComponent } from "../BaseComponent/BaseComponent";

export class MapComponent extends BaseComponent {
    #container = null;

    constructor(itinerary, transportation) {
        super();
        this.itinerary = itinerary;
        this.transportation = transportation;
        this.loadCSS('MapComponent');
    }

    render() {
        this.#createMap();
    }

    #createMap() {
        const mapScript = document.createElement('script');
        mapScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
        document.body.appendChild(mapScript);
    };
    
}