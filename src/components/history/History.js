import React, { Component } from "react";
import CompletedWorkout from "./CompletedWorkout";
import APIManager from "../../modules/APIManager";
import CWEditForm from "./CWEditForm";

class History extends Component {
  state = {
    completedWorkouts: [],
    editMode: false,
    editEntityId: 0,
    search: "",
  };

  componentDidMount() {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    APIManager.get(
      `completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`
    ).then((completedWorkoutsR) => {
      let temp = completedWorkoutsR.filter((workout) => {
        return workout.active === false;
      });
      this.setState({
        completedWorkouts: temp,
      });
    });
  }

  handleSearch = (evt) => {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    const stateToChange = {};
    stateToChange[evt.target.id] = evt.target.value;
    this.setState(stateToChange);
    APIManager.get(
      `completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`
    ).then((completedWorkoutsR) => {
      let temp = completedWorkoutsR.filter((cw) => {
        const dateString = this.convertDateTimeFromISO(cw.date).toDateString();
        return (
          (cw.active === false &&
            cw.workout.name
              .toLowerCase()
              .includes(this.state.search.toLowerCase())) ||
          (cw.active === false &&
            dateString.toLowerCase().includes(this.state.search.toLowerCase()))
        );
      });
      this.setState({
        completedWorkouts: temp,
      });
    });
  };

  convertDateTimeFromISO(date) {
    return new Date(date);
  }

  removeCompletedWorkout = (cwId) => {
    let temp = this.state.completedWorkouts.filter((cw) => {
      return cw.id !== cwId;
    });
    this.setState({
      completedWorkouts: temp,
    });
  };

  editModeOn = (cwId) => {
    this.setState({
      editMode: true,
      editEntityId: cwId,
    });
  };

  editModeOff = () => {
    this.setState({
      editMode: false,
      editEntityId: 0,
    });
  };

  clearSearchBar = () => {
    this.refs["search-input"].value = "";
  };

  editModeOffWithGet = () => {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    APIManager.get(
      `completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`
    ).then((completedWorkoutsR) => {
      let temp = completedWorkoutsR.filter((workout) => {
        return workout.active === false;
      });
      this.setState({
        completedWorkouts: temp,
        editMode: false,
        editEntityId: 0,
      });
    });
  };

  render() {
    return (
      <>
        <div className="page-title">Completed Workouts</div>
        <div className="hist-search-container">
          <div className="hist-search-input">Search &nbsp;</div>
          <input
            id="search"
            className="search-input hist-search-input"
            type="text"
            ref={`search-input`}
            onChange={this.handleSearch}
          ></input>
        </div>
        <hr className="wl-hr-below-search" />
        {this.state.completedWorkouts.map((completedWorkout, indx) => {
          return (
            <div className="hist-cw-container" key={completedWorkout.id}>
              {this.state.editMode === true &&
              completedWorkout.id === this.state.editEntityId ? (
                <CWEditForm
                  key={completedWorkout.id}
                  completedWorkout={completedWorkout}
                  editModeOn={this.editModeOn}
                  editModeOff={this.editModeOff}
                  editModeOffWithGet={this.editModeOffWithGet}
                />
              ) : (
                <CompletedWorkout
                  key={completedWorkout.id}
                  completedWorkout={completedWorkout}
                  removeCompletedWorkout={this.removeCompletedWorkout}
                  editModeOn={this.editModeOn}
                />
              )}
            </div>
          );
        })}
      </>
    );
  }
}

export default History;
