import axios from 'axios';

const API_KEY = 'e388bdd7c918984b063dae5d3ba2e441';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByLocation = async (lat, lon) => {
    const response = await axios.get(API_URL, {
        params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};

export const getWeatherByCity = async (city) => {
    const response = await axios.get(API_URL, {
        params: {
            q: city,
            appid: API_KEY,
            units: 'metric',
        },
    });
    return response.data;
};
