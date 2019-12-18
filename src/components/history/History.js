import React, { Component } from 'react'
import CompletedWorkout from './CompletedWorkout'
import APIManager from '../../modules/APIManager'
import CWEditForm from './CWEditForm'

class History extends Component {
  state = {
    completedWorkouts: [],
    editMode: false,
    editEntityId: Number()
  }

  componentDidMount() {
    APIManager.get(`completedWorkouts?userId=2&_sort=date&_order=desc&_embed=results&_expand=workout`)
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

  editModeOn = (cwId) => {
    this.setState({
      editMode: true,
      editEntityId: cwId
    })
  }

  editModeOff = () => {
    APIManager.get(`completedWorkouts?userId=2&_sort=date&_order=desc&_embed=results&_expand=workout`)
      .then(completedWorkoutsR => {
        let temp = completedWorkoutsR.filter(workout => {
          return workout.active === false
        })
        this.setState({
          completedWorkouts: temp,
          editMode: false,
          editEntityId: Number()
        })
      })
  }


  render() {
    return (
      <>
        {this.state.completedWorkouts.map(completedWorkout => {
          return (
            <div key={completedWorkout.id}>
              {(this.state.editMode === true && completedWorkout.id === this.state.editEntityId) ?
                <CWEditForm
                  key={completedWorkout.id}
                  completedWorkout={completedWorkout}
                  editModeOn={this.editModeOn}
                  editModeOff={this.editModeOff}
                />
                :
                <CompletedWorkout
                  key={completedWorkout.id}
                  completedWorkout={completedWorkout}
                  removeCompletedWorkout={this.removeCompletedWorkout}
                  editModeOn={this.editModeOn}
                />
              }
            </div>
          )
        })}
      </>
    )
  }
}

export default History