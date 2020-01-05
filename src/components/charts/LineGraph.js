import React, { Component } from 'react'
import Chart from "chart.js";

Chart.defaults.global.elements.line.tension = 0

export default class LineGraph extends Component {
    chartRef = React.createRef();

    state = {

    }

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "line",
            data: {
                datasets: [{
                    label: this.props.yLabelPrimary,
                    data: this.props.yAxisPrimary
                }],
                labels: this.props.xAxis
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            // min: 0,
                            // max: 50
                        }
                    }]
                }
            }
        }
        )
    }

    render() {
        console.log("line graph props: ", this.props)
        return (
            <>
                {(this.props.xAxis === [])
                ?
                    <></>
                :
                    <div>
                        <canvas
                            id="myChart"
                            ref={this.chartRef}
                        />
                    </div>
                }
            </>
        )
    }
}