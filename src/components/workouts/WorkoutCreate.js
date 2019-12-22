import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WCExerciseList from './WCExerciseList'
import '../exercises/Exercises.css'

class WorkoutCreate extends Component {

    state = {
        addedExercises: []
    }

    addExercise = exercise => {
        const temp = this.state.addedExercises
        temp.push(exercise)
        this.setState({
            addedExercises: temp
        })
    }

    removeExercise = exercise => {
        const exerciseList = this.state.addedExercises.filter(e => {
            return e.id !== exercise.id
        })
        this.setState({
            addedExercises: exerciseList,
        })
    }

    // create new workout, post, attach exercises to workout, and post
    createWorkout = () => {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        const newWorkout = {
            userId: creds.loggedInUserId,
            name: this.refs['workoutName'].value
        }
        APIManager.post(`workouts`, newWorkout)
        .then(workout => {
            const promiseArray = []
            this.state.addedExercises.forEach(exercise => {
                let newExObj = exercise
                newExObj = {
                    workoutId: workout.id,
                    format: exercise.format,
                    name: exercise.name,
                    plan: exercise.plan
                }
                promiseArray.push(APIManager.post(`exercises`, newExObj))
            })
            Promise.all(promiseArray).then(this.props.createModeOffWithGet)
        })
    }

    render() {
        return (
            <>
                <div>
                    <label>Workout Name&nbsp;</label>
                    <input type="text" ref={`workoutName`}></input>
                </div>
                <hr className="wc-top-hr" />
                <label>Added Exercises</label>
                <FontAwesomeIcon className="fa-lg wc-minus" icon={faMinusCircle} onClick={this.props.createModeOffWithGet}/>
                <FontAwesomeIcon className="fa-lg wc-save" icon={faSave} onClick={this.createWorkout}/>
                <div className="wc-exercise-card">
                    {this.state.addedExercises.map((exercise, indx) => {
                        return (
                            <div key={indx} className="ec-exercise-container">
                                <div>{exercise.name}</div>
                                {exercise.plan.split('--').map((set, indx) => {
                                    return <div key={indx}>{set}</div>
                                })}
                                <FontAwesomeIcon icon={faMinusCircle} className="fa-lg" onClick={() => this.removeExercise(exercise)} />
                            </div>
                        )
                    })}
                </div>
                <hr className="wc-bottom-hr" />
                <WCExerciseList
                    addExercise={this.addExercise}
                />
            </>
        )
    }
}

export default WorkoutCreate