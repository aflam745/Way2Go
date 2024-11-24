import { EventHub } from "../../eventhub/EventHub";
import { Events } from "../../eventhub/Events";

export default class LocationSearchComponent {
    #container = null;
    #addressDisplay = null;
    #searchWrapper = null;
    #searchForm = null;
    #searchLabel = null;
    #searchInput = null;
    #searchResults = null;


    constructor () {

    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('location-search-component');
        this.#container.id = 'locationSearchComponent';
    }

    render() {
        this.#initContainer();
        this.#createSearchBar();
        this.#initEntryEventListener();
        // this.#createAddressDisplay();
    }

    // #createAddressDisplay() {
    //     this.#addressDisplay = document.createElement('div');
    //     this.#addressDisplay.classList.add('address-display');
    //     this.#addressDisplay.id = 'addressDisplay';
    //     this.#addressDisplay.innerText = '';
        
    // }

    #createSearchBar() {
        // form wrapper for the search bar and label
        this.#searchForm = document.createElement('form');
        this.#searchForm.classList.add('search-form');
        this.#searchForm.id = 'searchForm';

        // "Search" label
        this.#searchLabel = document.createElement('label');
        this.#searchLabel.htmlFor('searchInput');
        this.#searchLabel.id = 'search-label'
        this.#searchLabel.innerText = "Search"
        this.#searchForm.appendChild(this.#searchLabel);

        // search bar
        this.#searchInput = document.createElement('input');
        this.#searchInput.classList.add('search-input');
        this.#searchInput.id = 'searchInput';
        this.#searchForm.appendChild(this.#searchForm);        

        // dropdown display of results
        this.#searchResults = document.createElement('div');
        this.#searchResults.classList.add('search-results');
        this.#searchResults.id = 'searchResults';
    }

    #initEntryEventListener() {

        const searchResults = this.#searchResults;
        const searchInput = this.#searchInput;



        // address.innerHTML = "Selected address: none"

        let location = {}; // Variable to store the selected location

        document.addEventListener('mousedown', function (event) {
            // Close the dropdown if the click is outside the input or dropdown
            if (!(searchResults.contains(event.target) || searchInput.contains(event.target))) {
                searchResults.style.display = 'none';
            } else if (searchInput.contains(event.target)) {
                // Show the dropdown when clicking the search input
                searchResults.style.display = 'block';
            }
        });

        let timeoutId;

        searchInput.addEventListener('keyup', function (event) {
            clearTimeout(timeoutId); // Clear any previous timeout

            const searching = document.createElement('a');
            searchResults.innerHTML = ''; // Clear old results
            if (event.target.value !== '')
                searching.innerHTML = "<i>Searching...</i>"; // Placeholder while loading
            else (searching.style.display = 'none');
            searchResults.appendChild(searching);

            timeoutId = setTimeout(async () => {
                const encodedEntry = encodeURIComponent(event.target.value);
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodedEntry}&format=json&polygon_kml=1&addressdetails=1`);
                const data = await res.json();

                searchResults.innerHTML = ''; // Clear placeholder

                data.forEach(place => {
                    // Create dropdown entry
                    const item = document.createElement('a');
                    item.innerHTML = place.display_name;
                    item.style.cursor = 'pointer'
                    searchResults.appendChild(item);

                    // Add click listener for selection
                    item.addEventListener('mousedown', () => {
                        // Store selected location

                        location = {
                            address: place.display_name,
                            lat: place.lat,
                            lon: place.lon
                        };

                        EventHub.getInstance().publish(Events.LocationSelect, location);

                        console.log('Selected Location:', location);

                        searchResults.innerHTML = '';
                        // Close the dropdown
                        searchResults.style.display = 'none';

                        // address.innerHTML = "Selected address: " + place.display_name;
                        searchInput.value = "";
                    });
                });
            }, 1500);
        });
        
    }
}