import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import APIManager from "../../modules/APIManager";
import "./Workouts.css";

class WorkoutCard extends Component {
  state = {
    exercises: [],
  };

  // set state
  componentDidMount() {
    const tempArray = this.props.workout.exercises.map((x) => x);
    this.setState({
      exercises: tempArray,
    });
  }

  // just creating a "completedWorkout" but setting active to true
  setActiveWorkout = () => {
    const creds = JSON.parse(localStorage.getItem("credentials"));

    const date = new Date();
    date.toDateString();

    const newWorkout = {
      userId: creds.loggedInUserId,
      workoutId: this.props.workout.id,
      date: date,
      active: true,
    };

    APIManager.post(`completedWorkouts`, newWorkout).then(() => {
      this.props.history.push(`/home`);
    });
  };

  render() {
    return (
      <div className="wc-workout-card">
        <div className="wc-workout-name">{this.props.workout.name}</div>
        <div className="workout-card-body">
          {this.state.exercises.map((exercise) => {
            return (
              <div key={exercise.id} className="exercise-container">
                <div className="wc-exercise-name">{exercise.name}</div>
                {exercise.plan.split("--").map((set, indx) => {
                  return <div key={indx}>{set}</div>;
                })}
              </div>
            );
          })}
        </div>
        <div className="wc-icons">
          <FontAwesomeIcon
            id={this.props.workout.id}
            className="fa-lg wc-check"
            icon={faCheckCircle}
            onClick={this.setActiveWorkout}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className="fa-lg wc-x"
            onClick={() => this.props.deleteWorkout(this.props.workout)}
          />
          <FontAwesomeIcon
            icon={faEdit}
            className="fa-lg wc-edit"
            onClick={() => this.props.editModeOn(this.props.workout.id)}
          />
        </div>
      </div>

      // <Card className="workout-card border-primary mb-3">
      //     <Card.Header className="text-center">{this.props.workout.name}
      //     </Card.Header>
      //     <Container className="con-exercises">
      //         <Row noGutters={true}>
      //             {this.state.exercises.map(exercise => {
      //                 return (
      //                     <Col md={4} key={exercise.id}>
      //                         <Card className="exercise-plan text-primary">
      //                             <Card.Body>
      //                                 <div className="exercise-name underline">{exercise.name}</div>
      //                                 {exercise.plan.split('--').map((set, indx) => {
      //                                     return <div key={indx}>{set}</div>
      //                                 })}
      //                             </Card.Body>
      //                         </Card>
      //                     </Col>
      //                 )
      //             })}
      //         </Row>
      //     </Container>
      //     <hr className="hr" />
      //     <div className="icon-container">
      //         <FontAwesomeIcon id={this.props.workout.id} className="activate-icon"
      //         icon={faCheckCircle} onClick={this.setActiveWorkout} />
      //         <FontAwesomeIcon className="delete-icon" icon={faMinusCircle} />
      //         <FontAwesomeIcon className="edit-icon" icon={faEdit} />
      //     </div>
      // </Card>
    );
  }
}

export default WorkoutCard;
