import React, { Component } from 'react'
import WorkoutCard from './WorkoutCard'
import WorkoutCreate from './WorkoutCreate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import WorkoutEdit from './WorkoutEdit'

class WorkoutList extends Component {
  state = {
    workouts: [],
    mode: "",
    editEntityId: 0,
    search: ""
  }

  // getting the users workouts and setting state
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

  handleSearch = (evt) => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
    const creds = JSON.parse(localStorage.getItem("credentials"))
    APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
      .then(workouts => {
        const filteredWorkouts = workouts.filter(workout => {
          return (workout.name !== "unassigned" && workout.name.toLowerCase().includes(this.state.search.toLowerCase()))
        })
        this.setState({
          workouts: filteredWorkouts
        })
      })
  }

  clearSearchBar = () => {
    this.refs['search-input'].value = ""
  }

  // create and edit mode functions just used to help with view manipulation
  // i use a get to "refresh" the page after edit
  createModeOn = () => {
    this.setState({
      mode: 'create',
      search: ""
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
      editEntityId: id,
      search: ""
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
    const confirm = window.confirm("Are you sure you want to delete this workout?")
    if (confirm === true) {
      const creds = JSON.parse(localStorage.getItem("credentials"))

      let targetWorkout = this.state.workouts.filter(workoutObj => workoutObj.id === workout.id)
      targetWorkout = targetWorkout[0]

      const promiseArray = []
      targetWorkout.exercises.forEach(exercise => {
        const updatedExercise = exercise
        updatedExercise.workoutId = creds.storageWorkoutId
        promiseArray.push(APIManager.update(`exercises`, updatedExercise))
      })
      Promise.all(promiseArray)
        .then(() => {
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
        })
    }
  }

  // switch statement for determining view
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
            <div className="page-title">Workouts</div>
            <div className="search-plus-container">
              <FontAwesomeIcon icon={faPlusCircle} className="fa-lg wl-plus" onClick={this.createModeOn} />
              <div className="search-container">
                <div>Search &nbsp;</div>
                <input id="search" className="search-input" type="text" ref={`search-input`} onChange={this.handleSearch}></input>
              </div>
            </div>
            <div className="wl-card-container">
              {this.state.workouts.map((workout, indx) => {
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