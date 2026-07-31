import { useState } from 'react'

const Statistics = (props) => {
  if(props.total === 0){
    return (
      <div>no feedback given</div>
    )
  }
  return (
    <div>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {props.total}</p>
      <p>average {props.average}</p>
      <p>positive {props.positive} %</p>
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + neutral + bad
  const average = total === 0 ? 0 : ((good * 1) + (neutral * 0) + (bad * -1)) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  const handleGoodClick = () => setGood(good + 1)

  const handleNeutralClick = () => setNeutral(neutral + 1)

  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <h2>Give feedback</h2>
      <Button onClick = {handleGoodClick} text='good'/>
      <Button onClick = {handleNeutralClick} text='neutral'/>
      <Button onClick = {handleBadClick} text='bad'/>

      <h2>statistics</h2>
      <Statistics 
        good = {good}
        neutral = {neutral}
        bad = {bad}
        total = {total}
        average = {average}
        positive = {positive}
      />
      
    </div>
  )
}

export default App
