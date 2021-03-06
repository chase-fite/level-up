import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import APIManager from "../../modules/APIManager";

class CWEditForm extends Component {
  state = {
    exerciseList: [],
    resultList: [],
  };

  componentDidMount() {
    const creds = JSON.parse(localStorage.getItem("credentials"));
    APIManager.get(
      `workouts?_embed=exercises&userId=${creds.loggedInUserId}`
    ).then((workoutTemplatesR) => {
      // gets the workout template that matches the completed workout
      let matchedTemplate = workoutTemplatesR.filter((template) => {
        return this.props.completedWorkout.workoutId === template.id;
      });

      // pulls the object out of the 1 item array
      matchedTemplate = matchedTemplate[0];

      // temporary containers to help with sorting
      let tempExerciseList = matchedTemplate.exercises;
      let tempResultList = [];

      // build result list so that it matches the sorted exercise list
      tempExerciseList.forEach((exercise) => {
        this.props.completedWorkout.results.forEach((result) => {
          if (result.exerciseId === exercise.id) {
            tempResultList.push(result);
          }
        });
      });

      // both arrays in state are sorted now
      this.setState({
        exerciseList: tempExerciseList,
        resultList: tempResultList,
      });
    });
  }

  // updating the performance string for each result object tied to the completed workout
  saveCompletedWorkout = () => {
    this.state.exerciseList.forEach((exercise, indx) => {
      let resultString = "";
      for (let property in this.refs) {
        if (property.includes(exercise.name)) {
          resultString += `${this.refs[property].value} ${
            exercise.format.split("-")[0]
          }--`;
        }
      }
      resultString = resultString.slice(0, resultString.length - 2);
      const newResultObj = {
        id: this.state.resultList[indx].id,
        completedWorkoutId: this.props.completedWorkout.id,
        exerciseId: exercise.id,
        performance: resultString,
      };
      APIManager.update(`results`, newResultObj).then(() =>
        this.props.editModeOffWithGet()
      );
    });
  };

  convertDateTimeFromISO(date) {
    return new Date(date);
  }

  render() {
    return (
      <>
        <div className="cwe-workout-container">
          <div className="cw-workout-title">
            {this.props.completedWorkout.workout.name} -{" "}
            {this.convertDateTimeFromISO(
              this.props.completedWorkout.date
            ).toDateString()}
          </div>
          <div className="cwe-exercises">
            {this.state.exerciseList.map((exercise, exIndx) => {
              return (
                <div key={exercise.id} className="cwe-exercise-input-container">
                  <div className="cwe-exercise-container">
                    <div className="cw-exercise-name">{exercise.name}</div>
                    {exercise.plan.split("--").map((set, indx) => {
                      return (
                        <div className="aw-set" key={indx}>
                          {set}
                        </div>
                      );
                    })}
                  </div>
                  <div className="aw-input-container">
                    <div className="cw-result">
                      {exercise.format.split("-")[0]}
                    </div>
                    {this.state.resultList[exIndx].performance
                      .split("--")
                      .map((result, indx) => {
                        return (
                          <div key={indx}>
                            <input
                              type="text"
                              className="aw-input"
                              defaultValue={result.slice(0, 2)}
                              ref={`${exercise.name}-${indx}`}
                            ></input>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cwe-icon-container">
            <FontAwesomeIcon
              icon={faSave}
              className="fa-lg cwe-save"
              onClick={this.saveCompletedWorkout}
            />
            <FontAwesomeIcon
              icon={faMinusCircle}
              className="fa-lg cwe-minus"
              onClick={this.props.editModeOff}
            />
          </div>
        </div>
      </>
    );
  }
}

export default CWEditForm;
