import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import APIManager from '../../modules/APIManager'
import './Home.css'

class ActiveWorkout extends Component {

    saveActiveWorkout = () => {
        this.props.exercises.forEach(exercise => {
            let resultString = ""
            for (let property in this.refs) {
                if (property.includes(exercise.name)) {
                    resultString += `${this.refs[property].value} ${exercise.type}--`
                }
            }
            resultString = resultString.slice(0, (resultString.length - 2))
            const newResultObj = {
                completedWorkoutId: this.props.activeWorkout.id,
                exerciseId: exercise.id,
                performance: resultString
            }
            APIManager.post(`results`, newResultObj)
        })
        this.props.clearActiveWorkout()
    }

    render() {
        return (
            <>
                <div>{this.props.activeWorkout.workout.name}</div>
                <div className="aw-workout-container">
                    {this.props.exercises.map(exercise => {
                        return (
                            <div key={exercise.id} className="aw-exercise-input-container">
                                <div className="aw-exercise-container">
                                    <div>{exercise.name}</div>
                                    {exercise.plan.split('--').map((set, indx) => {
                                        return <div className="aw-set" key={indx}>{set}</div>
                                    })}
                                </div>
                                <div className="aw-input-container">
                                    <div>{exercise.format.split('-')[0]}</div>
                                    {exercise.plan.split('--').map((set, indx) => {
                                        return (
                                            <div key={indx}>
                                                <input type="text" className="aw-input"
                                                    ref={`${exercise.name}-${indx}`}></input>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <FontAwesomeIcon icon={faMinusCircle} onClick={this.props.deleteActiveWorkout} />
                    <FontAwesomeIcon icon={faSave} onClick={this.saveActiveWorkout} />
                </div>
            </>













            // <>
            //     {(this.props.activeWorkout.workout.name !== "") ?
            //         <Card className="aw-card">
            //             <Card.Header>{this.props.activeWorkout.workout.name}</Card.Header>
            //             <Container className="aw-container">
            //                 <Row noGutters={true}>
            //                     {this.props.exercises.map(exercise => {
            //                         return (
            //                             <Col md={4} key={exercise.id}>
            //                                 <div className="set-input-container">
            //                                     <div className="set-container">
            //                                         <div className="aw-exercise-name">{exercise.name}</div>
            //                                         {exercise.plan.split('--').map((set, indx) => {
            //                                             return (
            //                                                 <div key={indx} className="set">{set}</div>
            //                                             )
            //                                         })}
            //                                     </div>
            //                                     <div className="input-container">
            //                                         <div>{exercise.type}</div>
            //                                         {exercise.plan.split('--').map((set, indx) => {
            //                                             return (
            //                                                 <input key={indx} type="text" className="input"
            //                                                 ref={`${exercise.name}-${indx}`}></input>
            //                                             )
            //                                         })}
            //                                     </div>
            //                                 </div>
            //                             </Col>
            //                         )
            //                     })}
            //                 </Row>
            //             </Container>
            //             <div className="icon-container">
            //                 <FontAwesomeIcon className="aw-remove-icon" icon={faMinusCircle} onClick={this.props.removeActiveWorkout} />
            //                 <FontAwesomeIcon className="aw-save-icon" icon={faSave} onClick={this.saveActiveWorkout} />
            //             </div>
            //         </Card>
            //         :
            //         <></>
            //     }
            // </>
        )
    }
}

export default ActiveWorkout