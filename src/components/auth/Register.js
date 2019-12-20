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
                <h3>Register</h3>
                <div className="reg-label-input-container">
                    <div className="reg-label-container">
                        <div>Name</div>
                        <br />
                        <div>Email</div>
                        <br />
                        <div>Password</div>
                        <br />
                        <div>Confirm Password</div>
                        <br />
                    </div>
                    <div className="reg-input-container">
                        <div>
                            <input type="text" className="reg-input" id="name" onChange={this.handleFieldChange}></input>
                        </div>
                        <br />
                        <div>
                            <input type="text" className="reg-input" id="email" onChange={this.handleFieldChange}></input>
                        </div>
                        <br />
                        <div>
                            <input type="text" className="reg-input" id="password" onChange={this.handleFieldChange}></input>
                        </div>
                        <br />
                        <div>
                            <input type="text" className="reg-input" id="confirmPassword" onChange={this.handleFieldChange}></input>
                        </div>
                        <br />
                    </div>
                </div>
                <button onClick={this.handleRegister}>Register</button>
            </>
        )
    }
}

export default Register