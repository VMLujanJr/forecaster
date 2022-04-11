tailwind.config = {
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        }
    }
}

// ************************************************************************
// Reference(s)
// ************************************************************************
const citySearchEl = document.querySelector('#form-search');
const citySearchInputEl = document.querySelector('#city-search');

// setup fetch data
// 1. Geocoding API to get DIRECT GEOCODING from location or zipcode; 
// Coodinates by location name;
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=a9631017536edf15efa95d8a55e62dc6;

// ************************************************************************
// Function(s)
// ************************************************************************
const searchSubmitHandler = function (event) {
    event.preventDefault(); // prevents page from refreshing

    // get value of form input
    const userInput = citySearchInputEl
        .value
        .trim();
    
    // send value to receiveCityCoordinates
    if (userInput === '' || userInput === null) {
        citySearchInputEl.classList.add("bg-red-300");
    }
    else if (userInput) {
        citySearchInputEl.classList.remove("bg-red-300");
        const userInputLowerCase = userInput.toLowerCase();

        receiveCityCoordinates(userInputLowerCase);
        citySearchInputEl.value = ""; // clear out the element's value
    }
};

const receiveCityCoordinates = function (cityName) {
    const directGeocodingApi = (`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    
    fetch(directGeocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data, cityName);
                getCityWeatherData(data, cityName);
            });
        }
        else {
            alert('Error: The city you entered was not found!');
        }
    })
    .catch(function(error) {
        // Notice that 'catch()' is chained onto the end of the previous '.then()' function
        alert('Unable to connect to OpenWeatherApi!');
    });
    // http://api.openweathermap.org/geo/1.0/direct?q=London,${stateCode},${countryCode}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6
    // we want index [2] lat and index [3] lon.
        
/*     
    const lat = getDirectGeocoding[0][2];
    const lon = getDirectGeocoding[0][3];

    console.log(lat);
    console.log(lon); */

};
/* WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history */

/* const getCityWeatherData = function(lat, lon) {
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);
}; */

// ************************************************************************
// Event Listener(s)
// ************************************************************************
citySearchEl.addEventListener("submit", searchSubmitHandler);