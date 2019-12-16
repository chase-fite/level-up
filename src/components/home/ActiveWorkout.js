import React, { Component } from 'react'
import { Card, Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faSave } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import './Home.css'

class ActiveWorkout extends Component {

    state = {

    }

    componentDidMount() {
        console.log("aw props", this.props)
    }

    saveActiveWorkout = () => {
        this.props.exercises.forEach(exercise => {
            let resultString = ""
            for(let property in this.refs) {
                if (property.includes(exercise.name)) {
                    resultString += `${this.refs[property].value} ${exercise.type}--`
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
                                                    <div>{exercise.type}</div>
                                                    {exercise.plan.split('--').map((set, indx) => {
                                                        return (
                                                            <input key={indx} type="text" className="input"
                                                            ref={`${exercise.name}-${indx}`}></input>
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
                            <FontAwesomeIcon className="aw-save-icon" icon={faSave} onClick={this.saveActiveWorkout} />
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