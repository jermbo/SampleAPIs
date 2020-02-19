# Change Log

## v2.0.0

Version 2.0.0

### Express

We have introduced the proper use of Express.js and embraced the Pug.js template engine to gain maximum efficiency in our work stream.

### APIList.js

APIList.js is now our single source of truth, running both the backend urls as well as the frontend visualizations.

This object is being passed into individual pages to provide the information necessary to a given set of data. The notable change here is the inclusion of the endpoint available. Before the system would read the json file and make the buttons accordingly. Again, do to the way Express and JSONServer interact with each other we are forced to explicitly name the available endpoints.

```JavaScript
{
  id: 1,
  title: "Futurama",
  longDesc: "If you are a Futurama fan, then this api is for you. Here you can find everything from Episodes to Characters to Trivia Questions, and even some of the Products featured on the show.",
  desc: "An API with characters, episode listing, species, planets, and trivia questions.",
  link: "futurama",
  endPoints: [
    "info",
    "characters",
    "cast",
    "episodes",
    "questions",
    "inventory"
  ]
}
```

### API Folder

The biggest change has been the API folder. The same `db.json` and `db.json.backup` file structure exists, but they are no longer associated with a folder and individualized markup and css.

You will notice the ulr to get data has changed slightly. `https://sampleapis.com/DATABASE/api/ENDPOINT` This is due to the way Express and JSONServer interact with each other.
