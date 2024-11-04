import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ActivityItemComponent extends BaseComponent {
  #container = null;

  constructor(activityData = {}) {
    super();
    this.loadCSS('ActivityItemComponent');
    this.activityData = activityData;
  }

  render() {
    // Create the main container
    this.#container = document.createElement('div');
    //this.#container.style.color = "red";
    this.#container.classList.add('activity-item');

    const activityText = this.#createActivityText();
    this.#container.appendChild(activityText);

    return this.#container;
  }

  #createActivityText() {
    const activityText = document.createElement('span');
    activityText.textContent = this.activityData.location;
    return activityText;
  }
}
