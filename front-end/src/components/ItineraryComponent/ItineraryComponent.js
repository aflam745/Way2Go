import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryFormComponent } from "./ItineraryFormComponent.js";

export class ItineraryComponent extends BaseComponent {
  #container = null;
  #formComponent = null;

  constructor() {
    super();
    this.loadCSS("ItineraryComponent");
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

    // Link the tile to another page (replace "details.html" with your desired page)
    newTile.onclick = () => {
      window.location.href = `details.html?title=${encodeURIComponent(title)}`;
    };

    // Append the new tile to the container
    this.#container.appendChild(newTile);

    // Remove the form
    formElement.remove();
  }

  #getTemplate() {
    return `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Itineraries</title>
    <link rel="stylesheet" href="itineraryComponent.css">
  </head>
  <body>
    <header>
  <h1>Way2Go</h1>
  </header>
  <div class="container" id="tile-container">
    <div class="tile plus-tile" id="add-tile" onclick="showForm()">+</div>
  </div>
  <script src="itineraryComponent.js"> </script>
  </body>`;
  }
}
