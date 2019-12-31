import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from './home/Home'
import WorkoutList from './workouts/WorkoutList'
import ExerciseList from './exercises/ExerciseList'
import History from './history/History'
import Login from './auth/Login'
import Register from './auth/Register'
import LineGraph from './charts/LineGraph'

class ApplicationViews extends Component {
    render() {
        return (
            <>
                <Route exact path="/" render={(props) => {
                    return <Home isAuthenticated={this.props.isAuthenticated} {...props} {...this.props} />
                }} />
                <Route exact path="/home" render={(props) => {
                    return <Home isAuthenticated={this.props.isAuthenticated} {...props} {...this.props} />
                }} />
                <Route exact path="/workouts" render={(props) => {
                    if (this.props.isAuthenticated()) {
                        return <WorkoutList {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
                <Route exact path="/exercises" render={(props) => {
                    if (this.props.isAuthenticated()) {
                        return <ExerciseList />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
                <Route exact path="/history" render={(props) => {
                    if (this.props.isAuthenticated()) {
                        return <History />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
                <Route exact path="/graph" render={(props) => {
                    if (this.props.isAuthenticated()) {
                        return <LineGraph />
                    } else {
                        return <Redirect to="/login" />
                    }
                }} />
                <Route exact path="/login" render={(props) => {
                    return (
                        <Login 
                            {...props}
                            {...this.props}
                        />
                    )
                }} />
                <Route exact path="/register" render={(props) => {
                    return (
                        <Register 
                            {...props}
                            {...this.props}
                        />
                    )
                }} />
            </>
        )
    }
}

export default ApplicationViews