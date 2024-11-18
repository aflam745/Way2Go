import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ActivityFormComponent } from "../ActivityFormComponent/ActivityFormComponent.js";
import { ActivityListComponent } from "../ActivityListComponent/ActivityListComponent.js";

export class ActivityPageComponent extends BaseComponent {
    #container = null;

    constructor(){
        super();
        this.loadCSS('ActivityPageComponent');
    }

    render(){
        // Create the main container
        this.#createContainer();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('activity-page');

        const activityForm = new ActivityFormComponent();
        const activityList = new ActivityListComponent();

        this.#container.appendChild(activityForm.render());
        this.#container.appendChild(activityList.render());
    }
}
