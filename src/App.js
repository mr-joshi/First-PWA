import React, { useState } from 'react'
import { fetchWather } from './api/fetchWeather'
import './app.css'
const App = () => {
  const [name, setName] = useState('')
  const [weatherData, setWeatherData] = useState('')
  const search = async (e) => {
    if (e.key === 'Enter') {
      const  data = await fetchWather(name);
      setWeatherData(data?.data|| 'error');
      setName('')
    }

  }

  return (
    <div className="container">
    <input type="text"className="search"placeholder="Search..."value={name}onChange={(e) => setName(e.target.value)}onKeyPress={search}/>
    {weatherData==='error'&&(
        <div className='error'>you have Entered wrong city Name</div>
      )}
    {weatherData.main && (
        <div className="city">
            <h2 className="name">
                <span>{weatherData.name}</span>
                <sup>{weatherData.sys.country}</sup>
            </h2>
            <div className="temp">
                {Math.round(weatherData.main.temp)}
                <sup>&deg;C</sup>
            </div>
            <div className="info">
                <img className="icon" src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} />
                <p>{weatherData.weather[0].description}</p>
            </div>
        </div>
    )}
</div>

  )
}

export default App