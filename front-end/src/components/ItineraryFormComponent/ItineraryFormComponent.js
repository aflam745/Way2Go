import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import LocationSearchComponent from "../LocationSearchComponent/LocationSearchComponent.js";


export class ItineraryFormComponent extends BaseComponent {
#container = null;
#startLocationEntry;
#endLocationEntry;

  constructor() {
    super();
    this.loadCSS('ItineraryFormComponent');
    this.#startLocationEntry = new LocationSearchComponent();
    this.#endLocationEntry = new LocationSearchComponent();
  }

  render() {
    this.#createContainer();
    return this.#container;
  }

  getLocationEntries() {
    return { startLocationEntry: this.#startLocationEntry.getLocation(), endLocationEntry: this.#endLocationEntry.getLocation() }
  }

  #createContainer() {
    this.#container = document.createElement('div');
    this.#container.classList.add('itinerary-form');
    this.#container.innerHTML = this.#getTemplate();

    this.#container.querySelector('#start-location-container').appendChild(this.#startLocationEntry.render());
    this.#container.querySelector('#end-location-container').appendChild(this.#endLocationEntry.render());

    // this.#container.querySelector('form').addEventListener('submit', this.#handleSubmit.bind(this));
  }

  #getTemplate() {
    return `
      <form>
        <h2>Create New Itinerary</h2>

        <label for="location">Name of location:</label>
        <input type="text" id="location" name="location" placeholder="Enter location">
        <br>

        <label for="picture">Insert Picture:</label>
        <input type="file" id="picture" name="picture" accept="image/*">
        <br>

        <label for="start-location-container">Enter start location</label>
        <div id="start-location-container"></div>
        <label for="end-ocation-container">Enter end location</label>
        <div id="end-location-container"></div>

        <label for="start-date">Start Date & Time:</label>
        <input type="datetime-local" id="start-date" name="startDate">
        <br>

        <label for="endDate">End Date & Time:</label>
        <input type="datetime-local" id="end-date" name="endDate">
        <br>

        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" cols="30" placeholder="Add a description..."></textarea>
        <br>

        <button id="add-itinerary" type="submit">Create Itinerary</button>
        <button id="clear" type="reset">Clear</button>
      </form>
    `;
  }
  // #handleSubmit(event) {
  //   event.preventDefault();

  //   // Gather data from form
  //   const location = this.#locationSearchComponent.getLocation();
  //   const picture = this.#container.querySelector('#picture').files[0];
  //   const startDate = this.#container.querySelector('#startDate').value;
  //   const endDate = this.#container.querySelector('#endDate').value;
  //   const description = this.#container.querySelector('#description').value;

  //   // Validate required fields (e.g., location, dates)
  //   if (!location.address || !startDate || !endDate) {
  //     alert('Please fill out all required fields.');
  //     return;
  //   }

  //   // Create the itinerary object
  //   const itinerary = {
  //     location,
  //     picture,
  //     startDate,
  //     endDate,
  //     description,
  //   };
  // }
}
