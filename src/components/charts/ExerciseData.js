import React, { Component } from 'react'
import LineGraph from './LineGraph'
import APIManager from '../../modules/APIManager'

class ExerciseData extends Component {

    state = {
        completedWorkouts: [],
        selectedExerciseId: 0,
        dates: [],
        averages: []
    }

    convertDateTimeFromISO(date) {
        return new Date(date)
    }

    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`)
            .then(completedWorkoutsR => {
                let temp = completedWorkoutsR.filter(workout => {
                    return workout.active === false
                })
                console.log("exercise data filtered cw", temp)

                // ok so we have all our dates and results, now we just need the weight or secondary stat
                APIManager.get(`workouts?_embed=exercises&userId=${creds.loggedInUserId}`)
                    .then(workoutTemplatesR => {
                        console.log("exercise data workout templates get", workoutTemplatesR)

                        temp.forEach((cw, indx) => {
                            console.log("cw date: ", this.convertDateTimeFromISO(cw.date))
                            
                        })

                    })
            })
    }

    render() {
        return (
            <>
                <LineGraph />
            </>
        )
    }

}

export default ExerciseData