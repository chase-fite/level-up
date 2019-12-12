import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom"
import NavBarBS from 'react-bootstrap/NavBar'
import './NavBar.css'

class NavBar extends Component {

  render() {
    return (
      <NavBarBS sticky="top" className="navbar-style justify-content-center">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/workouts">Workouts</Link>
        <Link className="nav-link" to="/exercises">Exercises</Link>
        <Link className="nav-link" to="/history">History</Link>
        <Link className="nav-link" to="/">Logout</Link>
        {/* <Link className="nav-link" to="/login">Login</Link> */}
      </NavBarBS>
    )
  }
}
export default withRouter(NavBar);