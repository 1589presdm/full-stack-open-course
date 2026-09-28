import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  const countriesToShow = value === ''
    ? []
    : countries.filter(c => c.name.common.toLowerCase().includes(value.toLowerCase()))

  const country = countriesToShow.length === 1 ? countriesToShow[0] : null


  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (country) {
      const capital = country.capital[0]
      const api_key = import.meta.env.VITE_SOME_KEY
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [country])


  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleShow = (countryName) => {
    setValue(countryName)
  }

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />

      <div>
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {countriesToShow.length <= 10 && countriesToShow.length > 1 && (
          <div>
            <ul>
              {countriesToShow.map(country => (
                <li key={country.cca3}>
                  {country.name.common} <button onClick={() => handleShow(country.name.common)}>Show</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {countriesToShow.length === 1 && (
          <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(country.languages || {}).map(lang => (
                <li key={lang}>{lang}</li>
              ))}
            </ul>
            <img src={country.flags.png} alt={country.name.common} width={150} />
            {weather && (
              <div>
                <h1>Weather in {country.capital}</h1>
                <p>Temperature {weather.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <p>Wind {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

}

export default App
