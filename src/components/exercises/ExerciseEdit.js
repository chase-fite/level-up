import React, { Component } from 'react'
import APIManager from '../../modules/APIManager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import './Exercises.css'

class ExerciseEdit extends Component {

    saveExercise = () => {
        let planString = ""
        if (this.props.exercise.format === "min" || this.props.exercise.format === "sec") {
            for(let property in this.refs) {
                if(this.refs[property].value) {
                    if (property.toString().includes("firstInput")) {
                        planString += `set ${property.toString().split('-')[1]}: ${this.refs[property].value} ${this.props.exercise.format}--`
                    }
                } else {
                    window.alert("Please fill in all input fields")
                    break
                }
            }
            planString = planString.slice(0, (planString.length - 2))
        } else if(this.props.exercise.format.split('-')[1] === "bodyweight") {
            for(let property in this.refs) {
                if(this.refs[property].value) {
                    if (property.toString().includes("firstInput")) {
                        planString += `set ${property.toString().split('-')[1]}: ${this.refs[property].value} ${this.props.exercise.format.split('-')[0]}, ${this.props.exercise.format.split('-')[1]}--`
                    }
                } else {
                    window.alert("Please fill in all input fields")
                    break
                }
            }
            planString = planString.slice(0, (planString.length - 2))
        } else {
            let tempString = ""
            for(let property in this.refs) {
                if(this.refs[property].value) {
                    if(property.toString().includes('firstInput')) {
                        tempString += `set ${property.toString().split('-')[1]}: ${this.refs[property].value} ${this.props.exercise.format.split('-')[0]}, `
                    }
                    if (property.toString().includes('secondInput')) {
                        tempString += `${this.refs[property].value} ${this.props.exercise.format.split('-')[1]}--`
                        planString += tempString
                        tempString = ""
                    }
                } else {
                    window.alert("Please fill in all input fields")
                    break
                }
            }
            planString = planString.slice(0, (planString.length - 2))
        }

        const newExercise = {
            id: this.props.exercise.id,
            workoutId: this.props.exercise.workoutId,
            format: this.props.exercise.format,
            name: this.props.exercise.name,
            plan: planString
        }

        APIManager.update('exercises', newExercise)
        .then(this.props.editModeOffWithGet)
    }

    render() {
        return (
            <div className="ec-exercise-container">
                <div>{this.props.exercise.name}</div>
                {this.props.exercise.plan.split('--').map((set, indx) => {
                    return (
                        <div key={indx} className="ee-input-container">{`set ${indx + 1}:`}&nbsp;
                            <input type="text" className="ee-input" defaultValue={set.split(' ')[2]} ref={`firstInput-${indx + 1}`}></input>&nbsp;
                            {`${this.props.exercise.format.split('-')[0]}`}
                            {(this.props.exercise.format === "min" || this.props.exercise.format === 'sec')
                                ?
                                <></>
                                :
                                <>
                                    {(this.props.exercise.format.split('-')[1] === "bodyweight")
                                        ?
                                        <div>,&nbsp;bodyweight</div>
                                        :
                                        <>
                                            <div>,&nbsp;</div>
                                            <input type="text" className="ee-input" defaultValue={set.split(' ')[4]} ref={`secondInput-${indx + 1}`}></input>&nbsp;
                                                {`${this.props.exercise.format.split('-')[1]}`}
                                        </>
                                    }
                                </>
                            }
                        </div>
                    )
                })}
                <FontAwesomeIcon icon={faSave} className="fa-lg ee-edit" onClick={this.saveExercise}/>
                <FontAwesomeIcon icon={faMinusCircle} className="fa-lg ee-minus" onClick={this.props.editModeOff} />
            </div>
        )
    }
}

export default ExerciseEdit