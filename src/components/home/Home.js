import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'
import ActiveWorkout from './ActiveWorkout'

class Home extends Component {

  state = {
    activeWorkout: {
      workout: {
        name: ""
      }
    },
    exercises: []
  }

  componentDidMount() {
    if(this.props.isAuthenticated()) {
      const creds = JSON.parse(localStorage.getItem("credentials"))
      APIManager.get(`completedWorkouts?userId=${creds.loggedInUserId}&_expand=workout`)
        .then(completedWorkoutsR => {
          let temp = completedWorkoutsR.filter(completedWorkout => {
            return completedWorkout.active === true
          })
          temp = temp[0]
          if (temp) {
            APIManager.get(`workouts/${temp.workoutId}?_embed=exercises`)
              .then(workout => {
                this.setState({
                  activeWorkout: temp,
                  exercises: workout.exercises
                })
              })
          }
        })
    }
  }

  deleteActiveWorkout = () => {
    APIManager.delete(`completedWorkouts/${this.state.activeWorkout.id}`)
    this.setState({
      activeWorkout: {
        workout: {
          name: ""
        }
      },
      exercises: []
    })
  }

  clearActiveWorkout = () => {
    const completedWorkout = {
      id: this.state.activeWorkout.id,
      userId: this.state.activeWorkout.userId,
      workoutId: this.state.activeWorkout.workoutId,
      date: this.state.activeWorkout.date,
      active: false
    }
    APIManager.update(`completedWorkouts`, completedWorkout)
    this.setState({
      activeWorkout: {
        workout: {
          name: ""
        }
      },
      exercises: []
    })
  }


  render() {
    return (
      <>
      {(this.state.activeWorkout.workout.name === "")
        ?
        <></>
        :
        <>
          <ActiveWorkout
            key={this.state.activeWorkout.id}
            activeWorkout={this.state.activeWorkout}
            exercises={this.state.exercises}
            deleteActiveWorkout={this.deleteActiveWorkout}
            clearActiveWorkout={this.clearActiveWorkout}
          />
        </>
      }
    </>
    )
  }
}

export default Home