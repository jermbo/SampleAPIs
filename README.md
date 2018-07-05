# Sample APIs

As I started working on the Futurama Database, I noticed that I could create a bunch of these database with little extra effort. So this is that effort.

## Running the Web Server

Open a new terminal window, navigate to your root project folder, and install node packages if not already there. `npm i`

The pattern used is `service:project`. In order to trigger the web server for futurama you would run `npm run web:futurama`. Simply replace `futurama` with the project you are interested in working on.


## Running the Database Server

Open a new terminal window, navigate to your root project folder, and install node packages if not already there. `npm i`

The pattern used is `service:project`. In order to trigger the database server for futurama you would run `npm run db:futurama`. Simply replace `futurama` with the project you are interested in working on.

## Projects in parallel

I tried really hard to get a couple npm scripts running in parallel, but could not do that cross platform. So my temporary solution is to open up two terminals and run a task in each one that triggers the desired script.

**Windows Users** if you notice the JSON-Server is not working as expected. There is probably a node task still running that is causing issues. I am trying to figure out the cause and a permanent fix. But for the time being, you can run this command and it will kill all node tasks for you.

`taskkill /F /IM node.exe`