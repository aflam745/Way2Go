import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

export class ActivityFormComponent extends BaseComponent {
  /** @type HTMLDivElement | null */
  #container = null;
  #activityDB = null;

  constructor() {
    super();
    this.loadCSS('ActivityFormComponent');
    this.#activityDB = new ActivityDatabase('ActivityDB');
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

        <input type="hidden" id="id" name="id">

        <label for="specific-day">Must happen on specific day:</label>
        <select id="specific-day" name="specificDay">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
        <br>

        <div id="choose-day" style="display: none">
          <label for="day-selection">Select day:</label>
          <select id="day-selection" name="daySelection">
            <option value="Day 1">Day 1</option>
            <option value="Day 2">Day 2</option>
            <option value="Day 3">Day 3</option>
          </select>
          <br>
        </div>

        <label for="location">Name of location:</label>
        <input type="text" id="location" name="location" placeholder="Enter location" required>
        <br>

        <label for="address">Address:</label>
        <input type="text" id="address" name="address" required>
        <br>

        <label for="duration">Duration:</label>
        <input type="time" id="duration" name="duration" class="time-input" required>
        <br>

        <label for="open-time">Opens at:</label>
        <input type="time" id="open-time" name="openTime" class="time-input">
        <label for="close-time">Closes at:</label>
        <input type="time" id="close-time" name="closeTime" class="time-input">
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

    const specificDaySelector = this.#container.querySelector('#specific-day');
    const chooseDaySelector = this.#container.querySelector('#choose-day');

    specificDaySelector.addEventListener('change', (e) => {
      if(specificDaySelector.value === "Yes"){
        chooseDaySelector.style.display = "block";
      } else {
        chooseDaySelector.style.display = "none";
      }
    })

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
    console.log(Object.fromEntries(formData));
    if(Object.fromEntries(formData).id.length > 0){
      this.#publishEditActivity(Object.fromEntries(formData));
      this.#changeSubmitText();
    } else {
      const currentTime = new Date().toLocaleTimeString();
      const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
      const id = currentTime + "_" + randThreeDigitInt;
      const activityId = { id: id.replace(/[\s:]/g, '_') }

      this.#publishNewActivity2({
        ...Object.fromEntries(formData),
        ...activityId,
      });
    }

    this.#clearInputs();
  }

  #publishEditActivity(data){
    const hub = EventHub.getInstance();
    hub.publish(Events.SubmitEditActivity, data);

    this.#activityDB.deleteActivity(data.id)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to delete activity from ActivityDB:", error);
      });

    this.#activityDB.addActivity(data)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to add activity to ActivityDB:", error);
      });
  }

  /**
    * @param {Object} data
    */
  #publishNewActivity2(data) {
    const hub = EventHub.getInstance();
    hub.publish(Events.NewActivity, data);
    hub.publish(Events.StoreActivity, data);

    this.#activityDB.addActivity(data)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to add activity to IndexedDB:", error);
      });
  }

  // Clears the form
  #clearInputs() {
    this.#container.querySelector('form')?.reset();
    const chooseDaySelector = this.#container.querySelector('#choose-day');
    const idHiddenElement = this.#container.querySelector('#id');
    idHiddenElement.value = "";
    chooseDaySelector.style.display = "none";
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
      if(input !== null){
        input.value = val
      }
    }

    this.#changeSubmitText();
  }

  #changeSubmitText(){
    const submitButton = this.#container.querySelector('#add-activity');

    submitButton.innerText = (submitButton.innerText === "Edit Activity") ? "Add Activity" : "Edit Activity";
  }
}
