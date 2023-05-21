import axios from "axios";

export const fetchWather= async(query)=>{
  const  API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const  API_KEY = 'f33a484cf794d08d0148764789aaba32';

try {
  const response = await axios.get(API_URL, {
    params: {
      q: query,
      units: 'metric',
      APPID: API_KEY
    }
  });

  if (response.status === 200) {
  return response
  } 
} catch (error) {
  console.error('An error occurred during the API request:', error);
}}