import React, { Component } from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'
import APIManager from '../../modules/APIManager'
import './History.css'

class CompletedWorkout extends Component {
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

            // sort exercise list by alphabetical order
            tempExerciseList.sort((a, b) => {
                return (a.name > b.name) ? 1 : -1
            })

            // build result list so that it matches the sorted exercise list
            tempExerciseList.forEach(exercise => {
                this.props.completedWorkout.results.forEach(result => {
                    if(result.exerciseId === exercise.id) {
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

    convertDateTimeFromISO(date) {
        return new Date(date)
    }

    render() {
        return (
            <Card className="workout-card border-primary mb-3">
                <Card.Header className="text-center">{this.props.completedWorkout.workout.name} - {this.convertDateTimeFromISO(this.props.completedWorkout.date).toDateString()}
                </Card.Header>
                <Container className="con-exercises">
                    <Row noGutters={true}>
                        {this.state.exerciseList.map((exercise, exIndx) => {
                            return (
                                <Col md={4} key={exercise.id}>
                                    <Card className="exercise-plan text-primary">
                                        <Card.Body>
                                            <div className="card-inner-container">
                                                <div className="left-inner-container">
                                                    <div className="underline">{exercise.name}</div>
                                                    {exercise.plan.split('--').map((set, indx) => {
                                                        return <div key={indx}>{set}</div>
                                                    })} 
                                                </div>
                                                <div>
                                                    <div className="result-color underline">results</div>
                                                    {this.state.resultList[exIndx].performance
                                                        .split('--').map((result, indx) => {
                                                            return <div className="results" key={indx}>{result}</div>
                                                    })}
                                                </div>
                                            </div>  
                                        </Card.Body>                         
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </Card>
        )
    }
}

export default CompletedWorkout