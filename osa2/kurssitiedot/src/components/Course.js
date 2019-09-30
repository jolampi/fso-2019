import React from 'react'

const Header = ({ text }) => (
    <h2>{text}</h2>
)

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Content = ({ parts }) => {
    const content = () => parts.map(part =>
            <Part
                key={part.id}
                part={part}
            />
        )

    return (
        <div>
            {content()}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce( (exercises, part) => exercises + part.exercises, 0 )

    return (
        <p><b>total of {total} exercises</b></p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course
