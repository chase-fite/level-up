import React, { Component } from 'react'
import { Card, Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import './Home.css'

class ActiveWorkout extends Component {

    render() {
        console.log("ActiveWorkout, this.props", this.props)
        return (
            <>
                {(this.props.activeWorkout.workout.name !== "") ?
                    <Card className="aw-card">
                        <Card.Header>{this.props.activeWorkout.workout.name}</Card.Header>
                        <Container className="aw-container">
                            <Row noGutters={true}>
                                {this.props.exercises.map(exercise => {
                                    return (
                                        <Col md={4} key={exercise.id}>
                                            <div className="set-input-container">
                                                <div className="set-container">
                                                    <div className="aw-exercise-name">{exercise.name}</div>
                                                    {exercise.plan.split('--').map((set, indx) => {
                                                        return (
                                                            <div key={indx} className="set">{set}</div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="input-container">
                                                    {exercise.plan.split('--').map((set, indx) => {
                                                        return (
                                                            <input key={indx} type="text" className="input"></input>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Container>
                        <div className="icon-container">
                            <FontAwesomeIcon className="aw-remove-icon" icon={faMinusCircle} onClick={this.props.removeActiveWorkout} />
                            <FontAwesomeIcon className="aw-edit-icon" icon={faEdit} />
                        </div>
                    </Card>
                    :
                    <></>
                }
            </>
        )
    }
}

export default ActiveWorkout