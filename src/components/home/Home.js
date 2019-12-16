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
    APIManager.get(`completedWorkouts?userId=1&_expand=workout`)
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

  removeActiveWorkout = () => {
    APIManager.delete(`completedWorkouts/${this.state.activeWorkout.id}`)
      .then(() => {
        this.setState({
          activeWorkout: {
            workout: {
              name: ""
            }
          },
          exercises: []
        })
      })
  }

  clearActiveWorkout = () => {
    const savedWorkout = {
      id: this.state.activeWorkout.id,
      userId: this.state.activeWorkout.userId,
      workoutId: this.state.activeWorkout.workoutId,
      date: this.state.activeWorkout.date,
      active: false
    }
    APIManager.update(`completedWorkouts`, savedWorkout)
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
        <ActiveWorkout
          key={this.state.activeWorkout.id}
          activeWorkout={this.state.activeWorkout}
          exercises={this.state.exercises}
          removeActiveWorkout={this.removeActiveWorkout}
          clearActiveWorkout={this.clearActiveWorkout}
        />
      </>
    )
  }
}

export default Home