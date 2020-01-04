import React, { Component } from 'react'
import WCExerciseCard from './WCExerciseCard'
import APIManager from '../../modules/APIManager'

class WCExerciseList extends Component {
    state = {
        exercises: []
    }


    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`workouts?userId=${creds.loggedInUserId}&_embed=exercises&_sort=name`)
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

    removeExercise = id => {
        const newExerciseList = this.state.exercises.filter(exercise => {
            return exercise.id !== id
        })
        this.setState({
            exercises: newExerciseList
        })
    }

    render() {
        return (
            <>
                <div className="we-added-exercise-container">
                    {this.state.exercises.map((exercise, indx) => {
                        if (exercise.workoutId !== this.props.workoutId) {
                            return (
                                <div key={indx}>
                                    <WCExerciseCard
                                        key={exercise.id}
                                        exercise={exercise}
                                        addExercise={this.props.addExercise}
                                        removeExercise={this.removeExercise}
                                    />
                                </div>
                            )
                        } else {
                            return <div key={indx}></div>
                        }
                    })}
                </div>
            </>

        )
    }
}

export default WCExerciseList