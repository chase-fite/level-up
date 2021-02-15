import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import NavBarBS from "react-bootstrap/NavBar";
import "./NavBar.css";

class NavBar extends Component {
  render() {
    return (
      <NavBarBS sticky="top" className="navbar-style justify-content-center">
        <Link className="nav-link-black" to="/">
          Home
        </Link>
        {this.props.isAuthenticated() ? (
          <>
            <Link className="nav-link-black" to="/workouts">
              Workouts
            </Link>
            <Link className="nav-link-black" to="/exercises">
              Exercises
            </Link>
            <Link className="nav-link-black" to="/history">
              History
            </Link>
            <Link className="nav-link-black" to="/data">
              Data
            </Link>
            <span
              className="nav-link-black nav-logout"
              onClick={this.props.clearUser}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link className="nav-link-black" to="/login">
              Login
            </Link>
            <Link className="nav-link-black nav-reg" to="/register">
              Register
            </Link>
          </>
        )}
      </NavBarBS>
    );
  }
}
export default withRouter(NavBar);
