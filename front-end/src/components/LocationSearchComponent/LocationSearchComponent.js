import { BaseComponent } from "../BaseComponent/BaseComponent.js"
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export default class LocationSearchComponent extends BaseComponent {
    #container = null;
    #searchInput = null;
    #searchResults = null;
    #timeoutId = null;
    #location = null;

    constructor() {
        super();
        this.loadCSS("LocationSearchComponent");
        this.#initLocation();
        this.#subscribeToEvents();
    }

    /**
     * Provides the entered location.
     * @returns {{address: string, lat: number, lon: number}} An object containing the location details.
     */
    getLocation() {
        return { ...this.#location };
    }

    #initLocation() {
        this.#location = {
            lon: null,
            lat: null,
            address: null,
        };
    }

    render() {
        this.#initContainer();
        this.#createSearchBar();
        this.#addEventListeners();
        return this.#container;
    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('location-search-component');
        this.#container.id = 'locationSearchComponent';
    }

    #createSearchBar() {
        // search bar
        this.#searchInput = document.createElement('input');
        this.#searchInput.classList.add('search-input');
        this.#searchInput.id = 'searchInput';
        this.#searchInput.placeholder = 'Enter a location...';
        this.#container.appendChild(this.#searchInput);

        // dropdown display of results
        this.#searchResults = document.createElement('div');
        this.#searchResults.classList.add('search-results');
        this.#searchResults.id = 'searchResults';
        this.#container.appendChild(this.#searchResults);
    }

    #addEventListeners() {
        document.addEventListener("mousedown", this.#handleClickOutside.bind(this));
        this.#searchInput.addEventListener("input", this.#handleInputChange.bind(this));
    }

    #handleClickOutside(event) {
        // close the dropdown if the click is outside the input or dropdown
        if (!this.#isClickInContainer(event)) {
            // if the user has a partially entered (nonvalid) address,
            // then it will reset the input field to the last entered address
            this.resetEntry();
        } else if (this.#isClickInInputField(event)) {
            // show the dropdown when clicking the search input
            this.#displaySearchResults();
        }
    }

    #handleInputChange(event) {
        clearTimeout(this.#timeoutId); // clear any previous timeout
        if (event.target.value === '') {
            this.#searchResults.innerHTML = '';
            this.#initLocation();
            return;
        }
        this.#displaySearchingText(event);
        this.#timeoutId = setTimeout(async () => {
            const data = await this.#fetchLocations(event);
            this.#searchResults.innerHTML = ''; // clear "Searching..."

            if (data.length === 0) this.#displayNoResults();

            data.forEach(place => {
                // create dropdown entry for each result
                this.#createDropdownElement(place);
            });
        }, 1500);
    }

    resetEntry() {
        this.#searchResults.innerHTML = '';
        this.#searchResults.style.display = 'none';
        // if all text is removed, then also clear the saved address
        if (this.#searchInput.value === '') {
            this.#initLocation();
        } else {
            this.#searchInput.value = this.#location.address;
        }
    }

    async #fetchLocations(event) {
        // if there's no text, don't call the API
        if (!event.target.value) return [];
        const encodedEntry = encodeURIComponent(event.target.value);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodedEntry}&format=json&polygon_kml=1&addressdetails=1`);
        if (!res.ok) throw new Error(`Error fetching results: ${res.status} ${res.statusText}`);
        const resjson = await res.json();
        return resjson;
    }

    #displaySearchingText(event) {
        const searching = document.createElement('a');
        this.#searchResults.innerHTML = '';
        if (event.target.value !== '')
            searching.innerHTML = "<i>Searching...</i>";
        else (searching.style.display = 'none');
        this.#searchResults.appendChild(searching);
    }

    #displaySearchResults() {
        this.#searchResults.style.display = 'block';
    }

    #displayNoResults() {
        const noResults = document.createElement('a');
        noResults.innerText = "No results found.";
        this.#searchResults.appendChild(noResults);
    }

    #createDropdownElement(place) {
        const item = document.createElement('a');
        item.innerHTML = place.display_name;
        item.style.cursor = 'pointer';
        this.#searchResults.appendChild(item);

        item.addEventListener('mouseup', () => {
            this.#searchInput.value = place.display_name;

            const location = {
                address: place.display_name,
                lat: place.lat,
                lon: place.lon
            };

            this.#location = location;

            this.#searchResults.innerHTML = '';
            this.#searchResults.style.display = 'none';
        });
    }

    #isClickInContainer(event) {
        return this.#container.contains(event.target);
    }

    #isClickInInputField(event) {
        return this.#searchInput.contains(event.target);
    }

    #subscribeToEvents() {
        EventHub.getInstance().subscribe(Events.EditAddress, location => {
            this.#container.querySelector('#searchInput.search-input').value = location.address;
            this.#location = location;
        });
    }
}
