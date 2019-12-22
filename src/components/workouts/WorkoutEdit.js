import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WCExerciseList from './WCExerciseList'

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

    // updates the workout name then puts all removed exercises in the users storage workout
    // and adds the chosen exercises to the current workout
    saveWorkout = () => {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        const newWorkout = {
            id: this.props.workout.id,
            userId: this.props.workout.userId,
            name: this.refs['workoutName'].value
        }
        APIManager.update(`workouts`, newWorkout)
        .then(workout => {
            let promiseArrayRemoveEx = []
            this.state.removedExercises.forEach(exercise => {
                let updatedExercise = exercise
                updatedExercise.workoutId = creds.storageWorkoutId
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
                    <label>Workout Name &nbsp;</label>
                    <input type="text" ref={`workoutName`} defaultValue={this.props.workout.name}></input>
                </div>
                <label className="we-add-exercise">Added Exercises</label>
                <FontAwesomeIcon icon={faMinusCircle} className="fa-lg we-minus" onClick={this.props.editModeOffWithGet}/>
                <FontAwesomeIcon icon={faSave} className="fa-lg we-save" onClick={this.saveWorkout}/>
                <hr className="we-hr" />
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