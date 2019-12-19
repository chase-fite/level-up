import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

class WCExerciseCard extends Component {

    render() {
        return (
            <div className="ec-exercise-container">
                <div>{this.props.exercise.name}</div>
                {this.props.exercise.plan.split('--').map((set, indx) => {
                    return <div key={indx}>{set}</div>
                })}
                <FontAwesomeIcon icon={faPlusCircle} onClick={() => {
                    this.props.addExercise(this.props.exercise)}} />
            </div>
        )
    }
}

export default WCExerciseCard