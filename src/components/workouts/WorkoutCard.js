import React, { Component } from 'react'
import { Card, Container, Row, Col } from 'react-bootstrap'
import './Workouts.css'

class WorkoutCard extends Component {
    state = {
        exercises: []
    }

    componentDidMount() {
        const tempArray = this.props.workout.exercises.map(x => x)
        this.setState({
            exercises: tempArray
        })
    }

    render() {
        return (
            <Card className="workout-card border-primary mb-3">
                <Card.Header className="text-center">{this.props.workout.name}</Card.Header>
                <Container className="con-exercises">
                    <Row noGutters={true}>
                        {this.state.exercises.map(exercise => {
                            return (
                                <Col md={4} key={exercise.id}>
                                    <Card className="exercise-plan text-primary">
                                        <Card.Body>
                                            <div className="exercise-name underline">{exercise.name}</div>
                                            {exercise.plan.split('--').map((set, indx) => {
                                                return <div key={indx}>{set}</div>
                                            })}   
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

export default WorkoutCard