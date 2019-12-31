import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import './Home.css'

class ActiveWorkout extends Component {

    // active workout is technically already a completed workout, so this function
    // just gets all input data and creates and posts the result objects tied too each
    // exercise
    saveActiveWorkout = () => {
        this.props.exercises.forEach(exercise => {
            let resultString = ""
            for (let property in this.refs) {
                if (property.includes(exercise.name)) {
                    resultString += `${this.refs[property].value} ${exercise.format.split('-')[0]}--`
                }
            }
            resultString = resultString.slice(0, (resultString.length - 2))
            const newResultObj = {
                completedWorkoutId: this.props.activeWorkout.id,
                exerciseId: exercise.id,
                performance: resultString
            }
            APIManager.post(`results`, newResultObj)
        })
        this.props.clearActiveWorkout()
    }

    render() {
        return (
            <div>
                <div className="aw-icon-container">
                    <FontAwesomeIcon icon={faSave} className="fa-lg aw-save" onClick={this.saveActiveWorkout} />
                    <FontAwesomeIcon icon={faMinusCircle} className="fa-lg aw-minus" onClick={this.props.deleteActiveWorkout} />
                </div>
                <hr className="aw-hr" />
                <div className="aw-main-container">
                    <div className="aw-workout-name">{this.props.activeWorkout.workout.name}</div>
                    <div className="aw-workout-container">
                        {this.props.exercises.map(exercise => {
                            return (
                                <div key={exercise.id} className="aw-exercise-input-container">
                                    <div className="aw-exercise-container">
                                        <div className="cw-exercise-name">{exercise.name}</div>
                                        {exercise.plan.split('--').map((set, indx) => {
                                            return <div className="aw-set" key={indx}>{set}</div>
                                        })}
                                    </div>
                                    <div className="aw-input-container">
                                        <div className="cw-result">{exercise.format.split('-')[0]}</div>
                                        {exercise.plan.split('--').map((set, indx) => {
                                            return (
                                                <div key={indx}>
                                                    <input type="text" className="aw-input"
                                                        ref={`${exercise.name}-${indx}`}></input>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ActiveWorkout