/**
 * DisplayEndPoints
 *
 * @param {Object} opts    References to specific page and database file
 * @param {elem} opts.elem Dom Element or CSS string
 * @param {db} opts.db     Name of database file
 */
const DisplayEndPoints = function(opts) {
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const endpointDisplay =
    typeof opts.elem == "string"
      ? document.querySelector(opts.elem)
      : opts.elem;
  const apiURL = `${baseURL}/${opts.db}/${opts.db}.json`;
  fetch(apiURL)
    .then(resp => resp.json())
    .then(json => getRoutes(json));

  function getRoutes(data) {
    const keys = Object.keys(data);
    endpointDisplay.innerHTML = keys
      .map(
        key => `<a 
          href="${baseURL}/${opts.db}/api/${key}"
          class="endpoint" target="_blank">
            ${key}
        </a>`
      )
      .join("");
  }
};
