import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ItineraryFormComponent extends BaseComponent {
#container = null;

  constructor() {
    super();
    this.loadCSS('ItineraryFormComponent');
  }

  render() {
    this.#createContainer();
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
        <input type="file" id="picture" name="picture" accept="image/*">
        <br>

        <label for="start-date">Start Date:</label>
        <input type="date" id="start-date" name="start-date">
        <br>

        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" name="end-date">
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
