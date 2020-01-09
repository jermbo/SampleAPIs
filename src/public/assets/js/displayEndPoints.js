/**
 * DisplayEndPoints
 *
 * @param {Object} opts    References to specific page and database file
 * @param {elem} opts.elem Dom Element or CSS string
 * @param {db} opts.db     Name of database file
 */
const DisplayEndPoints = function({ elem, db }) {
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const endpointDisplay =
    typeof elem == "string" ? document.querySelector(elem) : elem;
  const apiURL = `${baseURL}/${db}/api`;
  console.log(apiURL);
  fetch(apiURL)
    .then(resp => {
      return resp.json();
    })
    .then(json => getRoutes(json));

  function getRoutes(data) {
    const keys = Object.keys(data);
    endpointDisplay.innerHTML = keys
      .map(
        key => `<a 
          href="${baseURL}/${db}/api/${key}"
          class="endpoint" target="_blank">
            ${key}
        </a>`
      )
      .join("");
  }
};
