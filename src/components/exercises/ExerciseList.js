import React, { Component } from 'react'
import ExerciseCard from './ExerciseCard'
import APIManager from '../../modules/APIManager'
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
    )
  }
}

export default ExerciseList