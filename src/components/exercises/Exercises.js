import React, { Component } from 'react'
import Exercise from './Exercise'
import APIManager from '../../modules/APIManager'
import { Container, Row, Col } from 'react-bootstrap'
import './Exercises.css'

class Exercises extends Component {
  state = {
    exercises: []
  }


  componentDidMount() {
    APIManager.get(`exercises?_expand=workout&_sort=name`)
    .then(results => {
      this.setState({
        exercises: results
      })
    })
  }
  
  render() {
    return (
        <Container className="exercise-con">
            <Row noGutters={true}>
                {this.state.exercises.map(exercise => {
                return (
                    <Col md={4} key={exercise.id}>
                        <Exercise
                        exercise={exercise}
                        />
                    </Col>
                )
                })}
            </Row>
        </Container>
    )
  }
}

export default Exercises