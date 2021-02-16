# Level Up

## Preface

This was my first real attempt to build a web application. It was basically a three week trial-by-fire. Looking back on it, I will say the code is kind of a mess and the UI is a little awkward, but there are some things that I am proud of here. I put a ton of time into this over those three weeks and really pushed myself to learn as much as I could. I was interested in cards as a UI style, so I built this with card-like styling as a responsive web app that works with mobile browsers. I also wanted to venture away from a standard CRUD app update page and implemented in-place editing for all the cards. Lastly, the thing I'm most proud of was integrating Chartjs into the app in order to graph data from the user's completed workouts.

## What is Level Up?

Level Up is a workout organizer as well as a data visualization tool. A user can create their own exercises and workouts with a variety of formats. They can also record their workout results and view a graph of their performance over 1-6 months. It was designed as a mobile web application so users could easily reference or record workouts from their phone. Level Up is a React application that uses json-server as a pseudo REST API and a json file for the database.

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
