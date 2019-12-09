import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom"
import NavBarBS from 'react-bootstrap/NavBar'
import './NavBar.css'

class NavBar extends Component {

  render() {
    return (
      <header>
        <NavBarBS sticky="top">
          <ul className="container">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/workouts">Workouts</Link></li>
            {(true) ?
            <>
              <li><Link className="nav-link" to="/exercises">Exercises</Link></li>
              <li><Link className="nav-link" to="/history">History</Link></li>
              <li><span className="nav-link">Logout</span></li>
            </>
            :
            <li><Link className="nav-link" to="/login">Login</Link></li>
            }
          </ul>
        </NavBarBS>
      </header>
    )
  }
}
export default withRouter(NavBar);