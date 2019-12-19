import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'

class Register extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    handleFieldChange = (evt) => {
        const stateToChange = {}
        stateToChange[evt.target.id] = evt.target.value
        this.setState(stateToChange)
    }

    verifyUser = newUser => {
        APIManager.get(`users`)
        .then(users => {
            let verified = true
            users.forEach(user => {
                if(user.email.toLowerCase() === newUser.email.toLowerCase()) {
                    verified = false
                }
            })
            return verified
        })
    }

    handleRegister = () => {
        let emptyfields = false
        for(let property in this.state) {
            if(this.state[property] === "") {
                emptyfields = true
                break
            }
        }
        const newUserObj = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }

        if(emptyfields) {
            window.alert("Please fill in all input fields")
        } else if (this.state.password !== this.state.confirmPassword) {
            window.alert("Password does not match")
        } else if (this.verifyUser(newUserObj) === false) {
            window.alert("This email address is already in use")
        } else {
            APIManager.post(`users`, newUserObj)
            .then(newUser => {
                const newStorageWorkout = {
                    userId: newUser.id,
                    name: "unassigned"
                }
                APIManager.post(`workouts`, newStorageWorkout)
                .then(storageWorkout => {
                    const authObj = {
                        loggedInUserId: newUser.id,
                        storageWorkoutId: storageWorkout.id
                    }
                    this.props.setUser(authObj)
                    this.props.history.push('/')
                })
            })
        }
    }

    render() {
        return (
            <>
                <h1>Register</h1>
                <div>
                    <label>Name</label>
                    <input type="text" id="name" onChange={this.handleFieldChange}></input>
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" id="email" onChange={this.handleFieldChange}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" id="password" onChange={this.handleFieldChange}></input>
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="text" id="confirmPassword" onChange={this.handleFieldChange}></input>
                </div>
                <button onClick={this.handleRegister}>Register</button>
            </>
        )
    }
}

export default Register