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

    componentDidMount() {
        
    }

    addExercise = exercise => {
        const temp = this.state.addedExercises
        temp.push(exercise)
        this.setState({
            addedExercises: temp
        })
    }

    removeExercise = exercise => {
        const temp = this.state.addedExercises.filter(e => {
            return e.id !== exercise.id
        })
        this.setState({
            addedExercises: temp
        })
    }

    // need logged in user id here
    createWorkout = () => {
        const newWorkout = {
            userId: 2,
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
                    <label>Workout Name</label>
                    <input type="text" ref={`workoutName`}></input>
                </div>
                <FontAwesomeIcon icon={faMinusCircle} onClick={this.props.createModeOff}/>
                <FontAwesomeIcon icon={faSave} onClick={this.createWorkout}/>
                <label>Added Exercises:</label>
                <div className="el-exercise-card">
                    {this.state.addedExercises.map((exercise, indx) => {
                        return (
                            <div key={indx} className="ec-exercise-container">
                                <div>{exercise.name}</div>
                                {exercise.plan.split('--').map((set, indx) => {
                                    return <div key={indx}>{set}</div>
                                })}
                                <FontAwesomeIcon icon={faMinusCircle} onClick={() => this.removeExercise(exercise)} />
                            </div>
                        )
                    })}
                </div>
                <hr />
                <WCExerciseList
                    addExercise={this.addExercise}
                />
            </>
        )
    }
}

export default WorkoutCreate