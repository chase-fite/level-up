import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'
import './Auth.css'

class Login extends Component {

    state = {
        email: "",
        password: ""
    }

    componentDidMount() {
        
    }

    handleFieldChange = (evt) => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    handleLogin = evt => {
        evt.preventDefault()
        if(this.state.email !== "" && this.state.password !== "") {
            APIManager.get(`users?_embed=workouts`)
                .then(users => {
                    users.forEach(user => {
                        if (user.email.toLowerCase() === this.state.email.toLowerCase() && user.password === this.state.password) {
                            user.workouts.forEach(workout => {
                                if(workout.name === "unassigned") {
                                    const authObj = {
                                        loggedInUserId: user.id,
                                        storageWorkoutId: workout.id
                                    }
                                    this.props.setUser(authObj)        
                                }
                            })
                        }
                    })
                    this.props.history.push('/')
                })
        } else {
            window.alert("Please fill in all fields")
        }
    }

    render() {

        return (
            <>
                <h3>Login</h3>
                <div className="login-container">
                    <div className="login-label-container">
                        <div>Email</div>
                        <br />
                        <div>Password</div>
                    </div>
                    <div className="login-input-container">
                        <div>
                            <input type="text" className="login-input" id="email" onChange={this.handleFieldChange}></input>
                        </div>
                        <br />
                        <div>
                            <input type="password" className="login-input" id="password" onChange={this.handleFieldChange}></input>
                        </div>
                    </div>
                </div>
                <button onClick={this.handleLogin}>Login</button>
            </>
        )
    }
}

export default Login