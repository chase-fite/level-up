import React, { Component } from 'react'
import CompletedWorkout from './CompletedWorkout'
import APIManager from '../../modules/APIManager'

class History extends Component {
  state = {
    completedWorkouts: []
  }

  componentDidMount() {
    APIManager.get(`completedWorkouts?userId=1&_sort=date&_order=desc&_embed=results&_expand=workout`)
    .then(completedWorkoutsR => {
      let temp = completedWorkoutsR.filter(workout => {
        return workout.active === false
      })
      this.setState({
        completedWorkouts: temp
      })
    })
  }

  removeCompletedWorkout = (cwId) => {
    let temp = this.state.completedWorkouts.filter(cw => {
      return cw.id !== cwId
    })
    this.setState({
      completedWorkouts: temp
    })
  }

  render() {
    return (
      <>
        {this.state.completedWorkouts.map(completedWorkout => {
          return (
            <CompletedWorkout
              key={completedWorkout.id}
              completedWorkout={completedWorkout}
              removeCompletedWorkout={this.removeCompletedWorkout}
            />
          )
        })}
      </>
    )
  }
}

export default History