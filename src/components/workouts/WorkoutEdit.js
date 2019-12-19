import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WCExerciseList from './WCExerciseList'
import '../exercises/Exercises.css'

class WorkoutEdit extends Component {

    state = {
        addedExercises: [],
        removedExercises: []
    }

    componentDidMount() {
        this.setState({
            addedExercises: this.props.workout.exercises
        })
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
        const removedExerciseList = this.state.removedExercises
        removedExerciseList.push(exercise)
        this.setState({
            addedExercises: exerciseList,
            removedExercises: removedExerciseList
        })
    }

    // need logged in user id here
    saveWorkout = () => {
        const newWorkout = {
            id: this.props.workout.id,
            userId: 2,
            name: this.refs['workoutName'].value
        }
        APIManager.update(`workouts`, newWorkout)
        .then(workout => {
            let promiseArrayRemoveEx = []
            this.state.removedExercises.forEach(exercise => {
                let updatedExercise = exercise
                updatedExercise.workoutId = 5
                promiseArrayRemoveEx.push(APIManager.update(`exercises`, updatedExercise))
            })
            const promiseArray = []
            this.state.addedExercises.forEach(exercise => {
                let newExObj = exercise
                newExObj.workoutId = workout.id
                promiseArray.push(APIManager.update(`exercises`, newExObj))
            })
            promiseArray.concat(promiseArrayRemoveEx)
            Promise.all(promiseArray).then(this.props.editModeOffWithGet)
        })
    }

    render() {
        return (
            <>
                <div>
                    <label>Workout Name</label>
                    <input type="text" ref={`workoutName`} defaultValue={this.props.workout.name}></input>
                </div>
                <FontAwesomeIcon icon={faMinusCircle} onClick={this.props.editModeOff}/>
                <FontAwesomeIcon icon={faSave} onClick={this.saveWorkout}/>
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

export default WorkoutEdit