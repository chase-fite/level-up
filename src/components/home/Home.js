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

  // i'm just checking to see if the user is logged in because i don't want to display
  // an active workout if they are not. otherwise we're just setting state to the active
  // workout if there is one
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

  // delete and clear home page
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

  // this function is just used to set the active workout as a completed workout and clear
  // the home page
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
        <div className="img-container">
          <img src={require('../../images/levelUpLogo2.png')} alt="level up logo" />
        </div>
        :
        <>
          <div className="img-container">
            <img src={require('../../images/levelUpLogo2.png')} alt="level up logo" />
          </div>
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