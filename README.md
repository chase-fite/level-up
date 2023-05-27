# Level Up (Nashville Software School front-end project)

## What is Level Up?

Level Up is a workout organizer as well as a data visualization tool. A user can create their own exercises and workouts with a variety of formats. They can also record their workout results and view a graph of their performance over 1-6 months. It was designed as a mobile web application so users could easily reference or record workouts from their phone. It was built as a React application that uses json-server as a pseudo REST API and a json file for the database.

## Setup

- All this is assuming you're using a terminal with Bash.
- You will need NPM for this as it is a react application. You can get NPM here https://www.npmjs.com/get-npm.
- You will also need json-server, which will be used to simulate a REST API as the back-end for the app.
- Once you have NPM installed you can use it to install json-server. From your terminal run `npm install -g json-server`.
- Clone this repository into the directory of your choice.
- `cd` into the project directory, run `npm install`, and wait for all the dependencies to be installed.
- `cd` into `api/` and remove `.example` from `database.json.example`.
- Run `json-server -w database.json -p 8080`. This will start json-server.
- From here you'll have to open a new tab or window with your terminal and navigate back to the project directory.
- `cd` into `src/` and run `npm start`. This will start the app in your browser, and you should be good to go.

## Usage

If you just want to quickly see how things work with some prepopulated data, including the graph, feel free to login as `userA` password `123`.
