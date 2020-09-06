module.exports = [
  {
    id: 1,
    title: "Futurama",
    longDesc:
      "If you are a Futurama fan, then this api is for you. Here you can find everything from Episodes to Characters to Trivia Questions, and even some of the Products featured on the show.",
    desc:
      "An API with characters, episode listing, species, planets, and trivia questions.",
    link: "futurama",
    graphLink: "futurama/graphql",
    endPoints: [
      "info",
      "characters",
      "cast",
      "episodes",
      "questions",
      "inventory",
    ],
    sampleCode: " \n fetch('https://sampleapis.com/futurama/api/characters')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name.first);\n        }\n      );\n  });"
  },
  {
    id: 2,
    title: "Avatar",
    longDesc:
      "If you are an Avatar fan, then this api is for you. Here you can find everything from Episodes to Characters to Trivia Questions and more.",
    desc: "An API with characters, episode listings, and trivia questions.",
    link: "avatar",
    graphLink: "avatar/graphql",
    endPoints: ["info", "characters", "episodes", "questions"],
  },
  {
    id: 3,
    title: "Baseball",
    longDesc:
      "Baseball fans? Computer nerds? Now, in one place, you have baseball data and an api to access it. Have fun!",
    desc: "An API with records and trivia questions.",
    link: "baseball",
    graphLink: "baseball/graphql",
    endPoints: ["hits", "era", "stolenBases", "homeRuns", "battingAvgs", "rbi"],
    sampleCode: " \n fetch('https://sampleapis.com/avatar/api/characters')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.Name);\n        }\n      );\n  });"
  },
  {
    id: 4,
    title: "Recipes",
    longDesc:
      "Because everyone is making a recipe app to learn to code. So, here is some data.",
    desc: "A recipe database",
    link: "recipes",
    graphLink: "recipes/graphql",
    endPoints: ["recipes"],
    sampleCode: " \n fetch('https://sampleapis.com/baseball/api/hits')\n .then(response => response.json())\n      .then(data =>  {\n        data.singleSeason.map(c => \n        {\n         console.log(c.Player);\n        }\n      );\n  });"
  },
  {
    id: 5,
    title: "FakeBank",
    longDesc:
      "Building an app that needs some bake transactions? Well, look no further. Here are what Fry's bank statements might look like from the future.",
    desc: "Just a random set of fake bank data.",
    link: "fakebank",
    graphLink: "fakebank/graphql",
    endPoints: ["Accounts"],
    sampleCode: " \n fetch('https://sampleapis.com/fakebank/api/Accounts')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.Description);\n        }\n      );\n  });"
  },
  {
    id: 6,
    title: "Football",
    longDesc:
      "Football fans? Computer nerds? Now, in one place, you have football data and an api to access it. Have fun!",
    desc: "An API with records and trivia questions.",
    link: "football",
    graphLink: "football/graphql",
    endPoints: ["passing-yards", "passing-td"],
    sampleCode: " \n fetch('https://sampleapis.com/football/api/passing-yards')\n .then(response => response.json())\n      .then(data =>  {\n        data.single-season.map(c => \n        {\n         console.log(c.Description);\n        }\n      );\n  });"
  },
  {
    id: 7,
    title: "Countries",
    longDesc:
      "Who doesn't need to get the dreaded long list of countries, codes, capitals, etc. every other week? You can get them all right here.",
    desc: "An API with information about countries.",
    link: "countries",
    graphLink: "countries/graphql",
    endPoints: ["name", "capital", "phone", "currency", "population", "flags"],
    sampleCode: " \n fetch('https://sampleapis.com/countries/api/population')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c);\n        }\n      );\n  });"
  },
  {
    id: 8,
    title: "Presidents",
    longDesc:
      "Millions of peaches! No...not those Presidents. You're practicing API calls, why not learn a little bit about United States history in the process? Here we have a collection of all the US Presidents. Updated every 4-8 years.",
    desc: "Millions of peaches! No...not those Presidents...",
    link: "presidents",
    graphLink: "presidents/graphql",
    endPoints: ["presidents"],
    sampleCode: " \n fetch('https://sampleapis.com/presidents/api/presidents')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 9,
    title: "Simpsons",
    longDesc:
      "Because who doesn't need easily accessible data about the simpsons?",
    desc: "Because who doesn't need easily accessible data about the simpsons?",
    link: "simpsons",
    graphLink: "simpsons/graphql",
    endPoints: ["characters", "products"],
    sampleCode: " \n fetch('https://sampleapis.com/simpsons/api/characters')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 11,
    title: "Movies",
    longDesc: "Movies.",
    desc: "Movies.",
    link: "movies",
    graphLink: "movies/graphql",
    endPoints: [
      "action-adventure",
      "animation",
      "classic",
      "comedy",
      "drama",
      "horror",
      "family",
      "mystery",
      "scifi-fantasy",
      "western",
    ],
    sampleCode: " \n fetch('https://sampleapis.com/movies/api/comedy')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.title);\n        }\n      );\n  });"
  },
  {
    id: 12,
    title: "Wines",
    longDesc: "Wines.",
    desc: "Wines",
    link: "wines",
    graphLink: "wines/graphql",
    endPoints: ["reds", "whites", "sparkling", "rose", "desert", "port"],
    sampleCode: " \n fetch('https://sampleapis.com/wines/api/reds')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.wine);\n        }\n      );\n  });"
  },
  {
    id: 13,
    title: "Health",
    longDesc:
      "Sometimes health data is hard to come by. This endpoints make it easy for you to test your apps with examples of health data such as medical professions.",
    desc: "An API with health and medical information",
    link: "health",
    graphLink: "health",
    endPoints: ["professions"],
    sampleCode: " \n fetch('https://sampleapis.com/health/api/professions')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.short_name);\n        }\n      );\n  });"
  },
  {
    id: 13,
    title: "Beers",
    longDesc: "Beers.",
    desc: "Beers",
    link: "beers",
    graphLink: "beers/graphql",
    endPoints: ["ale", "stout", "red-ale"],
    sampleCode: " \n fetch('https://sampleapis.com/beers/api/ale')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 14,
    title: "Switch Games",
    longDesc:
      "Figured it would be a cool db to have various video games on the Switch.",
    desc: "Figured it would be fun to have a Switch game list on here.",
    link: "switch",
    graphLink: "switch/graphql",
    endPoints: ["games"],
    sampleCode: " \n fetch('https://sampleapis.com/switch/api/games')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 15,
    title: "PlayStation Games",
    longDesc:
      "Figured it would be a cool db to have various video games on the PlayStation 4.",
    desc: "Figured it would be fun to have a PlayStation game list on here.",
    link: "playstation",
    graphLink: "playstation/graphql",
    endPoints: ["games"],
    sampleCode: " \n fetch('https://sampleapis.com/playstation/api/games')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 16,
    title: "XBox Games",
    longDesc:
      "Figured it would be a cool db to have various video games on the XBox.",
    desc: "Figured it would be fun to have a Xbox game list on here.",
    link: "xbox",
    graphLink: "xbox/graphql",
    endPoints: ["games"],
    sampleCode: " \n fetch('https://sampleapis.com/xbox/api/games')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.name);\n        }\n      );\n  });"
  },
  {
    id: 17,
    title: "Typer",
    longDesc: "A place to hold lessons for Typer",
    desc: "A place to hold lessons for Typer",
    link: "typer",
    graphLink: "typer/graphql",
    endPoints: ["welcomeQuestions", "webLessons", "typingLessons"],
    sampleCode: " \n fetch('https://sampleapis.com/typer/api/webLessons')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.title);\n        }\n      );\n  });"
  },
  {
    id: 18,
    title: "CSS Color Names",
    longDesc:
      "Thought it would be cool to include different CSS Colors Names. I was inspired when I found this site, https://xkcd.com/color/rgb/.",
    desc: "A list of CSS Color Names",
    link: "css-color-names",
    graphLink: "css-color-names/graphql",
    endPoints: ["colors"],
    sampleCode: " \n fetch('https://sampleapis.com/css-color-names/api/colors')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.title);\n        }\n      );\n  });"
  },
  {
    id: 19,
    title: "The United States",
    longDesc:
      "Info about the all the 50 states in the United States. The endpoint includes the name, abbreviation, capital, largest city, date admitted to union, population, and state flag.",
    desc: "Info about the all the 50 states in the United States.",
    link: "the-states",
    graphLink: "the-states/graphql",
    endPoints: ["the-states"],
    sampleCode: " \n fetch('https://sampleapis.com/the-states/api/the-states')\n .then(response => response.json())\n      .then(data =>  {\n        data.map(c => \n        {\n         console.log(c.title);\n        }\n      );\n  });"
   },
   {
	id: 20,
	title: "Cartoons",
	longDesc: "If cartoons is what you like then boy do we have a full list of all the cartoons from the past and present and all their details including a amazingly sourced image to showcase",
	desc: "A list of Cartoons from your past.",
	link: "cartoons",
	graphLink: "cartoons/graphql",
	endPoints: ["2D", "3D",],
	sampleCode: " \n fetch('https://sampleapis.com/cartoons/api/2D')\n .then(response => response.json())\n .then(data => {\n data.map(c => \n {\n console.log(c.title);\n }\n );\n });"
	},
];
