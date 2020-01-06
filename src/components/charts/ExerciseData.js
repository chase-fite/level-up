import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import APIManager from '../../modules/APIManager'
import Select from 'react-select'
import './ExerciseData.css'

const reactSelectStyle = {
    menu: (provided, state) => ({
        ...provided,
        width: '200px'
    }),
    option: (provided, state) => ({
        ...provided,
        width: '200px'
    }),
    control: (base, state) => ({
        ...base,
        border: '1px solid grey',
        boxShadow: '1px solid grey',
        '&:hover': {
            border: '1px solid grey'
        },
        width: '200px'
    })
}

class ExerciseData extends Component {

    state = {
        monthList: [
            { label: 'Jan', value: 'Jan' },
            { label: 'Feb', value: 'Feb' },
            { label: 'Mar', value: 'Mar' },
            { label: 'Apr', value: 'Apr' },
            { label: 'May', value: 'May' },
            { label: 'Jun', value: 'Jun' },
            { label: 'Jul', value: 'Jul' },
            { label: 'Aug', value: 'Aug' },
            { label: 'Sep', value: 'Sep' },
            { label: 'Oct', value: 'Oct' },
            { label: 'Nov', value: 'Nov' },
            { label: 'Dec', value: 'Dec' }
        ],
        yearList: [],
        startMonth: "",
        startYear: "",
        lengthOfTime: 0,
        lengthOfTimeMonths: [
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
        ],
        // exerciseSelection: [],
        reactExerciseSelect: [],
        cwList: [],
        cwExerciseList: [],
        selectedExercise: {
            format: ""
        },
        xAxis: [],
        yAxisPrimary: [],
        yAxisSecondary: [],
        yPrimaryLabel: "",
        ySecondaryLabel: "",
        graphTypeSelect: [],
        graphType: ""
    }

    // we need a list of all the exercises that are included in our completed workouts so we can populate the graph with that data

    convertDateTimeFromISO(date) {
        return new Date(date)
    }

    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`)
            .then(completedWorkoutsR => {
                // console.log("ED completed workout results: ", completedWorkoutsR)
                const cwReversedList = completedWorkoutsR.reverse()
                this.setState({
                    cwList: cwReversedList
                })

                APIManager.get(`workouts?_embed=exercises&userId=${creds.loggedInUserId}`)
                    .then(workoutTemplatesR => {
                        // console.log("ED workout templates: ", workoutTemplatesR)

                        // i want a list of all the exercises in completed workouts

                        // ok first lets grab a list of all the templates that are used in completed workouts
                        const templateList = []
                        for (let template of workoutTemplatesR) {
                            for (let cw of completedWorkoutsR) {
                                if (template.id === cw.workoutId) {
                                    templateList.push(template)
                                    break
                                }
                            }
                        }
                        // console.log("ED template list: ", templateList)

                        let cwExerciseList = []
                        for (let template of templateList) {
                            for (let exercise of template.exercises) {
                                let contains = false
                                for (let listedExercise of cwExerciseList) {
                                    if (exercise.id === listedExercise.id) {
                                        contains = true
                                        break
                                    }
                                }
                                if (contains === false) {
                                    cwExerciseList.push(exercise)
                                }
                            }
                        }
                        // console.log("ED cwExerciseList: ", cwExerciseList)
                        this.setState({
                            cwExerciseList: cwExerciseList
                        })
                        
                        // ok now that we have our template list, we need to a list of unique exercises
                        let uniqueExerciseList = []
                        for (let template of templateList) {
                            for (let exercise of template.exercises) {
                                let contains = false
                                for (let listedExercise of uniqueExerciseList) {
                                    if (exercise.name === listedExercise.name) {
                                        contains = true
                                        break
                                    }
                                }
                                if (contains === false) {
                                    uniqueExerciseList.push(exercise)
                                }
                            }
                        }

                        // uniqueExerciseList.forEach(exercise => console.log("ED unique exercise name: ", exercise.name))

                        // sweet ok, now we have a unique list of exercises based on their name

                        // now we need to make sure we remove duplicates that are just higher level exercises
                        const regex = /[0-9]/
                        uniqueExerciseList = uniqueExerciseList.filter(exercise => {
                            return !regex.test(exercise.name)
                        })

                        const reactSelectArray = []
                        uniqueExerciseList.forEach(exercise => {
                            reactSelectArray.push({ label: exercise.name, value: exercise })
                        })

                        // i need a list of unique years from my completed workouts
                        const years = []
                        completedWorkoutsR.forEach(cw => {
                            if (!years.includes(this.convertDateTimeFromISO(cw.date).toDateString().split(' ')[3])) {
                                const year = this.convertDateTimeFromISO(cw.date).toDateString().split(' ')[3]
                                years.push(year)
                            }
                        })
                        const yearsSelectArray = years.map(year => {
                            return { label: year, value: year }
                        })

                        this.setState({
                            // exerciseSelection: uniqueExerciseList,
                            reactExerciseSelect: reactSelectArray,
                            yearList: yearsSelectArray
                        })

                    })
            })
    }

    convertMonthsFromSelect = monthArray => {
        const resultMonthArray = []
        for (let date of monthArray) {
            resultMonthArray.push(date.value)
        }
        return resultMonthArray
    }

    createTimeframe = (startMonth, startYear, numOfMonths) => {
        const monthArray = this.convertMonthsFromSelect(this.state.monthList)
        const timeframe = []
        let currentYear = startYear
        let counter = numOfMonths - 1
        for (let i = monthArray.indexOf(startMonth); i < 12; i++) {
            timeframe.push({ month: monthArray[i], year: currentYear })
            if (i === 11 && counter !== 0) {
                i = -1
                currentYear++
                currentYear = currentYear.toString()
            }
            if (counter === 0) {
                break
            }
            counter--
        }
        // console.log("timeframe", timeframe)
        return timeframe
    }

    setStartMonth = month => {
        this.setState({
            startMonth: month
        })
    }

    setStartYear = year => {
        this.setState({
            startYear: year
        })
    }

    setLengthOfTime = num => {
        this.setState({
            lengthOfTime: num
        })
    }

    setCorrespondingExerciseList = () => {
        const idList = [this.state.selectedExercise.id]
        const exerciseList = [this.state.selectedExercise]
        this.state.cwExerciseList.forEach(exercise => {
            console.log("ED exercise name: ", exercise.name)
            console.log("ED exercise workoutId: ", exercise.workoutId)
            if (exercise.name.toLowerCase().includes(this.state.selectedExercise.name.toLowerCase())) {
                if (!idList.includes(exercise.id)) {
                    idList.push(exercise.id)
                    exerciseList.push(exercise)
                }
            }
        })
        return exerciseList
    }

    formatDateForGraph = date => {
        const firstSplit = date.split('T')
        const secondSplit = firstSplit[0]
        const thirdSplit = secondSplit.split('-')
        let result = `${thirdSplit[1]}/${thirdSplit[2]}/${thirdSplit[0]}`
        return result
    }

    generateGraph = () => {
        const xAxis = []
        const yAxisPrimary = []
        const yAxisSecondary = []
        let yPrimaryLabel = this.state.selectedExercise.format.split('-')[0]
        let ySecondaryLabel = this.state.selectedExercise.format.split('-')[1]

        const correspondingExerciseList = this.setCorrespondingExerciseList()
        const timeframe = this.createTimeframe(this.state.startMonth, this.state.startYear, this.state.lengthOfTime)
        this.state.cwList.forEach(cw => {
            for (let date of timeframe) {
                if (this.convertDateTimeFromISO(cw.date).toDateString().split(' ')[1] === date.month && this.convertDateTimeFromISO(cw.date).toDateString().split(' ')[3] === date.year) {


                    // now we need to make sure our chosen exercise is within this cw result array
                    cw.results.forEach(result => {
                        correspondingExerciseList.forEach(exercise => {
                            if (result.exerciseId === exercise.id) {
                                // console.log("this date was within our timeframe: ", this.formatDateForGraph(cw.date))
                                // console.log("plan: ", exercise.plan)
                                // console.log("performance: ", result.performance)

                                // we want to check the format and produce averages based on that i think
                                if (this.state.selectedExercise.format === "reps-bodyweight" || this.state.selectedExercise.format === "min" || this.state.selectedExercise.format === "sec") {

                                    // plan:  set 1: 12 reps, 30 lbs--set 2: 10 reps, 35 lbs--set 3: 8 reps, 40 lbs
                                    // performance:  10 reps--8 reps--8 reps

                                    xAxis.push(this.formatDateForGraph(cw.date))


                                    const performanceSplit = result.performance.split('--')
                                    const primaryData = performanceSplit.map(data => {
                                        return data.split(' ')[0]
                                    })
                                    let primaryAverage = 0
                                    primaryData.forEach(data => {
                                        primaryAverage += Number(data)
                                    })
                                    primaryAverage = primaryAverage / primaryData.length
                                    primaryAverage = primaryAverage.toPrecision(2)
                                    yAxisPrimary.push(Number(primaryAverage))
                                    // console.log("primary average", primaryAverage)


                                } else {
                                    xAxis.push(this.formatDateForGraph(cw.date))


                                    const performanceSplit = result.performance.split('--')
                                    const primaryData = performanceSplit.map(data => {
                                        return data.split(' ')[0]
                                    })
                                    let primaryAverage = 0
                                    primaryData.forEach(data => {
                                        primaryAverage += Number(data)
                                    })
                                    primaryAverage = primaryAverage / primaryData.length
                                    primaryAverage = primaryAverage.toPrecision(2)
                                    yAxisPrimary.push(Number(primaryAverage))
                                    // console.log("primary average", primaryAverage)


                                    const planSplit = exercise.plan.split('--')
                                    const secondaryData = planSplit.map(data => {
                                        return data.split(' ')[4]
                                    })
                                    let secondaryAverage = 0
                                    secondaryData.forEach(data => {
                                        secondaryAverage += Number(data)
                                    })
                                    secondaryAverage = secondaryAverage / secondaryData.length
                                    secondaryAverage = secondaryAverage.toPrecision(2)
                                    yAxisSecondary.push(Number(secondaryAverage))
                                    // console.log("secondary average", secondaryAverage)   
                                }
                            }
                        })
                    })
                }
            }
        })
        this.setState({
            xAxis: xAxis,
            yAxisPrimary: yAxisPrimary,
            yAxisSecondary: yAxisSecondary,
            yPrimaryLabel: yPrimaryLabel,
            ySecondaryLabel: ySecondaryLabel
        })

    }

    componentDidUpdate() {


    }

    setExercise = ex => {
        this.setState({
            selectedExercise: ex
        })
        setTimeout(() => {
            let graphTypeSelect = []
            const format = this.state.selectedExercise.format
            if (this.state.selectedExercise.format === "reps-bodyweight" || this.state.selectedExercise.format === "min" || this.state.selectedExercise.format === "sec") {
                graphTypeSelect = [{ label: format.split('-')[0], value: "primary" }]
            } else {
                graphTypeSelect = [
                    { label: format.split('-')[0], value: "primary" },
                    { label: format.split('-')[1], value: "secondary" }
                ]
            }
            this.setState({
                graphTypeSelect: graphTypeSelect
            })
        }, 200)

    }

    selectGraphType = data => {
        this.setState({
            graphType: data
        })
    }

    render() {
        console.log(this.state)
        return (
            <div className="ed-main-container">
                <Select className="react-select-com" styles={reactSelectStyle} placeholder="Exercise" options={this.state.reactExerciseSelect} onChange={opt => this.setExercise(opt.value)} />
                <Select className="react-select-com" styles={reactSelectStyle} placeholder="Starting Month" options={this.state.monthList} onChange={opt => this.setStartMonth(opt.value)} />
                <Select className="react-select-com" styles={reactSelectStyle} placeholder="Starting Year" options={this.state.yearList} onChange={opt => this.setStartYear(opt.value)} />
                <Select className="react-select-com" styles={reactSelectStyle} placeholder="Number of Months" options={this.state.lengthOfTimeMonths} onChange={opt => this.setLengthOfTime(opt.value)} />
                <Select className="react-select-com" styles={reactSelectStyle} placeholder="Graph Data" options={this.state.graphTypeSelect} onChange={opt => this.selectGraphType(opt.value)} />
                <button className="select-button" onClick={this.generateGraph}>Generate Graph</button>

                {(this.state.graphType === "primary")
                ?
                <div>
                    <Line
                        data={{ labels: this.state.xAxis, datasets: [{ label: this.state.yPrimaryLabel, data: this.state.yAxisPrimary }] }}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: Math.ceil(this.state.yAxisPrimary[0] - 5) || 0,
                                        max: this.state.yAxisPrimary[this.state.yAxisPrimary.length - 1] + 10 || 50
                                    }
                                }]
                            }
                        }}
                    />
                </div>
                :
                <div>
                    <Line
                        data={{ labels: this.state.xAxis, datasets: [{ label: this.state.ySecondaryLabel, data: this.state.yAxisSecondary }] }}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: Math.ceil(this.state.yAxisSecondary[0] - 5) || 0,
                                        max: this.state.yAxisSecondary[this.state.yAxisSecondary.length - 1] + 10 || 50
                                    }
                                }]
                            }
                        }}
                    />
                </div>
                }
            </div>
        )
    }

}

export default ExerciseData