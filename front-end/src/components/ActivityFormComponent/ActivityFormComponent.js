import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class ActivityFormComponent extends BaseComponent {
  #container = null;

  constructor() {
    super();
    this.loadCSS('ActivityFormComponent');
  }

  render() {
    this.#createContainer();
    this.#attachEventListeners();
    return this.#container;
  }

  #createContainer() {
    this.#container = document.createElement('div');
    this.#container.classList.add('activity-form');
    this.#container.innerHTML = this.#getTemplate();
  }

  #getTemplate() {
    return `
      <form>
        <h2>Add New Activity</h2>

        <label for="specific-day">Must happen on specific day:</label>
        <select id="specific-day" name="specificDay">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        <br>

        <div id="choose-day" style="display: none">
          <label for="day-selection">Select day:</label>
          <select id="day-selection" name="daySelection">
            <option value="day-1">Day 1</option>
            <option value="day-2">Day 2</option>
            <option value="day-3">Day 3</option>
          </select>
          <br>
        </div>

        <label for="location">Name of location:</label>
        <input type="text" id="location" name="location" placeholder="Enter location">
        <br>

        <label for="address">Address:</label>
        <input type="text" id="address" name="address">
        <br>

        <label for="duration">Duration:</label>
        <input type="text" id="duration" name="duration" class="time-input">
        <br>

        <label for="open-time">Opens at:</label>
        <input type="text" id="open-time" name="openTime" class="time-input">
        <label for="close-time">Closes at:</label>
        <input type="text" id="close-time" name="closeTime" class="time-input">
        <br>

        <label for="notes">Notes:</label>
        <textarea id="notes" name="notes"></textarea>
        <br>

        <button id="add-activity">Add Activity</button>
        <button id="clear">Clear</button>
      </form>
    `;
  }

  #attachEventListeners() {
    const specificDay = this.#container.querySelector('#specific-day');
    const daySelection = this.#container.querySelector('#day-selection');
    const location = this.#container.querySelector('#location');
    const address = this.#container.querySelector('#address');
    const duration = this.#container.querySelector('#duration');
    const openTime = this.#container.querySelector('#open-time');
    const closeTime = this.#container.querySelector('#close-time');
    const notes = this.#container.querySelector('#notes');
    const addActivityBtn = this.#container.querySelector('#add-activity');
    const clearActivityBtn = this.#container.querySelector('#clear');

    /** @type HTMLFormElement */
    const submissionForm = this.#container.querySelector('form')

    clearActivityBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.#clearInputs();
    });

    submissionForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      this.#handleAddActivity2(formData)
    })

    const hub = EventHub.getInstance();
    hub.subscribe('EditActivity', activityData => this.#fillFormEditActivity(activityData));
  }

  /**
    * @param {FormData} formData  - Data from the form in formData format
    */
  #handleAddActivity2(formData) {
    this.#publishNewActivity2(Object.fromEntries(formData))

    this.#clearInputs()
  }

  /**
    * @param {Object} data 
    */
  #publishNewActivity2(data) {
    const hub = EventHub.getInstance();
    hub.publish(Events.NewActivity, data);
    hub.publish(Events.StoreActivity, data);
  }

  #clearInputs() {
    this.#container.querySelector('form')?.reset()
  }

  #fillFormEditActivity(activityData) {
    const data = activityData.activityData;

    this.#container.querySelector('#specific-day').value = data.specificDay;
    this.#container.querySelector('#day-selection').value = data.day;
    this.#container.querySelector('#location').value = data.location;
    this.#container.querySelector('#address').value = data.address;
    this.#container.querySelector('#duration').value = data.duration;
    this.#container.querySelector('#open-time').value = data.openTime;
    this.#container.querySelector('#close-time').value = data.closeTime;
    this.#container.querySelector('#notes').value = data.notes;
  }
}
