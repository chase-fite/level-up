import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'

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
                <h1>Login</h1>
                <div>
                    <label>Email</label>
                    <input type="text" id="email" onChange={this.handleFieldChange}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" id="password" onChange={this.handleFieldChange}></input>
                </div>
                <button onClick={this.handleLogin}>Login</button>
            </>
        )
    }
}

export default Login