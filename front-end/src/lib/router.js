 /**
  * Navigates to the URL triggering a popstate event 
  * for the router to properly re-render the page
  *
  * @param {string} path
  */
export function navigate(path) {
  const url = new URL(path, window.location)
  history.pushState({}, "", url)
  history.go()
}


/**
  * Takes the query params from a URL and transforms them 
  * into 
  *
  * @param {URL | Location} url 
  * @returns {any}
  */
export function getQueryParams(url) {
  const searchParams = new URLSearchParams(url.search)
  return Object.fromEntries(searchParams)
}

/**
  * @param {string} path 
  * @param {string | URLSearchParams} params 
  */
export function constructURLFromPath(path, params) {
  const outURL = new URL(`${window.location.host}${path}?${params}`)
  return outURL
}
