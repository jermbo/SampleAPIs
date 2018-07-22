# Sample APIs

Understanding RESTful APIs is hard enough without including a authentication mechanism. The sole purpose of this repository is to play with RESTful endpoints and learn. We have a few endpoints that you can start playing around with right away. If you are not finding anything you are interested in, create your own endpoints and or submit a pull request. ( Take a look at the [CONTRIBUTING](https://github.com/jermbo/SampleAPIs/blob/master/CONTRIBUTING.md) for more information on how to get involved )

## Using the API

We have a growing number of APIs to choose from. Head over to [SampleAPIs.com](https://sampleapis.com) and checkout the current list of APIs. On the right hand side, you will see the name of the API, brief description, and link. When you have navigated to an individual page, you will be presented with more details about that specific API, along with all the endpoints you can utilize.

All APIs will follow the same url structure, the differences being the base category and the specific endpoint. For example, let's look at the path for Futurama. To get to the basic information about the database you will navigate to `https://sampleapis.com/futurama`. There you will notice a list of all the endpoints and you are interested in the inventory list. Your url would look like `https://sampleapis.com/futurama/inventory`.

Once you get to an endpoint, you can do all the normal actions on a RESTful endpoint. Check out the documentation over at [JSON-Server](https://github.com/typicode/json-server) as this is the tool that is powering the site.

## Starting server locally

Navigate to the folder containing the cloned files. Install dependencies `npm i`. Once all the dependencies are loaded, run `npm start`. Open your browser to `localhost:5000`. Use the site the same way you would from the website.
