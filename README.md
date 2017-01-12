# Magic estimation

Web UI for [magic estimation](http://agiletransparency.com/estimation-a-kind-of-magic/) based on JIRA API. This enables you to do a decent planning using magic estimation via visual UI. I didn't find a free similar tool so i created my own.

See this demo for the basic idea:

![Magic Estimation demo](https://raw.githubusercontent.com/janpetzold/magic-estimation/master/assets/estimation.gif)

Everything should work fine although I'm sure there's lots of room for improvement regarding the source code. I basically needed something that works quickly for my current project :) 

The only requirements are a working JIRA which is needed as the source of data and node.js installed on your machine.

## Features

- fetch all tasks of a given sprint, switch between sprints
- dynamically add participants (=people that will estimate)
- counter increments whenever a ticket is moved between swimlanes to indicate tasks that need further discussion
- fully responsive design
- counts total number of story points for all estimated tickets

## TODO

- update JIRA ticket automatically with the Story Points that were estimated
- show epics in ticket
- multiuser support (login etc.) - currently just a single user launches the app and the estimators need to be "connected" via screensharing
- support other data sources beside JIRA (e.g. Trello)
- not tested outside Chrome

## Getting started

Fetch all dependencies first by

`npm install`

Now you need to configure your JIRA in config/default.json. This should be self-explanatory. The board ID is unique for your project, the easiest way to find out is in the backlog URL of JIRA which should be something like `/RapidBoard.jspa?rapidView=83`. So here `83` would be your board ID.

The actual app can be started then by executing

`npm start`

Afterwards fire up your browser at [http://localhost:3000](http://localhost:3000).