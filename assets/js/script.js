// ************************************************************************
// Tailwind CSS configurations
// ************************************************************************
tailwind.config = {
    theme: {
        extend: {
            colors: {
                clifford: '#da373d',
            }
        }
    }
}

/* debugger; */

// ************************************************************************
// Reference(s)
// ************************************************************************
const citySearchEl = document.querySelector('#form-search');
const citySearchInputEl = document.querySelector('#city-search');
const citiesEl = document.querySelector('#cities');
const searchTermEl = document.querySelector('#searchTerm');
const noResultsEl = document.querySelector('#no-results');

// display data; not yet assigned
/* const displayCityEl = document.querySelector('#display-city');
const displayTempEl = document.querySelector('#display-temp');
const displayWindEl = document.querySelector('#display-wind');
const displayHumidityEl = document.querySelector('#display-humidity');
const displayUvIndexEl = document.querySelector('#display-uvindex'); */

// ************************************************************************
// Function(s)
// ************************************************************************
const searchSubmitHandler = function (event) {
    event.preventDefault(); // prevents page from refreshing

    // get value of form input
    const userInput = citySearchInputEl
        .value
        .trim();
    
    // send value to fetchCityName
    if (userInput === '' || userInput === null) {
        citySearchInputEl.classList.add("bg-red-300");
    }
    else if (userInput) {
        citySearchInputEl.classList.remove("bg-red-300");
        const modifiedCityName = userInput.toLowerCase();

        fetchCityName(modifiedCityName);
        citySearchInputEl.value = ''; // clear out element's value
    }
};

const fetchCityName = function (cityName) {
    const directGeocodingApi = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    
    fetch(directGeocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                createCityList(data, cityName);
            });
        }
        else {
            alert('Error: The city you entered was not found!');
        }
    })
    .catch(function(error) {
        // Notice that 'catch()' is chained onto the end of the previous '.then()' function
        alert('Unable to connect to Direct Geocoding Api!');
    });
};

const createCityList = function (searchCityName, cityName) {
    citiesEl.textContent = ''; // clears old content
    noResultsEl.textContent = ''; // clears old content
    searchTermEl.textContent = cityName; // supposed to add new search term on search for city

    // check if initial search yielded any results
    if (searchCityName.length === 0) {
        noResultsEl.textContent = 'This search did not yield results';
    }

    // create a loop over cities found
    for (let i = 0; i < searchCityName.length; i++) {
        const city = searchCityName[i].name;
        const state = searchCityName[i].state; // state might return undefined
        const country = searchCityName[i].country;
        const lat = searchCityName[i].lat;
        const lon = searchCityName[i].lon;

        // create option element
        const cityEl = document.createElement("option");
        cityEl.setAttribute('data-id', `${i}`);
        cityEl.setAttribute('data-lat', `${lat}`);
        cityEl.setAttribute('data-lon', `${lon}`);
        
       /*  localStorage.setItem(`${city}`, `${lat}, ${lon}`); */
        
        // if state is undefined, empty, or null
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
        citiesEl.appendChild(cityEl);
    }
};

/* const fetchSelectedCityData = function (lat, lon) { // receive latitutde & longitude from selected city
    // format open weather api endpoint
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);

    // fetch open weather api
    fetch(openWeatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                // send data to... which function?
                // functionName('parameter')
            });
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeatherApi!');
    });
};

const displaySelectedCityData = function (selectedCity) {
    const currentCityWeather = selectedCity.current;



} */

// ************************************************************************
// Event Listener(s)
// ************************************************************************
citySearchEl.addEventListener("submit", searchSubmitHandler);