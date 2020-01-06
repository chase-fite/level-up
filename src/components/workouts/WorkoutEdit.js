import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WCExerciseCard from './WCExerciseCard'

class WorkoutEdit extends Component {

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
                const currentAddedExerciseList = exerciseList.filter(exercise => exercise.workoutId === this.props.workout.id)
                tempArray = tempArray.filter(exercise => exercise.workoutId !== this.props.workout.id)

                this.setState({
                    exerciseList: tempArray,
                    addedExercises: currentAddedExerciseList
                })
            })
    }

    addExerciseToAdded = exercise => {
        window.scrollTo(0, 0);
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

    saveWorkout = () => {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        const newWorkout = {
            id: this.props.workout.id,
            userId: creds.loggedInUserId,
            name: this.refs['workoutName'].value
        }
        APIManager.update(`workouts`, newWorkout)
            .then(workout => {
                const promiseArray = []

                const removedExercises = []
                this.props.workout.exercises.forEach(exercise => {
                    let contains = false
                    this.state.addedExercises.forEach(addedExercise => {
                        if (exercise.id === addedExercise.id) {
                            contains = true
                        }
                    })
                    if (contains === false) {
                        removedExercises.push(exercise)
                        contains = true
                    }
                })
                removedExercises.forEach(exercise => {
                    exercise.workoutId = creds.storageWorkoutId
                    promiseArray.push(APIManager.update(`exercises`, exercise))
                })

                const filteredAddedExercises = this.state.addedExercises.filter(ex => ex.workoutId !== this.props.workout.id)

                filteredAddedExercises.forEach(exercise => {

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
                })
                Promise.all(promiseArray).then(this.props.editModeOffWithGet)
            })
    }

    render() {
        return (
            <>
                <div className="we-name-input-container">
                    <label className="we-labels">Workout Name &nbsp;</label>
                    <input className="we-name-input" type="text" ref={`workoutName`} defaultValue={this.props.workout.name}></input>
                </div>
                <hr className="we-hr" />
                <label className="we-add-exercise">Added Exercises</label>
                <FontAwesomeIcon icon={faMinusCircle} className="fa-lg we-minus" onClick={this.props.editModeOffWithGet} />
                <FontAwesomeIcon icon={faSave} className="fa-lg we-save" onClick={this.saveWorkout} />
                <div className="we-added-exercise-container">
                    {this.state.addedExercises.map((exercise, indx) => {
                        return (
                            <div key={indx} className="ec-exercise-container">
                                <div className="we-exercise-name">{exercise.name}</div>
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
                <hr className="we-hr" />
                <label className="we-labels">Exercise List</label>
                <div className="we-added-exercise-container" >
                    {
                        this.state.exerciseList.map((exercise, indx) => {
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
                        })
                    }
                </div >
            </>
        )
    }
}

export default WorkoutEdit