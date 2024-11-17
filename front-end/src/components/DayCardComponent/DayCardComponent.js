import { BaseComponent } from "../BaseComponent/BaseComponent";
import { Itinerary } from "../../Models/Itinerary";

import { Activity } from './Activity.js';


export class DayCardComponent extends BaseComponent {
    constructor(day, activities = [], itinerary) {
        super();
        this.day = day;
        this.activities = activities.filter(activity => activity.day === day);
        this.itinerary = itinerary; // Only for editing activities
        this.element = null;
    }

    #createContainer() {
        this.element = document.createElement('div');
        this.element.classList.add('day-card');
    }

    #createCardContents() {
        const header = document.createElement('h2');
        header.textContent = `Activities for ${this.day}`;
        this.element.appendChild(header);

        if (this.activities.length === 0) {
            const noActivitiesMessage = document.createElement('p');
            noActivitiesMessage.textContent = 'No activities for this day.';
            this.element.appendChild(noActivitiesMessage);
        } else {
            const activitiesList = document.createElement('ul');
            this.activities.forEach(activity => {
                const activityItem = document.createElement('li');
                activityItem.classList.add('activity-item');

                const activityContent = document.createElement('div');
                activityContent.classList.add('activity-content');
                activityContent.innerHTML = `
                    <strong>${activity.name}</strong>
                    <p>${activity.location ? activity.location.name : 'No location specified'}</p>
                    <p>Duration: ${activity.duration} hours</p>
                    <p>Start Time: ${activity.startTime}</p>
                    <p>Finish Time: ${activity.finishTime}</p>
                    <p>${activity.notes || ''}</p>
                `;

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('activity-buttons');

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.addEventListener('click', () => this.editActivity(activity));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.addEventListener('click', () => this.deleteActivity(activity.id));

                buttonsContainer.appendChild(editButton);
                buttonsContainer.appendChild(deleteButton);

                activityItem.appendChild(activityContent);
                activityItem.appendChild(buttonsContainer);

                activitiesList.appendChild(activityItem);
            });
            this.element.appendChild(activitiesList);
        }
    }

    render() {
        this.#createContainer()
        this.#createCardContents()
        return this.element;
    }


    editActivity(activity) {
        // Step 1: Create an instance of ActivityForm and pass in the current activity data
        const form = new ActivityForm({
            name: activity.name,
            location: activity.location ? activity.location.name : '',  // assuming location is an object
            notes: activity.notes
        });

        // Step 2: Set up a callback to handle the form submission
        form.onSubmit = (updatedActivityData) => {
            // Step 3: Update the activity with the new values from the form
            activity.name = updatedActivityData.name;
            activity.location.name = updatedActivityData.location;
            activity.notes = updatedActivityData.notes;

            // Step 4: Update the activity in the itinerary
            this.itinerary.updateActivity(activity.id, {
                name: activity.name,
                location: activity.location,
                notes: activity.notes
            });

            // Step 5: Re-render the component to reflect the updated activity
            this.element.innerHTML = '';  // Clear the current content
            this.render();  // Re-render the component with the updated activity
        };

        // Step 6: Display the form (this will render the form as part of the component)
        form.render();
    }


    deleteActivity(activityId) {
        this.itinerary.deleteActivity(activityId);

        // Optimistic loading
        this.activities = this.activities.filter(activity => activity.id !== activityId);

        this.element.innerHTML = '';
        this.render();
    }


}
