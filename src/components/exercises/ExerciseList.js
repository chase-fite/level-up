import React, { Component } from 'react'
import ExerciseCard from './ExerciseCard'
import APIManager from '../../modules/APIManager'
import './Exercises.css'
import ExerciseCreateForm from './ExerciseCreateForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

class ExerciseList extends Component {
  state = {
    exercises: [],
    createMode: false
  }


  componentDidMount() {
    APIManager.get(`workouts?userId=2&_embed=exercises&_sort=name`)
      .then(results1 => {
        APIManager.get(`workouts?userId=1&_embed=exercises&_sort=name`)
        .then(results2 => {
          let tempArray = []
          results1.forEach(obj => {
            obj.exercises.forEach(exercise => tempArray.push(exercise))
          })
          results2.forEach(obj => {
            obj.exercises.forEach(exercise => tempArray.push(exercise))
          })
          tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
          this.setState({
            exercises: tempArray
          })
        })
      })
  }

  createModeOn = () => {
    this.setState({
      createMode: true
    })
  }

  createModeOff = () => {
    this.setState({
      createMode: false
    })
  }

  createModeOffWithGet = () => {
    APIManager.get(`workouts?userId=2&_embed=exercises&_sort=name`)
      .then(results1 => {
        APIManager.get(`workouts?userId=1&_embed=exercises&_sort=name`)
        .then(results2 => {
          let tempArray = []
          results1.forEach(obj => {
            obj.exercises.forEach(exercise => tempArray.push(exercise))
          })
          results2.forEach(obj => {
            obj.exercises.forEach(exercise => tempArray.push(exercise))
          })
          tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
          this.setState({
            exercises: tempArray,
            createMode: false
          })
        })
      })
  }

  render() {
    return (
      <>
        {(this.state.createMode === false)
          ?
          <>
          <FontAwesomeIcon icon={faPlusSquare} onClick={this.createModeOn} />
            <div className="el-exercise-card">
              {this.state.exercises.map(exercise => {
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                  />
                )
              })}
            </div>
          </>
          :
          <ExerciseCreateForm
              createModeOff={this.createModeOff}
              createModeOffWithGet={this.createModeOffWithGet}
          />
          }
      </>
    )
  }
}

export default ExerciseList