// var char = document.querySelector('.infobox');
// char = [...char.children[0].children];
// var data = char.map(c => c.innerText);
// copy(data);

//http://avatar.wikia.com/wiki/Aang

const characterData = {
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
}

var aang = {
    "Name": "Aang",
    "First appearance": "The Boy in the Iceberg",
    "Last appearance": "Remembrances' (flashback)",
    "Portrayed by": "Noah Ringer (The Last Airbender)",
    "Voiced by": [
        "Zach Tyler Eisen (original series)",
        "Mitchel Musso (Unaired Pilot)",
        "Ben Helms (Nicktoons MLB)",
        "D. B. Sweeney (The Legend of Korra)"
    ],
    "Nicknames": [
        "Bonzu",
        "Pipinpadaloxicopolis the Third",
        "Twinkletoes"
    ],
    "Aliases": ["Butopak aang"],
    "Species": "Human (Spiritually linked with Raava/the Avatar Spirit)",
    "Gender": "Male",
    "Occupation": "Avatar Mediator of balance, peace, order and reconciliation",
    "Title": "The Avatar Avatar Aang",
    "Family": [" Gyatso (guardian)"],
    "Spouse": "Katara",
    "Significant others": [
        "Soulmate: Appa (animal guide)",
        "Raava/The Avatar Spirit (Deity, Spiritual personification of peace and order)",
        "Incarnation: Roku (immediate predecessor)",
        "Kyoshi (preceding Roku)",
        "Kuruk (preceding Kyoshi as Avatar, and Korra as a Water-bender Avatar)",
        "Yangchen (preceding Kuruk as Avatar, and Aang as an Air Nomad Avatar)",
        "Wan (original Avatar)",
        "Korra (Aang's immediate reincarnation)"
    ],
    "Children": [
        "Bumi (firstborn son)",
        "Kya (daughter)",
        "Tenzin (second son)"
    ],
    "Nationality": "Air Nomads",
    "Bending element": {
        "Primary": "Airbending",
        "Others": ["Earthbending", "Firebending", ",Waterbending", "Energybending"],
        "Substyles": ["Astral Projection"]
    },
    "Age": "12/112",
    "Hair color": "Dark brown (generally shaven)",
    "Eye color": "Hazel / Gray"
};

var appa = {
    "Name": "Appa",
    "First appearance": "The Boy in the Iceberg",
    "Voiced by": ["Dee Bradley Baker"],
    "Aliases": ["Sky Bison", "Wind Buffalo", "Flying Bison"],
    "Nationality": "Air Nomads",
    "Bending element": {
        "Primary": "Airbending (master)"
    },
    "Hair color": "White (with brown arrow-shaped patch of fur)",
    "Eye color": "Brown"
};

var zuko = {
    "Name": "Zuko",
    "First appearance": "The Boy in the Iceberg",
    "Portrayed by": "Dev Patel (The Last Airbender)",
    "Voiced by": [
        "Dante Basco (Avatar: The Last Airbender)",
        "Bruce Davison (The Legend of Korra)",
        "Dev Patel (The Last Airbender video game)",
        "Elijah Runcorn (Young Zuko)"
    ],
    "Aliases": [
        "The Blue Spirit (alter ego)",
        "Lee (refugee alias)",
        "Junior (refugee alias)",
        "Zuzu (nickname from Azula)"
    ],
    "Gender": "Male",
    "Family": [
        "Ozai (father)",
        "Ursa (mother)",
        "Azula (younger sister)",
        "Ikem (stepfather)",
        "Kiyi (maternal ha]lf-sister)"
    ],
    "Significant other(s)": [
        "Mai (Girlfriend)"
    ],
    "Children": ["Izumi (daughter)"],
    "Relatives": [
        "Iroh (paternal uncle)",
        "Lu Ten (first cousin)"
    ],
    "Grandfamily": [
        "Iroh Jr. (grandson)",
        "Azulon (paternal grandfather)",
        "Ilah (paternal grandmother)",
        "Jinzuk (maternal grandfather)",
        "Rina (maternal grandmother)",
        "Sozin (paternal great-grandfather)",
        "Roku (maternal great-grandfather)",
        "Ta Min (maternal great-grandmother)"
    ],
    "Nationality": "Fire Nation",
    "Bending element": {
        "Primary": ["Firebending"],
        "Sub-styles": ["Lightning redirection"]
    },
    "Age": "16",
    "Hair color": "Dark brown",
    "Eye color": "Yellow"
};

var iroh = {
    "Name": "Iroh",
    "First appearance": "The Boy in the Iceberg",
    "Last appearance": "The Ultimatum",
    "Portrayed by": "Shaun Toub (The Last Airbender)",
    "Voiced by": [
        "Mako Iwamatsu (seasons 1-2)",
        "Greg Baldwin (season 2-3, The Legend of Korra)"
    ],
    "Nicknames": [
        "Mushi (refugee alias)"
    ],
    "Aliases": [
        "The Dragon of the West"
    ],
    "Gender": "Male",
    "Family": [
        "Azulon (father)",
        "Ilah (mother)",
        "Ozai (brother)"
    ],
    "Children": [
        "Lu Ten (son)"
    ],
    "Relatives": [
        "Zuko (nephew)",
        "Azula (niece)"
    ],
    "Affinity": [
        "Jinzuk (father-in-law)",
        "Rina (mother-in-law)",
        "Ursa (sister-in-law)",
        "Roku (grandfather-in-law)",
        "Ta Min (grandmother-in-law)"
    ],
    "Grandfamily": [
        "Sozin (grandfather)",
        "Izumi (grandniece)",
        "Iroh Jr. (great-grandnephew)"
    ],
    "Nationality": "Fire Nation",
    "Bending element": {
        "Primary": "Firebending",
        "Sub-styles": ["Lightning (generation/redirection)"]
    },
    "Age": "65",
    "Hair color": "Gray",
    "Eye color": "Brown"
};

var azula = {
    "Name": "Azula",
    "First appearance": "The Storm' (Cameo) 'The Siege of the North Part 2",
    "Portrayed by": "Summer Bishil (The Last Airbender)",
    "Voiced by": ["Grey DeLisle"],
    "Gender": "Female",
    "Family": [
        "Ozai (father)",
        "Ursa (mother)",
        "Zuko (older brother)",
        "Ikem (stepfather)",
        "Kiyi (maternal ha]lf-sister)"
    ],
    "Relatives": [
        "Iroh (paternal uncle)",
        "Lu Ten (cousin)",
        "Izumi (niece)"
    ],
    "Grandfamily": [
        "Azulon (paternal grandfather)",
        "Ilah (paternal grandmother)",
        "Jinzuk (maternal grandfather)",
        "Rina (maternal grandmother)",
        "Sozin (paternal great-grandfather)",
        "Roku (maternal great-grandfather)",
        "Ta Min (maternal great-grandmother)",
        "Iroh Jr. (grandnephew)"
    ],
    "Nationality": "Fire Nation",
    "Bending element": {
        "Primary": "Firebending",
        "Sub-styles": [
            "Lightning creation"
        ],
    },
    "Age": "14",
    "Hair color": "Dark Brown",
    "Eye color": "Gold"
};

var katara = {
    "Name": "Katara",
    "First appearance": "The Boy in the Iceberg",
    "Portrayed by": [
        "Nicola Peltz (The Last Airbender)"
    ],
    "Voiced by": [
        "Mae Whitman (Avatar: The Last Airbender)",
        "Eva Marie Saint (The Legend of Korra)"
    ],
    "Full name": "Katara",
    "Nickname": [
        "Miss Know-it-All",
        "Queen of the Twigs",
        "Madame Fussy Britches",
        "Sweetness Sugar Queen (nicknamed by Toph Beifong)"
    ],
    "Aliases": [
        "Kat The Painted",
        "Lady Sapphire Fire"
    ],
    "Gender": "Female",
    "Family": [
        "Hakoda (father)",
        "Kya (mother)",
        "Sokka (older brother)",
        "Spous]e(s)",
        "Aang (The Last Airbender)"
    ],
    "Children": [
        "Bumi (firstborn son)",
        "Kya (daughter)",
        "Tenzin (second son)"
    ],
    "Relatives Affinity": [
        "Pema (daughter-in-law)",
    ],
    "Grandfamily": [
        "Kanna (paternal grandmother)",
        "Pakku (step-grandfather)",
        "Jinora (granddaughter)",
        "Ikki (granddaughter)",
        "Meelo (grandson)",
        "Rohan (grandson)"
    ],
    "Nationality": "Southern Water Tribe",
    "Bending element": {
        "Primary": "Waterbending",
        "Sub-styles": [
            "Bloodbending (disavowed)",
            "Healing abilities",
        ]
    },
    "Age": "14",
    "Hair color": "Brown",
    "Eye color": "Blue"
};

var sokka = {
    "Name": "Sokka",
    "First appearance": "The Boy in the Iceberg",
    "Portrayed by": "Jackson Rathbone (The Last Airbender)",
    "Voiced by": [
        "Jack DeSena (original series)",
        "Chris Hardwick (The Legend of Korra)"
    ],
    "Aliases": [
        "Wang Fire Snoozles",
        "Master Swish"
    ],
    "Family": [
        "Hakoda (father)",
         "Kya (mother)",
         "Katara (younger sister)"
        ],
    "Significant other": [
     "Suki (girlfriend)",
     "Yue (love interest)"
    ],
    "Relatives": [
        "Bumi (nephew)",
        "Kya (niece)",
        "Tenzin (nephew)"
    ],
    "Affinity": [
        "Aang (brother-in-law)"
    ],
    "Grandfamily": [
        "Kanna (paternal grandmother)",
        "Pakku (step-grandfather)",
        "Jinora (grandniece)",
        "Ikki (grandniece)",
        "Meelo (grandnephew)",
        "Rohan (grandnephew)"
    ],
    "Nationality": "Southern Water Tribe",
    "Bending element": {
        "Primary": "None"
    },
    "Age": "15"
};

var toff = {
    "Name": "Toph Beifong",
    "First appearance": "The Blind Bandit",
    "Last appearance": "Operation Beifong",
    "Voiced by": [
        "Jessie Flower (child)",
        "Kate Higgins (adult)",
        "Philece Sampler (senior)"
    ],
    "Aliases": [
        "The Blind Bandit",
        "The Runaway",
        "Chief"
    ],
    "Gender": "Female",
    "Family": [
        "Lao Beifong (father)","Poppy Beifong (mother)"
    ],
    "Significant others": [
        "Kanto (lover; Lin's father)"
    ],
    "Children": [
        "Lin Beifong (daughter)",
        "Suyin Beifong (daughter)",
    ],
    "Relatives": [],
    "Affinity": [
        "Bataar (son-in-law)"
    ],
    "Grandfamily": [
        "Bataar Jr. (grandson)",
        "Huan (grandson)",
        "Opal (granddaughter)",
        "Wei and Wing (grandsons)"
    ],
    "Nationality": "Earth Kingdom",
    "Bending element": {
        "Primary": "Earthbending",
        "Sub-styles": [
            "Metalbending",
            "Sandbending"
        ],
    },
    "Age": "12",
    "Hair color": "Black White (as an old woman)",
    "Eye color": "Light gray (blind)"
};