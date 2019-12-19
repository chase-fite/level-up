import React, { Component } from 'react'
import WorkoutCard from './WorkoutCard'
import WorkoutCreate from './WorkoutCreate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'

class WorkoutList extends Component {
  state = {
    workouts: [],
    createMode: false
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
      .then(workouts => {
        const filteredWorkouts = workouts.filter(workout => workout.name !== "storage")
        this.setState({
          workouts: filteredWorkouts,
          createMode: false
        })
      })
  }

  render() {
    return (
      <>
        {(this.state.createMode)
          ?
          <WorkoutCreate
            createModeOff={this.createModeOff}
            createModeOffWithGet={this.createModeOffWithGet}
          />
          :
          <>
            <FontAwesomeIcon icon={faPlusSquare} onClick={this.createModeOn} />
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
        }
      </>
    )
  }
}

export default WorkoutList