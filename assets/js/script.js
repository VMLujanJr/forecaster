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
const citiesEl = document.querySelector('#cities');
const searchTermEl = document.querySelector('#searchTerm');
const noResultsEl = document.querySelector('#no-results');
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
    
    // send value to receiveCityName
    if (userInput === '' || userInput === null) {
        citySearchInputEl.classList.add("bg-red-300");
    }
    else if (userInput) {
        citySearchInputEl.classList.remove("bg-red-300");
        const userInputLowerCase = userInput.toLowerCase();

        receiveCityName(userInputLowerCase);
        citySearchInputEl.value = ""; // clear out the element's value
    }
};

const receiveCityName = function (cityName) {
    const directGeocodingApi = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    
    fetch(directGeocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                extractDataInformation(data, cityName);
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

const extractDataInformation = function (cities, cityName) {
    citiesEl.textContent = ''; // clears old content
    noResultsEl.textContent = ''; // clears old content
    searchTermEl.textContent = cityName;

    // check if initial search yielded any results
    if (cities.length === 0) {
        noResultsEl.textContent = 'This search did not yield results';
    }

    // create a loop over cities found
    for (let i = 0; i < cities.length; i++) {
        const city = cities[i].name;
        const lat = cities[i].lat;
        const lon = cities[i].lon;
        let state = cities[i].state; // state might return undefined
        const country = cities[i].country;

        const cityEl = document.createElement("option");
        // 
        if (state === undefined || state === '' || state === null) {
            // format display
            const displayFormatOptionsAlt = `${city}, ${country}`;
            
            // create an option element w/o state if not available
            cityEl.setAttribute('value', `${displayFormatOptionsAlt}`);
        }
        else {
            // format display
            const displayFormatOptions = `${city}, ${state}, ${country}`;
            
            // create an option element w/ state if available
            /* const cityEl = document.createElement("option"); */
            cityEl.setAttribute('value', `${displayFormatOptions}`);
        }

        /* console.log(city, state, country); */
        citiesEl.appendChild(cityEl);
    }
};
/* WHEN I search for a city THEN I am presented with current and future conditions for that city and that city is added to the search history */

/* const getCityWeatherData = function(lat, lon) {
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);
}; */

// ************************************************************************
// Event Listener(s)
// ************************************************************************
citySearchEl.addEventListener("submit", searchSubmitHandler);
