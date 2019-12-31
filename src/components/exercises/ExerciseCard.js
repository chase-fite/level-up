import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import './Exercises.css'

class ExerciseCard extends Component {

    render() {
        return (
            <div className="ec-exercise-container">
                <div className="ec-exercise-name">{this.props.exercise.name}</div>
                {this.props.exercise.plan.split('--').map((set, indx) => {
                    return <div key={indx}>{set}</div>
                })}
                <FontAwesomeIcon icon={faEdit} className="fa-lg ec-edit" onClick={() => this.props.editModeOn(this.props.exercise.id)} />
                <FontAwesomeIcon icon={faTimes} className="fa-lg ec-x" onClick={() => this.props.deleteExercise(this.props.exercise.id)} />
            </div>
        )
    }
}

export default ExerciseCard