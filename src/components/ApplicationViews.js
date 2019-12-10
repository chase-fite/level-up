import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Home from './home/Home'
import Workouts from './workouts/Workouts'

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
            </>
        )
    }
}

export default ApplicationViews