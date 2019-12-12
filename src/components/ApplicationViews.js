import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './home/Home'
import WorkoutList from './workouts/WorkoutList'
import ExerciseList from './exercises/ExerciseList'
import History from './history/History'

class ApplicationViews extends Component {
    render() {
        return (
            <>
                <Route exact path="/" render={(props) => {
                    return <Home />
                }} />
                <Route exact path="/workouts" render={(props) => {
                    return <WorkoutList />
                }} />
                <Route exact path="/exercises" render={(props) => {
                    return <ExerciseList />
                }} />
                <Route exact path="/history" render={(props) => {
                    return <History />
                }} />
            </>
        )
    }
}

export default ApplicationViews