import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import APIManager from "../../modules/APIManager";
import "./Exercises.css";

class ExerciseEditForm extends Component {
  state = {
    setSelectArray: [],
    setInputArray: [1],
    format: "reps-lbs",
    name: "",
  };

  componentDidMount() {
    this.setState({
      setSelectArray: this.createRangeArray(12),
    });
  }

  // i use this function to build some arrays with sequential numbers to help
  // with sizing my dropdown selections
  createRangeArray = (size) => {
    const resultArray = [];
    for (let i = 0; i < size; i++) {
      resultArray.push(i + 1);
    }
    return resultArray;
  };

  handleFieldChange = (evt) => {
    const stateToChange = {};
    stateToChange[evt.target.id] = evt.target.value;
    this.setState(stateToChange);
  };

  handleNumOfSets = (evt) => {
    const inputArray = this.createRangeArray(evt.target.value);
    this.setState({
      setInputArray: inputArray,
    });
  };

  // the format of the exercise determines how i have to build the plan string
  saveExercise = () => {
    let planString = "";
    if (this.state.format === "min" || this.state.format === "sec") {
      for (let property in this.refs) {
        if (this.refs[property].value && this.state.name !== "") {
          if (property.toString().includes("firstInput")) {
            planString += `set ${property.toString().split("-")[1]}: ${
              this.refs[property].value
            } ${this.state.format}--`;
          }
        } else {
          window.alert("Please fill in all input fields");
          break;
        }
      }
      planString = planString.slice(0, planString.length - 2);
    } else if (this.state.format === "reps-bodyweight") {
      for (let property in this.refs) {
        if (this.refs[property].value && this.state.name !== "") {
          if (property.toString().includes("firstInput")) {
            planString += `set ${property.toString().split("-")[1]}: ${
              this.refs[property].value
            } ${this.state.format.split("-")[0]}, ${
              this.state.format.split("-")[1]
            }--`;
          }
        } else {
          window.alert("Please fill in all input fields");
          break;
        }
      }
      planString = planString.slice(0, planString.length - 2);
    } else {
      let tempString = "";
      for (let property in this.refs) {
        if (this.refs[property].value && this.state.name !== "") {
          if (property.toString().includes("firstInput")) {
            tempString += `set ${property.toString().split("-")[1]}: ${
              this.refs[property].value
            } ${this.state.format.split("-")[0]}, `;
          }
          if (property.toString().includes("secondInput")) {
            tempString += `${this.refs[property].value} ${
              this.state.format.split("-")[1]
            }--`;
            planString += tempString;
            tempString = "";
          }
        } else {
          window.alert("Please fill in all input fields");
          break;
        }
      }
      planString = planString.slice(0, planString.length - 2);
    }

    const creds = JSON.parse(localStorage.getItem("credentials"));
    const newExercise = {
      workoutId: creds.storageWorkoutId,
      format: this.state.format,
      name: this.state.name,
      plan: planString,
    };
    APIManager.post("exercises", newExercise).then(
      this.props.createModeOffWithGet
    );
  };

  render() {
    return (
      <div className="ex-outer-div">
        <div className="ex-form-container">
          <div className="ex-label-input-container">
            <div>
              <div className="excr-label excr-title">Create Exercise</div>
              <div className="excr-input">
                <FontAwesomeIcon
                  icon={faSave}
                  className="fa-lg ec-save"
                  onClick={this.saveExercise}
                />
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  className="fa-lg ec-minus"
                  onClick={this.props.createModeOffWithGet}
                />
              </div>
              <div className="excr-label">Exercise Name</div>
              <div>
                <input
                  type="text"
                  id="name"
                  className="excr-input"
                  onChange={this.handleFieldChange}
                ></input>
              </div>
              <div className="excr-label">Number of Sets</div>
              <div>
                <select
                  id="numOfSets"
                  className="excr-input"
                  onChange={this.handleNumOfSets}
                >
                  {this.state.setSelectArray.map((num, indx) => {
                    return (
                      <option key={indx} value={num}>
                        {num}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="excr-label">Format</div>
              <div>
                <select
                  id="format"
                  className="excr-input"
                  onChange={this.handleFieldChange}
                >
                  <option value="reps-lbs">
                    repetitions with weight: pounds
                  </option>
                  <option value="reps-bodyweight">
                    repetitions with weight: bodyweight
                  </option>
                  <option value="reps-min">
                    repetitions within time: minutes
                  </option>
                  <option value="reps-sec">
                    repetitions within time: seconds
                  </option>
                  <option value="min-reps">
                    time to achieve repetitions: minutes
                  </option>
                  <option value="sec-reps">
                    time to achieve repetitions: seconds
                  </option>
                  <option value="min">time as a goal for set: minutes</option>
                  <option value="sec">time as a goal for set: seconds</option>
                </select>
              </div>
            </div>
          </div>
          {this.state.setInputArray !== [] ? (
            this.state.setInputArray.map((num, indx) => {
              return (
                <div key={indx} className="ecf-input-container">
                  <div>Set {num}:&nbsp;</div>
                  <input
                    className="excr-set-input"
                    ref={`firstInput-${indx + 1}`}
                  ></input>
                  <div>&nbsp;{this.state.format.split("-")[0]}</div>
                  {this.state.format === "min" ||
                  this.state.format === "sec" ||
                  this.state.format.split("-")[1] === "bodyweight" ? (
                    <></>
                  ) : (
                    <>
                      {this.state.format.includes("bodyweight") ? (
                        <div>,&nbsp;bodyweight</div>
                      ) : (
                        <>
                          <div>,&nbsp;</div>
                          <input
                            className="excr-set-input"
                            ref={`secondInput-${indx}`}
                          ></input>
                          <div>&nbsp;{this.state.format.split("-")[1]}</div>
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

export default ExerciseEditForm;
