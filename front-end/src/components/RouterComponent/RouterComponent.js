import { BaseComponent } from "../BaseComponent/BaseComponent";

export class RouterComponent extends BaseComponent {
  /** @param {HTMLElement} rootContainer - Root conatiner */
  constructor(rootContainer) {
    super()
    // NOTE: We probably don't need to load component
    this.loadCSS('RouterComponent')


    /** @private */
    this.conatiner = rootContainer
    this.#attatchEventListeners() // I will deal with cleaning this up later
  }

  /** @private */
  #attatchEventListeners() {
    addEventListener('popstate', () => this.render())
  }

  /**
    * @public
    * Renders based on the URL's pathname
    */
  render() {
    // Match based on Regex?
    const url = new URL(window.location)
    switch (url.pathname) {
      case '/':
        this.conatiner.appendChild(activityPage.render())

      // Fallback should render the home page
      default:
        this.conatiner.appendChild(activityPage.render())
    }
  }

}
