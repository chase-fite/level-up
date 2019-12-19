import React, { Component } from 'react'
import ExerciseCard from './ExerciseCard'
import APIManager from '../../modules/APIManager'
import './Exercises.css'
import ExerciseCreateForm from './ExerciseCreateForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import ExerciseEdit from './ExerciseEdit'

class ExerciseList extends Component {
  state = {
    exercises: [],
    createMode: false,
    editMode: false,
    editEntityId: 0,
  }


  componentDidMount() {
    APIManager.get(`workouts?userId=2&_embed=exercises&_sort=name`)
      .then(results1 => {
        let tempArray = []
        results1.forEach(obj => {
          obj.exercises.forEach(exercise => tempArray.push(exercise))
        })
        tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({
          exercises: tempArray
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
      .then(results1 => {
        let tempArray = []
        results1.forEach(obj => {
          obj.exercises.forEach(exercise => tempArray.push(exercise))
        })
        tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({
          exercises: tempArray,
          createMode: false
        })
      })
  }

  editModeOn = (id) => {
    this.setState({
      editMode: true,
      editEntityId: id
    })
  }

  editModeOff = () => {
    this.setState({
      editMode: false,
      editEntityId: 0
    })
  }

  editModeOffWithGet = () => {
    APIManager.get(`workouts?userId=2&_embed=exercises&_sort=name`)
      .then(results => {
        let tempArray = []
        results.forEach(obj => {
          obj.exercises.forEach(exercise => tempArray.push(exercise))
        })
        tempArray.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({
          exercises: tempArray,
          editMode: false,
          editEntityId: 0
        })
      })
  }

  deleteExercise = id => {
    APIManager.delete(`exercises/${id}`)
    .then(() => {
      const newExerciseList = this.state.exercises.filter(exercise => exercise.id !== id)
      this.setState({
        exercises: newExerciseList
      })
    })
  }

  render() {
    return (
      <>
        {(this.state.createMode === false)
          ?
          <>
            <FontAwesomeIcon icon={faPlusSquare} onClick={this.createModeOn} />
            <div className="el-exercise-card">
              {this.state.exercises.map((exercise, indx) => {
                return (
                  <div key={indx}>
                    {(this.state.editMode === true && this.state.editEntityId === exercise.id)
                      ?
                      <ExerciseEdit
                        key={exercise.id}
                        exercise={exercise}
                        editModeOff={this.editModeOff}
                        editModeOffWithGet={this.editModeOffWithGet}
                      />
                      :
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        editModeOn={this.editModeOn}
                        deleteExercise={this.deleteExercise}
                      />
                    }
                  </div>
                )
              })}
            </div>
          </>
          :
          <ExerciseCreateForm
            createModeOff={this.createModeOff}
            createModeOffWithGet={this.createModeOffWithGet}
          />
        }
      </>
    )
  }
}

export default ExerciseList