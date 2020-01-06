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

    convertDateTimeFromISO(date) {
        return new Date(date)
    }

    componentDidMount() {
        const creds = JSON.parse(localStorage.getItem("credentials"))
        APIManager.get(`completedWorkouts?userId=${creds.loggedInUserId}&_sort=date&_order=desc&_embed=results&_expand=workout`)
            .then(completedWorkoutsR => {

                const cwReversedList = completedWorkoutsR.reverse()
                this.setState({
                    cwList: cwReversedList
                })

                APIManager.get(`workouts?_embed=exercises&userId=${creds.loggedInUserId}`)
                    .then(workoutTemplatesR => {

                        const templateList = []
                        for (let template of workoutTemplatesR) {
                            for (let cw of completedWorkoutsR) {
                                if (template.id === cw.workoutId) {
                                    templateList.push(template)
                                    break
                                }
                            }
                        }

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
                        this.setState({
                            cwExerciseList: cwExerciseList
                        })
                        
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

                        const regex = /[0-9]/
                        uniqueExerciseList = uniqueExerciseList.filter(exercise => {
                            return !regex.test(exercise.name)
                        })

                        const reactSelectArray = []
                        uniqueExerciseList.forEach(exercise => {
                            reactSelectArray.push({ label: exercise.name, value: exercise })
                        })

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

                    cw.results.forEach(result => {
                        correspondingExerciseList.forEach(exercise => {
                            if (result.exerciseId === exercise.id) {
                                if (this.state.selectedExercise.format === "reps-bodyweight" || this.state.selectedExercise.format === "min" || this.state.selectedExercise.format === "sec") {

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
                        data={{ labels: this.state.xAxis, datasets: [{ label: this.state.yPrimaryLabel, data: this.state.yAxisPrimary, backgroundColor: 'rgba(9, 253, 255, 0)', borderColor: 'rgba(9, 253, 255, 1)' }] }}
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
                        data={{ labels: this.state.xAxis, datasets: [{ label: this.state.ySecondaryLabel, data: this.state.yAxisSecondary, backgroundColor: 'rgba(9, 253, 255, 0)', borderColor: 'rgba(9, 253, 255, 1)' }] }}
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