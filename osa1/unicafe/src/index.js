import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
)

const Statistics = ({ good, neutral, bad }) => {
    const all = good.count + neutral.count + bad.count

    if (all <= 0) return (
        <p>No feedback given</p>
    )
    
    const average = ( good.count - bad.count ) / all
    const positive = 100 * good.count / all

    return (
        <table>
            <tbody>
                <Statistic text={good.name} value={good.count} />
                <Statistic text={neutral.name} value={neutral.count} />
                <Statistic text={bad.name} value={bad.count} />
                <Statistic text="all" value={all} />
                <Statistic text="average" value={average} />
                <Statistic text="positive" value={positive + " %"} />
            </tbody>
        </table>
    )   
}

const Statistic = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState({name: "good", count: 0})
    const [neutral, setNeutral] = useState({name: "neutral", count: 0})
    const [bad, setBad] = useState({name: "bad", count: 0})

    return (
        <div>
            <Header text="give feedback" />
            <Button onClick={() => setGood({ ...good, count: good.count+1 })} text={good.name} />
            <Button onClick={() => setNeutral({ ...neutral, count: neutral.count+1} )} text={neutral.name} />
            <Button onClick={() => setBad({ ...bad, count: bad.count+1 })} text={bad.name} />
            <Header text="statistics" />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
