import React, { Component } from 'react'
import WCExerciseCard from './WCExerciseCard'
import APIManager from '../../modules/APIManager'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'

class WCExerciseList extends Component {
    state = {
        exercises: []
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

    render() {
        return (
            <>
                <div className="el-exercise-card">
                    {this.state.exercises.map((exercise, indx) => {
                        return (
                            <div key={indx}>
                                <WCExerciseCard
                                    key={exercise.id}
                                    exercise={exercise}
                                    addExercise={this.props.addExercise}
                                />
                            </div>
                        )
                    })}
                </div>
            </>

        )
    }
}

export default WCExerciseList