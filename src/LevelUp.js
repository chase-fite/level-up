import React from 'react';


import { Component } from 'react'
import NavBar from './components/nav/NavBar'
import ApplicationViews from './components/ApplicationViews';
import 'bootstrap/dist/css/bootstrap.min.css';

class LevelUp extends Component {

    componentDidMount() {
        localStorage.setItem("credentials", JSON.stringify(1))
    }

    render() {
        return (
            <>
                <NavBar />
                <ApplicationViews 
                    setActiveWorkout={this.setActiveWorkout}
                />
            </>
        )
    }
}

export default LevelUp