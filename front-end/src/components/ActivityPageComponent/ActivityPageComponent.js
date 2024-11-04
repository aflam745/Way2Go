import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class ActivityPageComponent extends BaseComponent {
    #container = null;

    constructor(){
        super();
    }

    render(){
    // Create the main container
    this.#container = document.createElement('div');

    return this.#container;
    }
}
