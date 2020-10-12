# Contributing to Sample APIs

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing to this project. These are mostly guidelines, not rules. Use your best judgement, and feel free to propose changes to this document in a pull request.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

When contributing to this repository, please first discuss the change you wish to make via an [issue](https://github.com/jermbo/SampleAPIs/issues) with the owners of this repository before making a change.

## Code of Conduct

Before we get any further, please take the time to review our [Code of Conduct](https://github.com/jermbo/SampleAPIs/blob/master/CODE_OF_CONDUCT.md). This project and everyone participating in it will be governed by the [Code of Conduct](https://github.com/jermbo/SampleAPIs/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [INSERT EMAIL HERE]. Be polite to everyone. If you are not in your best day, take a deep breath and try again. Smile 😄!

## New Issues

Before you submit an issue:

- Search the current list of issues, bug reports, or feature requests.
- If the issue already exists, add a 👍 or a ❤️, and you can click the `Subscribe` or `Watching` button to get notifications via email.
- Please, do not use the issue tracker for support questions.

## Contributing

When you are looking for an issue to work on:

- Search the current list of issues, bug reports, or feature requests.
- When you find something you are interested in and assign it to you.
- Give it a label of `Doing`.
- Create a branch with issue number and title. ( ie. `1-create-contributing-documentation`)
- Make the changes in your branch.
- Submit a PR to `master` branch when ready. ( Please follow PR Comment Guide )

## PR Comment Guide

The title of the pull request should contain only the issue number and issue title. ( ie `#1 Create Contributing Documentation`)

The body's first line should be a link to the issue for quick reference. The rest of the body should be a brief explanation of what changes were made. Each issue should have a list for Acceptance Criteria, this should be addressed in the PR comment.

## Code Review Process

The core team looks a Pull Request on a regular basis. Each PR will be reviewed and tested. Feedback will be provided via file comments or general comments. We will be clear if further action is required. It is the contributors responsibility their code does not have breaking changes or merge conflicts.


# Example of adding a new Endpoint

Our project is all about great data to play with!
And I know of no one better than YOU (yes YOU) that knows what data YOU'D like to play with. 

In this section we'll learn how to add a new dataset (or "endpoint" as we'll call them)

Each endpoint needs three files. Here's a [example of a new PR adding just a new endpoint](https://github.com/jermbo/SampleAPIs/pull/89)

Here are the official steps to add an endpoint
1) Create a <i>endpointName</i>.json file (eg. baseball.json for SampleApis.com/api/baseball) with a value for each "collection" (so for "homeRuns" we end up with https://sampleapis.com/baseball/api/homeRuns because there's a array for the parameter "homeRuns" see [api/baseball.json](/src/api/baseball.json) for more details)
2) Create a ".backup" file which is a copy of the original  <i>endpointName</i>.json file (in our example it would be [baseball.json.backup](/src/api/baseball.json.backup) )
3) Add new entry to the module.exports array in the ```src/apiList.js``` file. Here you'll add information about the new endpoint you've added.

What the format of the new entry in the ```src/apiList.js``` will look like:
```javascript
// example from the rickandporty endpoint
    {
      id: 22,   ⬅ //use a new ID
      title: "Rick And Morty",  ⬅ //Title on top of page
      longDesc: "This is t...", ⬅ //Description on the endpoint's page
      desc: "AP", ⬅ // description for front page
      link: "rickandmorty", ⬅ // endpoint url
      graphLink: "rickandmorty/graphql", // graphql endpoint
      endPoints: ["characters","episodes","locations"],  ⬅ // All collections (or properties) in the endpoint from the endpointName.json file
      },
```



