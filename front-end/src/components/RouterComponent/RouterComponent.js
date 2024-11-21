import { ActivityPageComponent } from "../ActivityPageComponent/ActivityPageComponent.js";
import { BaseComponent } from "../BaseComponent/BaseComponent.js";

// TODO: String manipulation for URL?

/**
  * Router Component binds to a rootContainer and Renders
  * pages based on the URL state that is provided to it
  */
export class RouterComponent extends BaseComponent {
  /** @param {HTMLElement} rootContainer - Root conatiner */
  /** @param {Map<string, BaseComponent>} routes  */
  constructor(rootContainer, routes) {
    super()
    /** 
      * @type {Element}
      * @private 
      */
    this.conatiner = rootContainer

    /** @type {Map<string, BaseComponent>} */
    this.routes = routes

    if (!this.routes.has('/')) {
      throw Error("Must contain a route with pattern '/'")
    }

    this.#attatchEventListeners() // I will deal with cleaning this up later
  }

  /** @private */
  #attatchEventListeners() {
    // Re-render the correct state when the URL changes
    addEventListener('popstate', () => this.render(window.location))
  }

  /**
    * @public
    * Renders based on the URL's pathname
    * @param {Location | URL} url 
    */
  render(url) {
    // Before rendering the new page the old page needs to be cleared
    // this.conatiner.replaceChildren()

    // Match based on Regex?
    /** @type {BaseComponent} */
    const component = this.routes.get(url.pathname) ?? this.routes.get('/')

    this.conatiner.replaceChildren(
      component.render()
    )
  }

}
