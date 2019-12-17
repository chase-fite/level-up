import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'

class CWEditForm extends Component {

    state = {
        exerciseList: [],
        resultList: []
    }
    
    componentDidMount() {
        APIManager.get(`workouts?_embed=exercises&userId=1`)
            .then(workoutTemplatesR => {

                // gets the workout template that matches the completed workout
                let matchedTemplate = workoutTemplatesR.filter(template => {
                    return this.props.completedWorkout.workoutId === template.id
                })
                // pulls the object out of the 1 item array
                matchedTemplate = matchedTemplate[0]

                // temporary containers to help with sorting
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

    saveCompletedWorkout = () => {
        this.state.exerciseList.forEach((exercise, indx) => {
            let resultString = ""
            for (let property in this.refs) {
                if (property.includes(exercise.name)) {
                    resultString += `${this.refs[property].value} ${exercise.type}--`
                }
            }
            resultString = resultString.slice(0, (resultString.length - 2))
            const newResultObj = {
                id: this.state.resultList[indx].id,
                completedWorkoutId: this.props.completedWorkout.id,
                exerciseId: exercise.id,
                performance: resultString
            }
            APIManager.update(`results`, newResultObj)
            .then(() => this.props.editModeOff())
        })
    }

    render() {
        return (
            <>
                <div>{this.props.completedWorkout.workout.name}</div>
                <div className="aw-workout-container">
                    {this.state.exerciseList.map((exercise, exIndx) => {
                        return (
                            <div key={exercise.id} className="aw-exercise-input-container">
                                <div className="aw-exercise-container">
                                    <div>{exercise.name}</div>
                                    {exercise.plan.split('--').map((set, indx) => {
                                        return <div className="aw-set" key={indx}>{set}</div>
                                    })}
                                </div>
                                <div className="aw-input-container">
                                    <div>{exercise.type}</div>
                                    {this.state.resultList[exIndx].performance.split('--').map((result, indx) => {
                                        return (
                                            <div key={indx}>
                                                <input type="text" className="aw-input" defaultValue={result.slice(0, 2)}
                                                    ref={`${exercise.name}-${indx}`}></input>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <FontAwesomeIcon icon={faSave} onClick={this.saveCompletedWorkout} />
                    <FontAwesomeIcon icon={faWindowClose} onClick={this.props.editModeOff} />
                </div>
            </>
        )
    }
}

export default CWEditForm