module.exports = [
  {
    name: "avatar",
    link: "avatar",
    metaData: {
      title: "Avatar",
      longDesc:
        "If you are an Avatar fan, then this api is for you. Here you can find everything from Episodes to Characters to Trivia Questions and more.",
      desc: "An API with characters, episode listings, and trivia questions.",
      featured: false,
      categories: ["cartoon", "tv", "entertainment", "quiz"],
    },
    endpoints: ["info", "characters", "episodes", "questions"],
  },
  {
    name: "baseball",
    link: "baseball",
    metaData: {
      title: "Baseball",
      longDesc:
        "Baseball fans? Computer nerds? Now, in one place, you have baseball data and an api to access it. Have fun!",
      desc: "An API with records and trivia questions.",
      featured: false,
      categories: ["sports", "stats"],
    },
    endpoints: [
      "hitsSingleSeason",
      "hitsCareer",
      "eraSingleSeason",
      "eraCareer",
      "stolenBasesSingleSeason",
      "stolenBasesCareer",
      "battingAvgsSingleSeason",
      "battingAvgsCareer",
      "rbiSingleSeason",
      "rbiCareer",
    ],
  },
  {
    name: "beers",
    link: "beers",
    metaData: {
      title: "Beers",
      longDesc: "Beers.",
      desc: "Beers",
      featured: true,
      categories: ["food & beverage", "list"],
    },
    endpoints: ["ale", "stouts", "red-ale"],
  },
  {
    name: "cartoons",
    link: "cartoons",
    metaData: {
      title: "Cartoons",
      longDesc:
        "If cartoons is what you like then boy do we have a full list of all the cartoons from the past and present and all their details including a amazingly sourced image to showcase",
      desc: "A list of Cartoons from your past.",
      featured: false,
      categories: ["tv", "entertainment", "list"],
    },
    endpoints: ["cartoons2D", "cartoons3D"],
  },
  {
    name: "codingresources",
    link: "codingresources",
    metaData: {
      title: "Coding Resources",
      longDesc:
        "Women Who Code.com is an amazing community and organization. They have an amazing resource in https://www.womenwhocode.com/resources. Here you'll find their 170 resources in an API for easy search, list and share. Please give a link BACK to WomenWhoCode.com if you use this information.",
      desc: "API for all coding resources from womenwhocode.com/resources",
      featured: true,
      categories: ["list", "education", "coding"],
    },
    endpoints: ["codingResources"],
  },
  {
    name: "coffee",
    link: "coffee",
    metaData: {
      title: "Coffee",
      longDesc: "Basic list of descriptions and ingredients used for the most popular coffee drinks",
      desc: "API for popular coffee drinks",
      featured: true,
      categories: ["food & beverage", "list"],
    },
    endpoints: ["hot", "iced"],
  },
  {
    name: "countries",
    link: "countries",
    metaData: {
      title: "Countries",
      longDesc:
        "Who doesn't need to get the dreaded long list of countries, codes, capitals, etc. every other week? You can get them all right here.",
      desc: "An API with information about countries.",
      featured: false,
      categories: ["list"],
    },
    endpoints: ["countries"],
  },
  {
    name: "csscolornames",
    link: "csscolornames",
    metaData: {
      title: "CSS Color Names",
      longDesc:
        "Thought it would be cool to include different CSS Colors Names. I was inspired when I found this site, https://xkcd.com/color/rgb/.",
      desc: "A list of CSS Color Names",
      featured: false,
      categories: ["list"],
    },
    endpoints: ["colors"],
  },
  {
    name: "fakebank",
    link: "fakebank",
    metaData: {
      title: "FakeBank",
      longDesc:
        "Building an app that needs some bake transactions? Well, look no further. Here are what Fry's bank statements might look like from the future.",
      desc: "Just a random set of fake bank data.",
      featured: false,
      categories: ["bank"],
    },
    endpoints: ["accounts"],
  },
  {
    name: "football",
    link: "football",
    metaData: {
      title: "Football",
      longDesc:
        "Football fans? Computer nerds? Now, in one place, you have football data and an api to access it. Have fun!",
      desc: "An API with records and trivia questions.",
      featured: false,
      categories: ["sports", "stats"],
    },
    endpoints: ["passingyards-singleseason", "passingyards-career", "passingtd-singleseason", "passingtd-career"],
  },
  {
    name: "futurama",
    link: "futurama",
    metaData: {
      title: "Futurama",
      longDesc:
        "If you are a Futurama fan, then this api is for you. Here you can find everything from Episodes to Characters to Trivia Questions, and even some of the Products featured on the show.",
      desc: "An API with characters, episode listing, species, planets, and trivia questions.",
      featured: true,
      categories: ["cartoon", "tv", "entertainment", "quiz", "inventory"],
      examples: [
        { hash: "ZEeybwX", title: "Inventory Vanilla", endpoint: "inventory" },
        { hash: "vyGrmG", title: "Vue - Futurama Quiz", endpoint: "questions" },
        { hash: "LYVwbZG", title: "jQuery - Futurama Quiz", endpoint: "questions" },
      ],
    },
    endpoints: ["info", "characters", "cast", "episodes", "questions", "inventory"],
  },
  {
    name: "health",
    link: "health",
    metaData: {
      title: "Health",
      longDesc:
        "Sometimes health data is hard to come by. This endpoints make it easy for you to test your apps with examples of health data such as medical professions.",
      desc: "An API with health and medical information",
      featured: false,
      categories: ["list"],
    },
    endpoints: ["professions"],
  },
  {
    name: "movies",
    link: "movies",
    metaData: {
      title: "Movies",
      longDesc: "Movies",
      desc: "Movies",
      featured: false,
      categories: ["list", "entertainment"],
    },
    endpoints: [
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
  },
  {
    name: "playstation",
    link: "playstation",
    metaData: {
      title: "PlayStation Games",
      longDesc: "Figured it would be a cool db to have various video games on the PlayStation 4.",
      desc: "Figured it would be fun to have a PlayStation game list on here.",
      featured: false,
      categories: ["games", "list", "entertainment"],
    },
    endpoints: ["games"],
  },
  {
    name: "presidents",
    link: "presidents",
    metaData: {
      title: "Presidents",
      longDesc:
        "Millions of peaches! No...not those Presidents. You're practicing API calls, why not learn a little bit about United States history in the process? Here we have a collection of all the US Presidents. Updated every 4-8 years.",
      desc: "Millions of peaches! No...not those Presidents...",
      featured: false,
      categories: ["list"],
    },
    endpoints: ["presidents"],
  },
  {
    name: "recipes",
    link: "recipes",
    metaData: {
      title: "Recipes",
      longDesc: "Because everyone is making a recipe app to learn to code. So, here is some data.",
      desc: "A recipe database",
      featured: false,
      categories: ["food & beverage", "list"],
    },
    endpoints: ["recipes"],
  },
  {
    name: "rickandmorty",
    link: "rickandmorty",
    metaData: {
      title: "Rick And Morty",
      longDesc:
        "Get all the Rick-iest Episodes, Locations and Characters from a copy of the https://rickandmortyapi.com data. That's the way Rick would have done it!",
      desc: "API for all current Rick & Morty episodes, locations and characters",
      featured: false,
      categories: ["cartoon", "tv", "entertainment"],
    },
    endpoints: ["characters", "episodes", "locations"],
  },
  {
    name: "simpsons",
    link: "simpsons",
    metaData: {
      title: "Simpsons",
      longDesc: "Because who doesn't need easily accessible data about the simpsons?",
      desc: "Because who doesn't need easily accessible data about the simpsons?",
      featured: false,
      categories: ["cartoon", "tv", "entertainment", "products"],
    },
    endpoints: ["characters", "products", "episodes"],
  },
  {
    name: "switch",
    link: "switch",
    metaData: {
      title: "Switch Games",
      longDesc: "Figured it would be a cool db to have various video games on the Switch.",
      desc: "Figured it would be fun to have a Switch game list on here.",
      featured: true,
      categories: ["games", "list", "entertainment"],
    },
    endpoints: ["games"],
  },
  {
    name: "thestates",
    link: "thestates",
    metaData: {
      title: "The United States",
      longDesc:
        "Info about the all the 50 states in the United States. The endpoint includes the name, abbreviation, capital, largest city, date admitted to union, population, and state flag.",
      desc: "Info about the all the 50 states in the United States.",
      featured: false,
      categories: ["list"],
    },
    endpoints: ["the-states"],
  },
  {
    name: "typer",
    link: "typer",
    metaData: {
      title: "Typer",
      longDesc: "A place to hold lessons for Typer",
      desc: "A place to hold lessons for Typer",
      featured: false,
      categories: ["education"],
    },
    endpoints: ["welcomeQuestions", "webLessons", "typingLessons"],
  },
  {
    name: "wines",
    link: "wines",
    metaData: {
      title: "Wines",
      longDesc: "Wines.",
      desc: "Wines",
      featured: true,
      categories: ["food & beverage", "list"],
    },
    endpoints: ["reds", "whites", "sparkling", "rose", "dessert", "port"],
  },
  {
    name: "xbox",
    link: "xbox",
    metaData: {
      title: "XBox Games",
      longDesc: "Figured it would be a cool db to have various video games on the XBox.",
      desc: "Figured it would be fun to have a Xbox game list on here.",
      featured: false,
      categories: ["games", "list", "entertainment"],
    },
    endpoints: ["games"],
  },
];
