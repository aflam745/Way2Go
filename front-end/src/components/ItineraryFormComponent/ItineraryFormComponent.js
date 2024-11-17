import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ItineraryFormComponent extends BaseComponent {
#container = null;

  constructor() {
    super();
    this.loadCSS('ItineraryFormComponent');
  }

  render() {
    this.#createContainer();
    //this.#attachEventListeners();
    return this.#container;
  }

  #createContainer() {
    this.#container = document.createElement('div');
    this.#container.classList.add('itinerary-form');
    this.#container.innerHTML = this.#getTemplate();
  }

  #getTemplate() {
    return `
      <form>
        <h2>Create New Itinerary</h2>

        <label for="location">Name of location:</label>
        <input type="text" id="location" name="location" placeholder="Enter location">
        <br>

        <label for="picture">Insert Picture:</label>
      

        <button id="add-itinerary">Create Itinerary</button>
        <button id="clear">Clear</button>
      </form>
    `;
  }

}