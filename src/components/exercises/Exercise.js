import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import './Exercises.css'

class Exercise extends Component {
    
    render() {
        return (
            <Card className="exercise-card border-primary mb-3">
                <Card.Header className="text-center">{this.props.exercise.name}</Card.Header>
                <Card.Body>
                    <div className="exercise-name">{this.props.exercise.name}</div>
                    {this.props.exercise.plan.split('--').map((set, indx) => {
                        return <div key={indx} className="text-primary">{set}</div>
                    })}
                </Card.Body>
            </Card>
        )
    }
}

export default Exercise