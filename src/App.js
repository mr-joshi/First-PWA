import React, { useState } from 'react'
import { fetchWather } from './api/fetchWeather'

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
    <div>
      <input onChange={(e) => {
        setName(e.target.value)
      }}
        value={name}
        onKeyDown={search}
      />
      {weatherData==='error'&&(
        <div>you have Entered wrong city Name</div>
      )}
      {weatherData.main && (
        <div style={{display:'flex' ,flexDirection:'column'}}>
          <span>
            {weatherData.name
            }       
         </span>
          <span>
            {weatherData.sys.country
            }
          </span>

          <span>
            {weatherData.main.temp
            }
            <sup>&deg;c</sup>
          </span>
          <span>
            {weatherData.weather[0].description
                        }
         
          </span>
        </div>
      )}
    </div>
  )
}

export default App