import React, { Component } from "react";
import ExerciseCard from "./ExerciseCard";
import APIManager from "../../modules/APIManager";
import "./Exercises.css";
import ExerciseCreateForm from "./ExerciseCreateForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ExerciseEdit from "./ExerciseEdit";

class ExerciseList extends Component {
  state = {
    exercises: [],
    createMode: false,
    editMode: false,
    editEntityId: 0,
    search: "",
  };

  componentDidMount() {
    this.getUsersExercises().then((exercisesList) => {
      this.setState({
        exercises: exercisesList,
      });
    });
  }

  getUsersExercises = async () => {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    let exercises = [];

    await APIManager.get(
      `workouts?userId=${creds.loggedInUserId}&_embed=exercises`
    ).then((workoutsRes) => {
      workoutsRes.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          const modifiedExercise = exercise;
          modifiedExercise.workoutName = workout.name;
          exercises.push(modifiedExercise);
        });
      });
    });

    const exercisesSet = new Set(exercises);
    exercises = Array.from(exercisesSet);
    return exercises;
  };

  handleSearch = (event) => {
    if (this.refs['search-input'].value === "") {
        this.getUsersExercises().then((exercisesList) => {
          this.setState({
            exercises: exercisesList,
          });
        });
    }

    const stateToChange = {};
    stateToChange[event.target.id] = event.target.value;
    this.setState(stateToChange);

    const filteredExercises = this.state.exercises.filter(exercise => {
        return (
            exercise.name.toLowerCase().includes(this.refs['search-input'].value.toLowerCase()) ||
            exercise.workoutName.toLowerCase().includes(this.refs['search-input'].value.toLowerCase())
        );
    });

    this.setState({
        exercises: filteredExercises
    });
  };

  clearSearchBar = () => {
    this.refs["search-input"].value = "";
  };

  createModeOn = () => {
    this.setState({
      createMode: true,
      search: "",
    });
    this.clearSearchBar();
  };

  createModeOff = () => {
    this.setState({
      createMode: false,
    });
  };

  createModeOffWithGet = () => {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    APIManager.get(
      `exercises?userId=${creds.loggedInUserId}&_sort=name&_expand=workout`
    ).then((exerciseList) => {
      let tempArray = [];
      exerciseList.forEach((exercise) => {
        tempArray.push(exercise);
      });
      this.setState({
        exercises: tempArray,
        createMode: false,
      });
    });
  };

  editModeOn = (id) => {
    this.setState({
      editMode: true,
      editEntityId: id,
    });
  };

  editModeOff = () => {
    this.setState({
      editMode: false,
      editEntityId: 0,
    });
  };

  editModeOffWithGet = () => {
    this.getUsersExercises().then((exercisesList) => {
      console.log("exercises: ", exercisesList);
      this.setState({
        exercises: exercisesList,
        editMode: false,
        editEntityId: 0,
      });
    });
  };

  deleteExercise = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this exercise?"
    );
    if (confirm === true) {
      APIManager.delete(`exercises/${id}`).then(() => {
        const newExerciseList = this.state.exercises.filter(
          (exercise) => exercise.id !== id
        );
        this.setState({
          exercises: newExerciseList,
        });
      });
    }
  };

  render() {
    return (
      <>
        {this.state.createMode === false ? (
          <>
            <div className="page-title">Exercises</div>
            <div className="search-plus-container">
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="fa-lg wl-plus"
                onClick={this.createModeOn}
              />
              <div className="search-container">
                <div>Search &nbsp;</div>
                <input
                  id="search"
                  className="search-input"
                  type="text"
                  ref={`search-input`}
                  onChange={this.handleSearch}
                ></input>
              </div>
            </div>
            {/* <hr className="wl-hr-below-search" /> */}
            {/* <FontAwesomeIcon icon={faPlusCircle} className="fa-lg el-plus" onClick={this.createModeOn} />
            <hr className="el-hr" /> */}
            <div className="el-exercise-card">
              {this.state.exercises.map((exercise, indx) => {
                return (
                  <div key={indx}>
                    {this.state.editMode === true &&
                    this.state.editEntityId === exercise.id ? (
                      <ExerciseEdit
                        key={exercise.id}
                        exercise={exercise}
                        editModeOff={this.editModeOff}
                        editModeOffWithGet={this.editModeOffWithGet}
                      />
                    ) : (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        editModeOn={this.editModeOn}
                        deleteExercise={this.deleteExercise}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <ExerciseCreateForm
            createModeOff={this.createModeOff}
            createModeOffWithGet={this.createModeOffWithGet}
          />
        )}
      </>
    );
  }
}

export default ExerciseList;
