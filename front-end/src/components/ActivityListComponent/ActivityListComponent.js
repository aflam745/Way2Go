import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';
import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { ActivityItemComponent } from '../ActivityItemComponent/ActivityItemComponent.js';

export class ActivityListComponent extends BaseComponent {
  #container = null; // Private variable to store the container element

  constructor() {
    super();
    this.loadCSS('ActivityListComponent');
  }

  // Renders the component and returns the container element
  render() {
    this.#createContainer();
    this.#setupContainerContent();
    this.#attachEventListeners();

    return this.#container;
  }

  // Creates the container element and applies the necessary classes
  #createContainer() {
    this.#container = document.createElement('div');
    this.#container.classList.add('activity-list');
  }

  // Sets up the inner HTML of the container
  #setupContainerContent() {
    this.#container.innerHTML = `
      <h2>Activity List</h2>
      <ul id="activityList"></ul>
    `;
  }

  // Attaches the event listeners for the component
  #attachEventListeners() {
    const hub = EventHub.getInstance();

    hub.subscribe('NewActivity', activityData => this.#addTaskToList(activityData));
  }

  #addTaskToList(activityData) {
    const activityList = this.#getTaskListElement();

    const activity = new ActivityItemComponent(activityData);
    activityList.appendChild(activity.render());
  }

  #getTaskListElement() {
    return this.#container.querySelector('#activityList');
  }
}
