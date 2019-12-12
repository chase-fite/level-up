import React, { Component } from 'react'
import CompletedWorkout from './CompletedWorkout'
import APIManager from '../../modules/APIManager'
// import APIManager from '../../modules/APIManager'
// import CompletedWorkout from './CompletedWorkout'

class History extends Component {
  state = {
    completedWorkouts: []
  }


  componentDidMount() {
    APIManager.get(`completedWorkouts?userId=1&_sort=date&_order=desc&_embed=results&_expand=workout`)
    .then(completedWorkoutsR => {
      this.setState({
        completedWorkouts: completedWorkoutsR
      })
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
            />
          )
        })}
      </>
    )
  }
}

export default History