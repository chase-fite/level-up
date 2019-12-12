import React, { Component } from 'react'
import ExerciseCard from './ExerciseCard'
import APIManager from '../../modules/APIManager'
import { Container, Row, Col } from 'react-bootstrap'
import './Exercises.css'

class ExerciseList extends Component {
  state = {
    exercises: []
  }


  componentDidMount() {
    APIManager.get(`workouts?userId=1&_embed=exercises&_sort=name`)
    .then(results => {
      let tempArray = []
      results.forEach(obj => {
        obj.exercises.forEach(exercise => tempArray.push(exercise))
      })
      tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
      this.setState({
        exercises: tempArray
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
                        <ExerciseCard
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

export default ExerciseList