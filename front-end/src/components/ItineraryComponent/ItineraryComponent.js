import { BaseComponent } from "../BaseComponent/BaseComponent";

export class ItineraryComponent extends BaseComponent {
    #container = null;

    constructor(){
        super();
        this.loadCSS('ItineraryComponent.')
    }

    render(){
        //Create the main container
        this.#container = document.createElement('div');
        
    }
}
