 /*
  * Navigates to the URL triggering a popstate event 
  * for the router to properly re-render the page
  */
export function navigate(path) {
  const url = new URL(path, window.location)
  window.history.pushState({}, "", url)
}
