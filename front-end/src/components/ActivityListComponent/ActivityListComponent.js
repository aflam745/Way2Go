import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';
import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { ActivityItemComponent } from '../ActivityItemComponent/ActivityItemComponent.js';
import { ActivityDatabase } from '../../Models/ActivityDatabase.js';

export class ActivityListComponent extends BaseComponent {
  #container = null; // Private variable to store the container element
  #activityDB = null;

  constructor() {
    super();
    this.loadCSS('ActivityListComponent');
    this.#activityDB = new ActivityDatabase('ActivityDB');
  }

  // Renders the component and returns the container element
  render() {
    this.#createContainer();
    this.#setupContainerContent();
    this.#attachEventListeners();
    this.#fetchAndDisplayActivities();

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
      <div>
        <h2>Activity List</h2>
        <button id="generateItinerary">Generate itinerary</button>
        <button id="clearList">Clear list</button>
      </div>
      <ul id="activityList"></ul>
    `;
  }

  // Attaches the event listeners for the component
  #attachEventListeners() {
    const hub = EventHub.getInstance();

    hub.subscribe(Events.NewActivity, activityData => this.#addActivityToList(activityData));
    hub.subscribe(Events.SubmitEditActivity, activityData => this.#editActivityInList(activityData));

    const clearListButton = this.#container.querySelector("#clearList");

    clearListButton.addEventListener('click', (e) => {
      this.#clearActivityList();
    })
  }

  #addActivityToList(activityData) {
    const activityList = this.#getActivityListElement();

    const activity = new ActivityItemComponent(activityData);
    activityList.appendChild(activity.render());
  }

  #clearActivityList(){
    const activityUlElement = this.#container.querySelector('#activityList');
    const allActivities = activityUlElement.children;

    const length = allActivities.length;

    for(let i = 0; i < length; ++i){
      const activity = allActivities[0];
      const activityId = activity.id.replace('activityItem_', '');

      this.#activityDB.deleteActivity(activityId)
        .then((message) => {
          console.log(message);
        })
        .catch((error) => {
          console.error("Failed to delete activity from ActivityDB:", error);
        });
      activity.remove();
    }
  }

  #editActivityInList(activityData){
    const activityUlElement = this.#container.querySelector('#activityList');
    const oldActivity = activityUlElement.querySelector('#activityItem_' + activityData.id);
    oldActivity.remove();

    this.#activityDB.deleteActivity(activityData.id)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to delete activity from ActivityDB:", error);
      });

    this.#activityDB.addActivity(activityData)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to add activity to IndexedDB:", error);
      });

    this.#addActivityToList(activityData);
  }

  async #fetchAndDisplayActivities() {
    try {
      const activities = await this.#activityDB.getAllActivity();
      activities.forEach(activityData => {
        this.#addActivityToList(activityData);
      });
    } catch (error) {
      console.log('Failed to fetch activities from ActivityDB:', error);
    }
  }

  #getActivityListElement() {
    return this.#container.querySelector('#activityList');
  }
}
