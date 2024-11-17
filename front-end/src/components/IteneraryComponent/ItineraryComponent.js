import { BaseComponent } from "../BaseComponent/BaseComponent";

export class IteneraryComponent extends BaseComponent {
    #container = null;

    constructor(){

    }

    render(){
        //Create the main container
        this.#container = document.createElement('div');
        
    }
}
