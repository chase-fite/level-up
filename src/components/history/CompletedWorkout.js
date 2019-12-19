import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons'
import './History.css'

class CompletedWorkout extends Component {
    state = {
        exerciseList: [],
        resultList: []
    }

    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`workouts?_embed=exercises&userId=${creds.loggedInUserId}`)
            .then(workoutTemplatesR => {

                // gets the workout template that matches the completed workout
                let matchedTemplate = workoutTemplatesR.filter(template => {
                    return this.props.completedWorkout.workoutId === template.id
                })
                // pulls the object out of the 1 item array
                matchedTemplate = matchedTemplate[0]

                let tempExerciseList = matchedTemplate.exercises
                let tempResultList = []

                // build result list so that it matches the sorted exercise list
                tempExerciseList.forEach(exercise => {
                    this.props.completedWorkout.results.forEach(result => {
                        if (result.exerciseId === exercise.id) {
                            tempResultList.push(result)
                        }
                    })
                })

                // both arrays in state are sorted now
                this.setState({
                    exerciseList: tempExerciseList,
                    resultList: tempResultList
                })
            })
    }

    deleteCompletedWorkout = () => {
        const cwId = this.props.completedWorkout.id
        APIManager.delete(`completedWorkouts/${this.props.completedWorkout.id}`)
            .then(() => {
                this.setState({
                    exerciseList: [],
                    resultList: []
                })
                this.props.removeCompletedWorkout(cwId)
            })
    }

    convertDateTimeFromISO(date) {
        return new Date(date)
    }

    render() {
        return (
            <>
                <div>{this.props.completedWorkout.workout.name} - {this.convertDateTimeFromISO(this.props.completedWorkout.date).toDateString()}</div>
                <div className="cw-workout-container">
                    {this.state.exerciseList.map((exercise, exIndx) => {
                        return (
                            <div key={exercise.id} className="cw-exercise-container">
                                <div className="">
                                    <div>{exercise.name}</div>
                                    {exercise.plan.split('--').map((set, indx) => {
                                        return <div key={indx}>{set}</div>
                                    })}
                                </div>
                                <div className="cw-results-container">
                                    <div>results</div>
                                    {this.state.resultList[exIndx].performance
                                        .split('--').map((result, indx) => {
                                            return <div key={indx}>{result}</div>
                                        })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <FontAwesomeIcon icon={faEdit} onClick={() => {
                        this.props.editModeOn(this.props.completedWorkout.id)}}
                    />
                    <FontAwesomeIcon icon={faTimes} onClick={this.deleteCompletedWorkout} />
                </div>
            </>
        )
    }
}

export default CompletedWorkout