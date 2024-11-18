import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityItemDetailsComponent } from "../ActivityItemDetailsComponent/ActivityItemDetailsComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

export class ActivityItemComponent extends BaseComponent {
  #container = null;
  #activityDB = null;

  constructor(activityData = {}) {
    super();
    this.loadCSS('ActivityItemComponent');
    this.activityData = activityData;
    this.#activityDB = new ActivityDatabase('ActivityDB');
  }

  render() {
    this.#createContainer();
    this.#setupContainerItemContent();
    this.#attachEventListeners();

    this.#createActivityTitle();
    this.#createActivityDetails(this.activityData);

    return this.#container;
  }

  #createContainer(){
    this.#container = document.createElement('div');
    this.#container.classList.add('activity-item');
    this.#container.id = 'activityItem_' + this.activityData.id;
  }

  #setupContainerItemContent() {
    this.#container.innerHTML = `
    <h3 class="activityTitle"></h3>
    <div class="button-group">
      <button class="editActivity">Edit</button>
      <button class="deleteActivity">Delete</button>
    </div>
    <div id="activityDetails" class="activity-item-details"></div>
    `
  }

  #createActivityTitle() {
    const activityTitle = this.#container.querySelector('.activityTitle');
    activityTitle.textContent = this.activityData.location;
  }

  #attachEventListeners(){
    const activityDetailsElement = this.#getActivityDetailsElement();
    this.#container.addEventListener('click', () => {
      const isExpanded = activityDetailsElement.style.display === 'block';
      activityDetailsElement.style.display = isExpanded ? 'none' : 'block';
    });

    const editActivityButton = this.#container.querySelector('.editActivity');
    editActivityButton.addEventListener('click', () => {
      this.#publishEditActivity(this.activityData);
    })

    const deleteActivityButton = this.#container.querySelector('.deleteActivity');
    deleteActivityButton.addEventListener('click', (e) => {
      e.stopPropagation();

      this.#activityDB.deleteActivity(this.activityData.id)
        .then((message) => {
          console.log(message);
        })
        .catch((error) => {
          console.error("Failed to delete activity from ActivityDB:", error);
        });

      this.#container.remove();
    })
  }

  #createActivityDetails(activityData){
    const activityDetailsElement = this.#getActivityDetailsElement();

    const activityDetails = new ActivityItemDetailsComponent(activityData);
    activityDetailsElement.appendChild(activityDetails.render());

  }

  #getActivityDetailsElement(){
    return this.#container.querySelector('#activityDetails');
  }

  #publishEditActivity(activityData){
    const hub = EventHub.getInstance();

    hub.publish(Events.EditActivity, { activityData });
  }
}
