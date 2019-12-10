import React, { Component } from 'react'
import Workout from './Workout'
import APIManager from '../../modules/APIManager'

class Workouts extends Component {
  state = {
    workouts: []
  }


  componentDidMount() {
    APIManager.get(`workouts?userId=1&_embed=exercises&_sort=name`)
    .then(results => {
      this.setState({
        workouts: results
      })
    })
  }
  
  render() {
    return (
      <>
        {this.state.workouts.map(workout => {
          return (
            <Workout
              key={workout.id}
              workout={workout}

            />
          )
        })}
      </>
    )
  }
}

export default Workouts