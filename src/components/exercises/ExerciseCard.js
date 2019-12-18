import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import './Exercises.css'

class ExerciseCard extends Component {

    render() {
        return (
            <div className="ec-exercise-container">
                <div>{this.props.exercise.name}</div>
                {this.props.exercise.plan.split('--').map((set, indx) => {
                    return <div key={indx}>{set}</div>
                })}
                <FontAwesomeIcon icon={faEdit} onClick={() => this.props.editModeOn(this.props.exercise.id)} />
            </div>










            // <Card className="exercise-card border-primary mb-3">
            //     <Card.Header className="text-center">{this.props.exercise.name}</Card.Header>
            //     <Card.Body>
            //         <div className="exercise-name">{this.props.exercise.name}</div>
            //         {this.props.exercise.plan.split('--').map((set, indx) => {
            //             return <div key={indx} className="text-primary">{set}</div>
            //         })}
            //     </Card.Body>
            // </Card>
        )
    }
}

export default ExerciseCard