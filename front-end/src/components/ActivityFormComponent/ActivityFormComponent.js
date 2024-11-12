import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class ActivityFormComponent extends BaseComponent {
  #container = null;

  constructor(){
    super();
    this.loadCSS('ActivityFormComponent');
  }

  render(){
    this.#createContainer();
    this.#attachEventListeners();
    return this.#container;
  }

  #createContainer(){
    this.#container = document.createElement('div');
    this.#container.classList.add('activity-form');
    this.#container.innerHTML = this.#getTemplate();
  }

  #getTemplate() {
    return `
      <form>
        <h2>Add New Activity</h2>

        <label for="specific-day">Must happen on specific day:</label>
        <select id="specific-day">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        <br>

        <div id="choose-day" style="display: none">
          <label for="day-selection">Select day:</label>
          <select id="day-selection">
            <option value="day-1">Day 1</option>
            <option value="day-2">Day 2</option>
            <option value="day-3">Day 3</option>
          </select>
          <br>
        </div>

        <label for="location">Name of location:</label>
        <input type="text" id="location" placeholder="Enter location">
        <br>

        <label for="address">Address:</label>
        <input type="text" id="address">
        <br>

        <label for="duration">Duration:</label>
        <input type="text" id="duration" class="time-input">
        <br>

        <label for="open-time">Opens at:</label>
        <input type="text" id="open-time" class="time-input">
        <label for="close-time">Closes at:</label>
        <input type="text" id="close-time" class="time-input">
        <br>

        <label for="notes">Notes:</label>
        <textarea id="notes"></textarea>
        <br>

        <button id="add-activity">Add Activity</button>
        <button id="clear">Clear</button>
      </form>
    `;
  }

  #attachEventListeners(){
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

    addActivityBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.#handleAddActivity(specificDay, daySelection, location, address, duration, openTime, closeTime, notes);
    });

    clearActivityBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.#clearInputs();
    });

    const hub = EventHub.getInstance();
    hub.subscribe('EditActivity', activityData => this.#fillFormEditActivity(activityData));
  }

  #handleAddActivity(specificDay, day, location, address, duration, openTime, closeTime, notes){
    this.#publishNewActivity(specificDay.value, day.value, location.value, address.value, duration.value, openTime.value, closeTime.value, notes.value)

    this.#clearInputs(specificDay, day, location, address, duration, openTime, closeTime, notes);
  }

  #publishNewActivity(specificDay, day, location, address, duration, openTime, closeTime, notes){
    const hub = EventHub.getInstance();
    hub.publish(Events.NewActivity, { specificDay, day, location, address, duration, openTime, closeTime, notes });
    hub.publish(Events.StoreActivity, { specificDay, day, location, address, duration, openTime, closeTime, notes });
  }

  #clearInputs(specificDay, day, location, address, duration, openTime, closeTime, notes){
    this.#container.querySelector('form')?.reset()
  }

  #fillFormEditActivity(activityData){
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
