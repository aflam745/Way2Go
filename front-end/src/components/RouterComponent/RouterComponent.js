import { ActivityPageComponent } from "../ActivityPageComponent/ActivityPageComponent.js";
import { BaseComponent } from "../BaseComponent/BaseComponent.js";

/**
  * Router Component binds to a rootContainer and Renders
  * pages based on the URL state that is provided to it
  */
export class RouterComponent extends BaseComponent {
  /** @param {HTMLElement} rootContainer - Root conatiner */
  constructor(rootContainer) {
    super()
    /** @private */
    this.conatiner = rootContainer
    this.#attatchEventListeners() // I will deal with cleaning this up later
  }

  /** @private */
  #attatchEventListeners() {
    // Re-render the correct state when the URL changes
    addEventListener('popstate', () => this.render())
  }

  /**
    * @public
    * Renders based on the URL's pathname
    */
  render() {
    const url = new URL(window.location)

    const activityPage = new ActivityPageComponent()

    // Match based on Regex?
    switch (url.pathname) {
      case '/':
        // TODO: Replace this with the actual root page
        this.conatiner.appendChild(activityPage.render())
        break

      // Fallback should render the home page
      default:
        this.conatiner.appendChild(activityPage.render())
        break
    }
  }

}
