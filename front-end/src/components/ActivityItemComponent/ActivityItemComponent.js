import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityItemDetailsComponent } from "../ActivityItemDetailsComponent/ActivityItemDetailsComponent.js";

export class ActivityItemComponent extends BaseComponent {
  #container = null;

  constructor(activityData = {}) {
    super();
    this.loadCSS('ActivityItemComponent');
    this.activityData = activityData;
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
    this.#container.id = 'activityItem';
  }

  #setupContainerItemContent() {
    this.#container.innerHTML = `
    <div>
      <h3 id="activityTitle"></h3>
      <div id="activityDetails" class="activity-item-details"></div>
    </div>
    `
  }

  #createActivityTitle() {
    const activityTitle = this.#container.querySelector('#activityTitle');
    activityTitle.textContent = this.activityData.location;
  }

  #attachEventListeners(){
    const activityDetailsElement = this.#getActivityDetailsElement();
    this.#container.addEventListener('click', (e) => {
      const isExpanded = activityDetailsElement.style.display === 'block';
      activityDetailsElement.style.display = isExpanded ? 'none' : 'block';
    });
  }

  #createActivityDetails(activityData){
    const activityDetailsElement = this.#getActivityDetailsElement();

    const activityDetails = new ActivityItemDetailsComponent(activityData);
    activityDetailsElement.appendChild(activityDetails.render());

  }

  #getActivityDetailsElement(){
    return this.#container.querySelector('#activityDetails');
  }
}
