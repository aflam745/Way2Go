import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class ActivityFormComponent extends BaseComponent {
  /** @type HTMLDivElement | null */
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
    /** @type HTMLButtonElement */
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
    const currentTime = new Date().toLocaleTimeString();
    const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
    const activityId = { activityId: currentTime + "_" + randThreeDigitInt}
    this.#publishNewActivity2({
      ...Object.fromEntries(formData),
      ...activityId,
    });
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

  // Clears the form
  #clearInputs() {
    this.#container.querySelector('form')?.reset();
  }

  /*
    * @param {Object} activityData
    * Sets the values on the form based on the values present in the activityData object
    */
  #fillFormEditActivity(activityData) {
    const data = activityData.activityData;

    for (let [key, val] of Object.entries(data)) {
      // This query searches for either an input, select, or textarea and then sets the value based on the in activityData
      const query = `:is(input[name="${key}"], select[name="${key}"], textarea[name="${key}"])`
      const input = this.#container.querySelector(query)
      input.value = val
    }
  }
}
