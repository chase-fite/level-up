import React from 'react';


import { Component } from 'react'
import NavBar from './components/nav/NavBar'
import ApplicationViews from './components/ApplicationViews';
import 'bootstrap/dist/css/bootstrap.min.css';

class LevelUp extends Component {

    render() {
        return (
            <>
                <NavBar />
                <ApplicationViews />
            </>
        )
    }
}

export default LevelUp