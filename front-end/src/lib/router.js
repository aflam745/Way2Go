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
  * into a Javascript Object
  *
  * @param {URL | Location} url 
  * @returns {Object}
  */
export function getQueryParams(url) {
  const searchParams = new URLSearchParams(url.search)
  return Object.fromEntries(searchParams)
}

/**
  * Serializes a Javascript Object as URLSearchParams
  *
  * @param {Object} obj
  * @returns {URLSearchParams}
  */
export function serializeQueryParams(obj) {
  const out = new URLSearchParams()
  for (let [key, value] of Object.entries(obj)) {
    out.append(key, value)
  }
  return out
}

/**
  * Constructs a URL from a path and URLSearchParams
  *
  * @param {string} path 
  * @param {string | URLSearchParams} params 
  */
export function constructURLFromPath(path, params) {
  const outURL = new URL(`${window.location.host}${path}?${params}`)
  return outURL
}
