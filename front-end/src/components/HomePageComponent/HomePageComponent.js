import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryFormComponent } from "../ItineraryFormComponent/ItineraryFormComponent.js";

export class HomePageComponent extends BaseComponent {
  #container = null;
  #formComponent = null;

  constructor() {
    super();
    this.loadCSS("HomePageComponent");
    this.#formComponent = new ItineraryFormComponent();
  }

  render() {
    this.#createContainer();
    return this.#container;
  }

  #createContainer() {
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    // Add the "plus" tile
    const addTile = document.createElement("div");
    addTile.classList.add("tile", "plus-tile");
    addTile.textContent = "+";
    addTile.onclick = () => this.#showForm();
    this.#container.appendChild(addTile);
  }

  #showForm() {
    // Remove any existing form
    const existingForm = this.#container.querySelector(".itinerary-form");
    if (existingForm) existingForm.remove();

    // Render and append the form component to the container
    const formElement = this.#formComponent.render();
    this.#container.appendChild(formElement);

    // Attach event listener to the form submission
    formElement.querySelector("form").onsubmit = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      this.#addItineraryTile(formElement);
    };
  }

  #addItineraryTile(formElement) {
    // Get form values
    const title = formElement.querySelector("#location").value;

    // Create a new tile
    const newTile = document.createElement("div");
    newTile.classList.add("tile");
    newTile.textContent = title;

    // Add navigation functionality to the tile
    newTile.onclick = () => {
      // Update the URL without reloading the page
      const pageURL = `/activity/${encodeURIComponent(title)}`;
      history.pushState({}, "", pageURL);

      // Let the RouterComponent handle rendering the new page
      dispatchEvent(new PopStateEvent("popstate"));
    };

    // Append the new tile to the container
    this.#container.appendChild(newTile);

    // Remove the form
    formElement.remove();
  }
}
