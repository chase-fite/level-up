import React, { Component, useImperativeHandle } from 'react'
import WorkoutCard from './WorkoutCard'
import WorkoutCreate from './WorkoutCreate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WorkoutEdit from './WorkoutEdit'

class WorkoutList extends Component {
  state = {
    workouts: [],
    mode: "",
    editEntityId: 0
  }


  componentDidMount() {
    const creds = JSON.parse(localStorage.getItem("credentials"))
    APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
      .then(workouts => {
        const filteredWorkouts = workouts.filter(workout => workout.name !== "unassigned")
        this.setState({
          workouts: filteredWorkouts
        })
      })
  }

  createModeOn = () => {
    this.setState({
      mode: 'create'
    })
  }

  createModeOff = () => {
    this.setState({
      mode: ""
    })
  }

  createModeOffWithGet = () => {
    const creds = JSON.parse(localStorage.getItem("credentials"))
    APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
      .then(workouts => {
        const filteredWorkouts = workouts.filter(workout => workout.name !== "unassigned")
        this.setState({
          workouts: filteredWorkouts,
          mode: ""
        })
      })
  }

  editModeOn = (id) => {
    this.setState({
      mode: 'edit',
      editEntityId: id
    })
  }

  editModeOff = () => {
    this.setState({
      mode: ""
    })
  }

  editModeOffWithGet = () => {
    const creds = JSON.parse(localStorage.getItem("credentials"))
    APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
      .then(workouts => {
        const filteredWorkouts = workouts.filter(workout => workout.name !== "unassigned")
        this.setState({
          workouts: filteredWorkouts,
          mode: "",
          editEntityId: 0
        })
      })
  }

  deleteWorkout = workout => {
    const creds = JSON.parse(localStorage.getItem("credentials"))
    APIManager.delete(`workouts/${workout.id}`)
      .then(() => {
        APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
          .then(workouts => {
            const filteredWorkouts = workouts.filter(workout => workout.name !== "unassigned")
            this.setState({
              workouts: filteredWorkouts
            })
          })
      })
  }

  switchComponent = mode => {
    switch (mode) {
      case 'create':
        return (
          <WorkoutCreate
            createModeOff={this.createModeOff}
            createModeOffWithGet={this.createModeOffWithGet}
          />
        )
      case 'edit':
        let workoutToEdit = this.state.workouts.filter(workout => workout.id === this.state.editEntityId)
        workoutToEdit = workoutToEdit[0]
        return (
          <WorkoutEdit
            workout={workoutToEdit}
            editModeOff={this.editModeOff}
            editModeOffWithGet={this.editModeOffWithGet}
          />
        )
      default:
        return (
          <div>
            <FontAwesomeIcon icon={faPlusSquare} onClick={this.createModeOn} />
            {this.state.workouts.map(workout => {
              return (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  deleteWorkout={this.deleteWorkout}
                  editModeOn={this.editModeOn}
                  {...this.props}
                />
              )
            })
            }
          </div>
        )
    }
  }

  render() {
    return (
      <>
        {this.switchComponent(this.state.mode)}
      </>
    )
  }
}

export default WorkoutList