import React, { Component } from 'react'
import { Route, BrowserRouter } from 'react-router-dom'
import Home from './home/Home'

class ApplicationViews extends Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/" render={(props) => {
                    return <Home {...props} />
                }} />
            </BrowserRouter>
        )
    }
}

export default ApplicationViews