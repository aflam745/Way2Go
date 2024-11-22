import { BaseComponent } from "../BaseComponent/BaseComponent.js";

// TODO: String manipulation for URL?

/**
  * Router Component binds to a rootContainer and Renders
  * pages based on the URL state that is provided to it.
  * The router is static so router parameters do not work.
  */
export class RouterComponent extends BaseComponent {
  /** 
    * @param {HTMLElement} rootContainer - Root conatiner 
    * @param {Map<string, BaseComponent>} routes
    * @param {BaseComponent?} layout
    */
  constructor(rootContainer, routes, layout = null) {
    super()
    /** 
      * @type {Element}
      * @private 
      */
    this.conatiner = rootContainer

    /** @type {Map<string, BaseComponent>} */
    this.routes = routes

    this.layout = layout

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
    // Match based on Regex?

    /** @type {BaseComponent} */
    const component = this.routes.get(url.pathname) ?? this.routes.get('/')


    if (this.layout != null) {
      this.conatiner.replaceChildren(
        this.layout.render(
          component.render()
        )
      )
    } else {
      this.conatiner.replaceChildren(
        component.render()
      )
    }

    return this.conatiner
  }
}
