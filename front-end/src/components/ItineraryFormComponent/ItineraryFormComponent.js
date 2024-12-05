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

  }

  #getTemplate() {
    return `
      <form>
        <h2>Create New Itinerary</h2>

        <label for="location">Name of Trip:</label>
        <input type="text" id="location" name="location" placeholder="Enter name">
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
}
