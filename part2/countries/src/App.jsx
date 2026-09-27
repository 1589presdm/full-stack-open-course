import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const countriesToShow = value === ''
  ? []
  : countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />

      <div>
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
          <ul>
            {countriesToShow.map(country => (
              <li key = {country.cca3}>{country.name.common}</li>
            ))}
          </ul>
        )}

        {countriesToShow.length === 1 && (
          <div>
            <h1>{countriesToShow[0].name.common}</h1>
            <p>capital {countriesToShow[0].capital}</p>
            <p>area {countriesToShow[0].area}</p>
          </div>
        )}
      </div>
    </div>
  )

}

export default App
