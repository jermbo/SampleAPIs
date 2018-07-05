const DeepObjects = function(){
    const UI = {
        inputs: '[type="text"], textarea',
        submitBtn: '#submit',
        displayBtn: '#display'
    }
    const finalObj = {};
    const fakeData = {
        bio: {
            name: 'Aang',
            alternativeNames: ['Kuzon', 'Twinkel Toes', 'Sweetie'],
            nationality: 'Southern Air Tempel',
            ethnicity: 'Air Nomad',
            born: '12 BG',
            died: '152 AG',
        },
        physicialDescription : {
            gender: 'Male',
            eyeColor: 'Gray',
            hairColor: 'Dark Brown',
            skinColor: 'Light',
            images: ['https://vignette.wikia.nocookie.net/avatar/images/a/ae/Aang_at_Jasmine_Dragon.png/revision/latest?cb=20130612174003']
        },
        personalInformation: {
            weapons: ['Glider Staff', 'The Elements'],
            fightingStyles: ['Airbending', 'Waterbending', 'Earthbending', 'Firebending', 'Energybending']
        }
    };

    const inputs = document.querySelectorAll(UI.inputs);
    const submitBtn = document.querySelector(UI.submitBtn);
    const displayBtn = document.querySelector(UI.displayBtn);

    function init(){
        addEventListeners();
    }

    function addEventListeners() {
        submitBtn.addEventListener('click', getValues);
        submitBtn.addEventListener('click', displayValues);
    }

    function getValues(e){
        e.preventDefault();
        inputs.forEach(input => {
            const keys = input.name.split('.');
            const lastKey = keys.pop();
            const lastObj = keys.reduce((obj, keys) => obj[key] = obj[key] || {}, finalObj);

            if(input.type == 'textarea' ){
                lastObj[lastKey] = input.value.split('; ');
            } else {
                lastObj[lastKey] = input.value;
            }
        });
    }

    function displayValues(e){
        e.preventDefault();
        inputs.forEach(input => {
            const keys = input.name.split('.');
            const value = keys.reduce((prev, curr) => prev ? prev[curr] : null, fakeData);

            if ( Array.isArray(value) ) {
                input.value = value.map((val,i) => (i < value.length - 1) ? `${val}; ` : val );
            } else {
                input.value = value;
            }
        });
    }

    init();

    return {

    }
};