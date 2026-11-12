import { useCounterStore } from "../store"

const Statistics = () => {
  const good = useCounterStore(state => state.good)
  const neutral = useCounterStore(state => state.neutral)
  const bad = useCounterStore(state => state.bad)
  const all = useCounterStore(state => state.all)
  const average = all === 0 ? 0 : ((good * 1) + (neutral * 0) + (bad * -1)) / all
  const positive = all === 0 ? 0 : (good/all) * 100
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive} %</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
