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

// ************************************************************************
// Reference(s)
// ************************************************************************
const citySearchEl = document.querySelector('#form-search');
const citySearchInputEl = document.querySelector('#city-search');
const searchTermEl = document.querySelector('#searchTerm'); // implement it
const noResultsEl = document.querySelector('#no-results'); // implement it
const parentContainerEl = document.querySelector('#parent-container');

// render data;
const renderCityEl = document.querySelector('#curr-city');
const renderTempEl = document.querySelector('#curr-temp');
const renderWindEl = document.querySelector('#curr-wind');
const renderHumidityEl = document.querySelector('#curr-humidity');
const renderUvIndexEl = document.querySelector('#curr-uvindex');


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
        localStorage.setItem('History', modifiedCityName) // save searchTerm; create sep function
        citySearchInputEl.value = ''; // clear out element's value
    }
};

const fetchCityName = function (cityName) {
    const directGeocodingApi = (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=a9631017536edf15efa95d8a55e62dc6`);
    
    fetch(directGeocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                const {lat, lon, name} = data[0];
                fetchSelectedCityData(lat, lon, name);
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

/* const createCityList = function (searchCityName, cityName) {
    debugger;
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
        
       localStorage.setItem(`${city}`, `${lat}, ${lon}`);
        
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
            const cityEl = document.createElement("option");
            cityEl.setAttribute('value', `${displayFormatOptions}`);
        }   
        citiesEl.appendChild(cityEl);
    }
}; */

const fetchSelectedCityData = function (lat, lon, cityName) { // receive latitutde & longitude from selected city
    // format open weather api endpoint
    const openWeatherApiUrl = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alertsrtPara}&lang=en&units=imperial&appid=a9631017536edf15efa95d8a55e62dc6`);

    // fetch open weather api
    fetch(openWeatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                renderWeather(data, cityName);
            });
        }
    })
    .catch(function(error) {
        alert('Unable to connect to OpenWeatherApi!');
    });
};

const renderWeather = function (fetchData, cityName) {
    const {temp, wind_speed, humidity, uvi} = fetchData.current;
    const {daily} = fetchData;
    console.log(daily);

    // current weather
    renderCityEl.textContent = cityName;
    renderTempEl.innerHTML = `${temp}&#176;F`;
    renderWindEl.textContent = `${wind_speed} mph`;
    renderHumidityEl.textContent = `${humidity}% humidity`;
    renderUvIndexEl.textContent = `${uvi} UV Index`;

    // render container for 5-Day Weather Forecast
    let itfContainerEl = document.createElement('div'); // itf = in the future
    itfContainerEl.classList = 'flex flex-col items-left mx-5 p-5 border-2 rounded text-slate-100 font-bold';
    itfContainerEl.setAttribute('id', 'container-fivedays');

    // append child container // container-fivedays to parent-container
    parentContainerEl.appendChild(itfContainerEl);

    // future 5-day forecast  
    for (let i = 1; i <= 5; i++) {
        // create sections
        let dailyWeatherEl = document.createElement('section');
        dailyWeatherEl.classList = 'flex border-b-2 border-indigo-400 p-1 m-2';
        dailyWeatherEl.setAttribute('id', `subcontainer-fivedays-${i}`);

        // append sections container first...
        itfContainerEl.appendChild(dailyWeatherEl);

        // create date header
        let dateOfWeekEl = document.createElement('h2');
        dateOfWeekEl.classList = 'w-1/5';
        dateOfWeekEl.setAttribute('id', 'date');

        // add date
        let dateEl = new Date(`${daily[i].dt}` * 1000);
        dateOfWeekEl.textContent = dateEl.toDateString();
        
        // append date child to subcontainer
        dailyWeatherEl.appendChild(dateOfWeekEl);

        // create img
        let weatherIconEl = document.createElement('span');
        weatherIconEl.classList = 'justify-center w-1/5';
        
        // if weather is clear sky(☀), few clouds (⛅), scattered clouds (☁), broken clouds (), shower rain (🌧), rain (🌦), thunderstorm (⛈), snow (❄), mist (🌫)...
        let weatherCondition = daily[i].weather[0].main;

        switch (weatherCondition) {
            case 'Clear':
                weatherIconEl.textContent = '☀';
                break;
            case 'Clouds':
                weatherIconEl.textContent = '⛅';
                break;
            case 'Mist':
                weatherIconEl.textContent = '🌫';
                break;
            case 'Snow':
                weatherIconEl.textContent = '❄';
                break;
            case 'Rain':
                weatherIconEl.textContent = '🌧';
                break;
            case 'Drizzle':
                weatherIconEl.textContent = '🌦';
                break;
            case 'Thunderstorm':
                weatherIconEl.textContent = '⛈';
                break;
            default:
                weatherIconEl.textContent = '⁉';
        }

        // append to section subcontainer
        dailyWeatherEl.appendChild(weatherIconEl);

        // create unordered list
        let dailyForecastEl = document.createElement('ul');
        dailyForecastEl.classList = 'flex justify-center gap-5 w-3/5';
        dailyForecastEl.setAttribute('id', `daily-forecast`);

        // append unordered list
        dailyWeatherEl.appendChild(dailyForecastEl);

        // create list item // temperature
        let currentTempEl = document.createElement('li');
        currentTempEl.classList = 'w-1/3';
        currentTempEl.setAttribute('id', `curr-temp-${i}`);
        currentTempEl.innerHTML = `${daily[i].temp.day}&#176;F`;

        // append list item // temperature to unordered list
        dailyForecastEl.appendChild(currentTempEl);

        // create list item // wind_speed
        let currentWindEl = document.createElement('li');
        currentWindEl.classList = 'w-1/3';
        currentWindEl.setAttribute('id', `curr-wind-${i}`);
        currentWindEl.textContent = `${daily[i].wind_speed} mph`;

        // append list item // wind_speed to unordered list
        dailyForecastEl.appendChild(currentWindEl);
        
        // create list item // humidity
        let currentHumidityEl = document.createElement('li');
        currentHumidityEl.classList = 'w-1/3';
        currentHumidityEl.setAttribute('id', `curr-humidity-${i}`);
        currentHumidityEl.textContent = `${daily[i].humidity}%`;

        // append list item // humidity to unordered list
        dailyForecastEl.appendChild(currentHumidityEl);
    }
};

// ************************************************************************
// Event Listener(s)
// ************************************************************************
citySearchEl.addEventListener("submit", searchSubmitHandler);
