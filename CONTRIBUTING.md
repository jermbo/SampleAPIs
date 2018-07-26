# Contributing to Sample APIs

Thank you for taking the time to contribute! When contributing to this repository, please first discuss the change you wish to make via an [issue](https://github.com/jermbo/SampleAPIs/issues) with the owners of this repository before making a change.

Please note we have a [Code of Conduct](https://github.com/jermbo/SampleAPIs/blob/master/CODE-OF-CONDUCT.md), please follow it in all your interactions with the project.

## Pull Request Process for new Databases

1.  Create new folder with name describing data.
2.  Ensure index file has a list of endpoints dynamically added.
    1.  Utilize the `displayEndPoints.js` file to accomplish this.
3.  Create json file with same name as folder. eg. `futurama.json`
4.  Create a `.backup` file of your json data. eg. `futurama.json.data`
5.  Ensure all build code is documented and formatted according to standards.
6.  Create pull request with detailed changes and link to issue.
7.  Direct pull request to the dev branch of the repo.
    1.  Correct any merge conflicts before submission.

### Display End Points File

Each index file should contain a brief description of the data present and a list of endpoints in the json file. The look and feel can be designed how ever you desire. The endpoints should not be hard coded, as they have the tendency to change. Instead, utilize the `displayEndPoints.js` file.

The function `displayEndPoints()` takes an object with two keys.

1.  `elem`. Which takes a CSS string or a DOM object in which the endpoints will be displayed.
2.  `db`. DB is the name of the json file that is powering the database. \*Note: the folder name and the json file name should be the same.
