import React, { Component } from 'react'
import Chart from "chart.js";

Chart.defaults.global.elements.line.tension = 0

export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");

        new Chart(myChartRef, {
            type: "line",
            data: {
                datasets: [{
                    label: 'First dataset',
                    data: [10, 20, 18, 22]
                }],
                labels: ['January', 'February', 'March', 'April']
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 50
                        }
                    }]
                }
            }
        }
        )
    }

    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}