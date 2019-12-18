import React, { Component } from 'react'
import WorkoutCard from './WorkoutCard'
import APIManager from '../../modules/APIManager'

class WorkoutList extends Component {
  state = {
    workouts: []
  }


  componentDidMount() {
    APIManager.get(`workouts?userId=2&_embed=exercises&_sort=name`)
    .then(workouts => {
      const filteredWorkouts = workouts.filter(workout => workout.name !== "storage")
      this.setState({
        workouts: filteredWorkouts
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
              {...this.props}

            />
          )
        })}
      </>
    )
  }
}

export default WorkoutList