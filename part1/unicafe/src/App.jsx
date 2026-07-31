import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => <p>{text} {value}</p>

const Statistics = (props) => {
  if(props.total === 0){
    return (
      <div>no feedback given</div>
    )
  }
  return (
    <div>
      <StatisticLine text='good' value = {props.good} />
      <StatisticLine text='neutral' value = {props.neutral} />
      <StatisticLine text='bad' value = {props.bad} />
      <StatisticLine text='all' value = {props.total} />
      <StatisticLine text='average' value = {props.average} />
      <StatisticLine text='positive' value = {props.positive + '%'} />
    </div>
  )
}

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
