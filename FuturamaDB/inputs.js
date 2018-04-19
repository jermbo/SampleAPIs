console.clear();
const inputs = document.querySelectorAll('[type="text"], textarea'),
  submitBtn = document.querySelector('#submit'),
  displayBtn = document.querySelector('#display');
let finalObj = {},
  fakeData = {
    name: {
      first: 'jermbo',
      middle: 't',
      last: 'last',
    },
    just: {
      for: {
        random: 'test',
        fun: {
          final: {
            thing: 'WHAT UP',
            thing2: 'asdsd',
          },
        },
      },
    },
    info: {
      age: 22,
      gender: 'm',
      species: 'human',
    },
    occupation: 'developer',
    sayings: [
      'this is a story all about how',
      'my life got flipped, turned upside down',
      'and id like to take a minute just sitting right there',
      'ill tell you how i became the prince of bel air',
    ],
  };

submitBtn.addEventListener('click', getValues);
displayBtn.addEventListener('click', displayValues);

function getValues() {
  inputs.forEach(input => {
    // console.dir(input.type)
    if (input.type == 'textarea') {
      finalObj[input.name] = input.value.split('; ');
    } else {
      // https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
      const keys = input.name.split('.');
      const lastKey = keys.pop();
      const lastObj = keys.reduce((obj, key) => {
        return obj[key] = obj[key] || {};
      }, finalObj);
      lastObj[lastKey] = input.value;
    }
  });
  console.info(JSON.stringify(finalObj));
  fetch('http://localhost:4000/characters', {
    method: 'POST',
    body: JSON.stringify(finalObj),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      console.info('Success:', response);
      finalObj = {};
      resetUI();
    });
}

function resetUI() {
  inputs.forEach(input => {
    input.value = '';
  });
}

// displayValues();
// getValues();

function displayValues() {
  inputs.forEach(input => {
    if (input.type == 'textarea') {
      input.value = fakeData[input.name].map((val, i) => (i < fakeData[input.name].length - 1) ? `${val}; ` : val).join('');
    } else {
      const keys = input.name.split('.');
      input.value = keys.reduce((prev, curr) => prev ? prev[curr] : null, fakeData);
    }
  });
}
