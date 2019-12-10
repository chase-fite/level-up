import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './home/Home'
import Workouts from './workouts/Workouts'
import Exercises from './exercises/Exercises'

class ApplicationViews extends Component {
    render() {
        return (
            <>
                <Route exact path="/" render={(props) => {
                    return <Home />
                }} />
                <Route exact path="/workouts" render={(props) => {
                    return <Workouts />
                }} />
                <Route exact path="/exercises" render={(props) => {
                    return <Exercises />
                }} />
            </>
        )
    }
}

export default ApplicationViews