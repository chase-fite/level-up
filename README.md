# Level Up
## Setup:
1. Clone this repository
2. `cd` into the directory it creates
3. In the `api` directory, create a copy of the `database.json.example` and remove the .example extension
4. Run `npm install` and wait for all dependencies to be installed
5. Run `npm start` to verify that installation was successful
6. Run your JSON server on port 5002 or a port that's not 3000
## What is Level Up?
Level Up is a dynamic, single page web application based in JavaScript and React. It was designed as a tool for anyone that wants to organize their workouts. A user can also submit their workout results and view a graph of exercise related data over a period of one to six months. I designed this as a mobile application with card-like styling, so a user can easily thumb through it and record data while they're working out.\
\
There are 5 sections:\
• Home - Active workouts are displayed here which allow a user to record their results for each exercise\
• Workouts - Displays a users created workouts which can be edited, deleted, or set as active. A user can also click the plus icon at the top to create a new workout\
• Exercises - Displays a users created exercises which can be edited, deleted, or attached to a workout. A user can also click the plus icon at the top to create a new exercise\
• History - Displays all the users completed workouts in order of date completed. Each completed workout can be edited or deleted\
• Data - The user can select any exercise that is part of a completed workout, a start date, length of time, and format to display a graph of their exercise related data
