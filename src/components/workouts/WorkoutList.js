import React, { Component } from 'react'
import WorkoutCard from './WorkoutCard'
import APIManager from '../../modules/APIManager'

class WorkoutList extends Component {
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
            <WorkoutCard
              key={workout.id}
              workout={workout}

            />
          )
        })}
      </>
    )
  }
}

export default WorkoutList