import React from 'react';


import { Component } from 'react'
import NavBar from './components/nav/NavBar'
import ApplicationViews from './components/ApplicationViews';
import 'bootstrap/dist/css/bootstrap.min.css';

class LevelUp extends Component {
    state = {
        user: false
    }

    isAuthenticated = () => localStorage.getItem("credentials") !== null

    setUser = (authObj) => {
        localStorage.setItem(
            "credentials",
            JSON.stringify(authObj)
        )
        this.setState({
            user: this.isAuthenticated()
        });
    }


    componentDidMount() {
        this.setState({
            user: this.isAuthenticated()
        })
    }

    clearUser = () => {
        localStorage.removeItem("credentials")

        this.setState({user: this.isAuthenticated()})
    }
    

    render() {
        return (
            <>
                <NavBar
                    clearUser={this.clearUser}
                    isAuthenticated={this.isAuthenticated}
                />
                <ApplicationViews
                    setUser={this.setUser}
                    setActiveWorkout={this.setActiveWorkout}
                    isAuthenticated={this.isAuthenticated}
                />
            </>
        )
    }
}

export default LevelUp