import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WCExerciseCard from './WCExerciseCard'
import '../exercises/Exercises.css'

class WorkoutCreate extends Component {

    state = {
        addedExercises: [],
        exerciseList: []
    }

    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`exercises?userId=${creds.loggedInUserId}&_sort=name&_expand=workout`)
            .then(exerciseList => {
                let tempArray = []
                exerciseList.forEach(exercise => {
                    tempArray.push(exercise)
                })
                this.setState({
                    exerciseList: tempArray
                })
            })
    }

    addExerciseToAdded = exercise => {
        const temp = this.state.addedExercises
        temp.push(exercise)
        this.setState({
            addedExercises: temp
        })
        this.removeExerciseFromList(exercise)
    }

    addExerciseToList = exercise => {
        const temp = this.state.exerciseList
        temp.push(exercise)
        this.setState({
            exerciseList: temp
        })
        this.removeExerciseFromList(exercise.id)
    }

    removeExerciseFromList = exerciseToRemove => {
        const newExerciseList = this.state.exerciseList.filter(exercise => {
            return exercise.id !== exerciseToRemove.id
        })
        this.setState({
            exerciseList: newExerciseList
        })
    }

    removeExerciseFromAdded = exercise => {
        const exerciseList = this.state.addedExercises.filter(e => {
            return e.id !== exercise.id
        })
        this.setState({
            addedExercises: exerciseList,
        })
        this.addExerciseToList(exercise)
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

                // we need to check if the added exercise is assigned to a workout already and if it is we need to make a copy of it
                // and assign it to the new workout

                this.state.addedExercises.forEach(exercise => {

                    if (exercise.workoutId !== creds.storageWorkoutId) {
                        let newExObj = {
                            workoutId: workout.id,
                            format: exercise.format,
                            name: exercise.name,
                            plan: exercise.plan
                        }
                        promiseArray.push(APIManager.post(`exercises`, newExObj))
                    } else {
                        let newExObj = {
                            id: exercise.id,
                            workoutId: workout.id,
                            format: exercise.format,
                            name: exercise.name,
                            plan: exercise.plan
                        }
                        promiseArray.push(APIManager.update(`exercises`, newExObj))
                    }

                    // let newExObj = exercise
                    // newExObj = {
                    //     workoutId: workout.id,
                    //     format: exercise.format,
                    //     name: exercise.name,
                    //     plan: exercise.plan
                    // }
                    // promiseArray.push(APIManager.delete(`exercises/${exercise.id}`))
                    // promiseArray.push(APIManager.post(`exercises`, newExObj))
                })
                Promise.all(promiseArray).then(this.props.createModeOffWithGet)
            })
    }

    render() {
        return (
            <>
                <div className="wc-workout-name-container">
                    <div>Workout Name&nbsp;</div>
                    <input className="wc-workout-name-input" type="text" ref={`workoutName`}></input>
                </div>
                <hr className="wc-top-hr" />
                <label>Added Exercises</label>
                <FontAwesomeIcon className="fa-lg wc-minus" icon={faMinusCircle} onClick={this.props.createModeOffWithGet} />
                <FontAwesomeIcon className="fa-lg wc-save" icon={faSave} onClick={this.createWorkout} />
                <div className="wc-exercise-card">
                    {this.state.addedExercises.map((exercise, indx) => {
                        return (
                            <div key={indx} className="ec-exercise-container">
                                <div className="wc-added-exercise-name">{exercise.name}</div>
                                {exercise.plan.split('--').map((set, indx) => {
                                    return <div key={indx}>{set}</div>
                                })}
                                <hr className="ec-hr" />
                                <div>workout: {exercise.workout.name}</div>
                                <hr className="ec-hr" />
                                <FontAwesomeIcon icon={faMinusCircle} className="fa-lg" onClick={() => this.removeExerciseFromAdded(exercise)} />
                            </div>
                        )
                    })}
                </div>
                <hr className="wc-bottom-hr" />
                {/* <WCExerciseList
                    addExercise={this.addExercise}
                /> */}

                <div className="we-added-exercise-container">
                    {this.state.exerciseList.map((exercise, indx) => {
                        return (
                            <div key={indx}>
                                <WCExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    addExercise={this.addExerciseToAdded}
                                    removeExercise={this.removeExerciseFromAdded}
                                />
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}

export default WorkoutCreate