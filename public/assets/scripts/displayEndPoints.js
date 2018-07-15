const DisplayEndPoints = function(opts) {
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const endpointDisplay = document.querySelector(opts.elem);
  fetch(`${baseURL}/${opts.db}/${opts.db}.json`)
    .then(resp => resp.json())
    .then(json => getRoutes(json));

  function getRoutes(data) {
    const keys = Object.keys(data);

    endpointDisplay.innerHTML = keys
      .map(
        key =>
          `<a href="${baseURL}/${
            opts.db
          }/${key}" class="endpoint" target="_blank">${key}</a>`
      )
      .join("");
  }
};
