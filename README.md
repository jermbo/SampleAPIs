# Sample APIs 3.1

![Screenshot](/SampleAPI-3.0-Screenshot.png)

## Purpose

Understanding RESTful APIs is hard enough, even without including an authentication mechanism. The sole purpose of this repository is to play with RESTful endpoints and learn. We have a few endpoints that you can start playing around with right away! If you are not finding anything you are interested in, create your own endpoints and/or submit a pull request. Take a look at the [CONTRIBUTING](https://github.com/jermbo/SampleAPIs/blob/master/CONTRIBUTING.md) for more information on how to get involved.

# How to use the service

Choose an endpoint, say "futurama", then choose what information you'd like, say "characters":
```Javascript
const baseURL = "https://api.sampleapis.com/futurama/characters";
fetch(baseURL)
  .then(resp => resp.json())
  .then(data => console.log(data));
```

Want to Search? for all chatacters with the name "Bender"?
```Javascript
const baseURL = "https://api.sampleapis.com/futurama/characters";
fetch(`${baseURL}?name.first=Bender`)
  .then(resp => resp.json())
  .then(data => console.log(data));
```
You also have full CRUD, so you can add information or correct existing ones.<BR><BR>
*Note*: Just know that we reset all datapoints weekly and each time we have a new endpoint added.
<hr>
<BR>

## Changes

Hosting has switched again due to `Vercel.com`'s static nature. The app is being self hosted and is back to being fully CRUD-able. 

Checkout the [Change Log](https://github.com/jermbo/SampleAPIs/blob/master/Change_log.md) for full details.

## Disclaimers

- The data on this site is for educational purposes only and is not owned by SampleAPIs.com
- Data will be reset back to its original state on a regular basis. If you are updating or adding data to the endpoints and want to have them persist as part of the collection, please contribute to the repo by submitting a pull request.
- By using SampleAPIs.com you agree to the following terms: This service is provided under an "as is" condition. It might change or will be discontinued without prior notice. The maker of this service can't be held liable in any way for any reason.


## Recent changes.
Ok. a LOT of work from the great Jermbo, and then a little fluf from TheDamian to make it more pretty!
