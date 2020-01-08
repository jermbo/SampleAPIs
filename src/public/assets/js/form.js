console.clear();
const inputs = document.querySelectorAll('[type="text"], select, textarea');
const submitBtn = document.querySelector("#submit");
let finalObj = {};

const baseURL = "http://localhost:5000";
const topic = "simpsons";
const section = "products";
const url = `${baseURL}/${topic}/${section}`;

submitBtn.addEventListener("click", getValues);

function getValues() {
  inputs.forEach(input => {
    const keys = input.name.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce(
      (obj, key) => (obj[key] = obj[key] || {}),
      finalObj
    );
    lastObj[lastKey] = input.value;
  });
  fetch(url, {
    method: "POST",
    body: JSON.stringify(finalObj),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      resetForm();
    });
}

function resetForm() {
  inputs.forEach(input => {
    if (input.type != "select-one") {
      input.value = "";
    }
  });
}
