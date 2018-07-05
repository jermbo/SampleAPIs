console.clear();
const DeepObjects = function (opts) {
  const inputs = document.querySelectorAll(opts.inputs);
  let finalObj;

  function getValues() {
    finalObj = {};
    inputs.forEach(input => {
      const keys = input.name.split(".");
      const lastKey = keys.pop();
      const lastObj = keys.reduce(
        (obj, key) => (obj[key] = obj[key] || {}),
        finalObj
      );

      if (input.type == "checkbox") {
        if (!input.checked) return;
        if (!lastObj[lastKey]) lastObj[lastKey] = [];
        lastObj[lastKey].push(input.value);
        return;
      }

      if (input.type == "radio") {
        if (!input.checked) return;
        lastObj[lastKey] = input.value;
        return;
      }

      if (input.type == "textarea") {
        lastObj[lastKey] = input.value.split("; ");
        return;
      }

      lastObj[lastKey] = input.value;
    });

    return finalObj;
  }

  function displayValues(data) {
    inputs.forEach(input => {
      const keys = input.name.split(".");
      const value = keys.reduce(
        (prev, curr) => (prev ? prev[curr] : null),
        data
      );

      if (input.type == "radio") {
        if (input.value != value) return;
        input.checked = true;
        return;
      }

      if (input.type == "checkbox") {
        value.forEach(v => {
          if (input.value != v) return;
          input.checked = true;
          return;
        });
        return;
      }

      if (input.type == "textarea") {
        if (Array.isArray(value)) {
          input.value = value
            .map((val, i) => (i < value.length - 1 ? `${val}; ` : val))
            .join("");
          return;
        }
      }

      if (Array.isArray(value)) {
        input.value = value
          .map((val, i) => (i < value.length - 1 ? `${val}; ` : val))
          .join("");
        return;
      }

      input.value = value;
    });
  }

  function submitData(opts) {
    const data = getValues();
    console.log(data);
    $.ajax({
        method: opts.method,
        url: opts.url,
        data: data,
        type: 'application/json',
        beforeSend: function () {
          console.log('sending data');
        }
      })
      .done(function (data) {
        console.log(data);
      })
      .fail(function (err) {
        console.log(err)
      });
  }

  return {
    submitData: submitData,
    getValues: getValues,
    displayValues: displayValues
  };
};

