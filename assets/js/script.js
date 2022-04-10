tailwind.config = {
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        }
    }
}
// setup fetch data
// 1. Geocoding API to get DIRECT GEOCODING from location or zipcode; 
// Coodinates by location name;
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=a9631017536edf15efa95d8a55e62dc6;

const getCityCoordinates = function (cityName) {
    const userSearch = document.querySelector('#')
    const cityName = ''; // get userInput
    const lat = '';
    const lon = '';

    const getDirectGeocoding = (`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    // http://api.openweathermap.org/geo/1.0/direct?q=London,${stateCode},${countryCode}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6
    // we want index [2] lat and index [3] lon.
};

/* WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history */

const getWeatherData = function(lat, lon) {
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);
};