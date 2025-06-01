import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { getWeatherByLocation, getWeatherByCity } from './api/weather';
import './App.css';

function App() {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('');
    const [locationWeather, setLocationWeather] = useState(null);
    const [error, setError] = useState(null);

    // Function to fetch weather by city
    const fetchWeatherByCity = async () => {
        try {
            const data = await getWeatherByCity(city);
            setWeather(data);
            setError(null);
        } catch (err) {
            setError('Could not fetch weather data');
        }
    };

    // Function to fetch weather by current location
    const fetchWeatherByLocation = async (lat, lon) => {
        try {
            const data = await getWeatherByLocation(lat, lon);
            setLocationWeather(data);
            setError(null);
        } catch (err) {
            setError('Could not fetch weather data');
        }
    };

    // Get the user's current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                },
                (err) => {
                    setError('Could not get location');
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        getCurrentLocation(); // Automatically fetch weather by location on load
    }, []);

    const handleSearchChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchWeatherByCity();
    };

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'Clear':
                return '☀️';
            case 'Clouds':
                return '☁️';
            case 'Rain':
                return '🌧️';
            case 'Snow':
                return '❄️';
            default:
                return '🌥️';
        }
    };

    return (
        <div className="app-container">
          <div className="myapp">
            <div className="weather-header">
                <h1>Weather App</h1>
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search city"
                        value={city}
                        onChange={handleSearchChange}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {error && <div className="error">{error}</div>}

            {(weather || locationWeather) && (
                <div className="weather-info">
                    <div className="location">
                        {weather ? weather.name : locationWeather.name}
                    </div>
                    <div className="temperature">
                        {weather
                            ? `${weather.main.temp}°C`
                            : `${locationWeather.main.temp}°C`}
                    </div>
                    <div className="weather-condition">
                        {weather
                            ? getWeatherIcon(weather.weather[0].main)
                            : getWeatherIcon(locationWeather.weather[0].main)}
                    </div>
                    <div className="details">
                        <div>Humidity: {weather ? weather.main.humidity : locationWeather.main.humidity}%</div>
                        <div>Pressure: {weather ? weather.main.pressure : locationWeather.main.pressure} hPa</div>
                        <div>
                            Max Temp: {weather ? weather.main.temp_max : locationWeather.main.temp_max}°C
                        </div>
                        <div>
                            Min Temp: {weather ? weather.main.temp_min : locationWeather.main.temp_min}°C
                        </div>
                    </div>
                    <div className="time">
                        {moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default App;
