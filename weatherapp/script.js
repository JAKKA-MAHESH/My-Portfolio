const apiKey = "fd65d74d9420768d336d2ae69fbcb138";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct"; // Geocoding API
const locationInput = document.getElementById('locationInput');
const cityList = document.getElementById('cityList'); // The datalist
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windElement = document.getElementById('wind');
const iconElement = document.getElementById('weather-icon');
const errorMessageElement = document.getElementById('error-message');

locationInput.addEventListener('input', () => { // Input event, fires on every change
    const searchTerm = locationInput.value.trim();
    if (searchTerm.length > 2) { // Suggest after 3 characters
        fetchCities(searchTerm);
    } else {
        cityList.innerHTML = ""; // Clear suggestions if input is too short
    }
});

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    }
});

locationInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

function fetchCities(searchTerm) {
    const url = `${geocodingApiUrl}?q=${searchTerm}&limit=5&appid=${apiKey}`; // Limit to 5 results

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cities => {
            cityList.innerHTML = ""; // Clear previous options

            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`; // Format: "City, State, Country"
                cityList.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
            cityList.innerHTML = ""; // Clear options on error
            const option = document.createElement('option');
            option.value = "Error fetching suggestions";
            cityList.appendChild(option);
        });
}


function fetchWeather(location) {
    errorMessageElement.textContent = "";
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("City not found.");
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            // Update the weather on the page
            locationElement.textContent = data.name + ', ' + data.sys.country;
            temperatureElement.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
            feelsLikeElement.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
            windElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;

            // Get weather icon
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconElement.innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}">`;

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            errorMessageElement.textContent = error.message;
            locationElement.textContent = "";
            temperatureElement.textContent = "";
            descriptionElement.textContent = "";
            feelsLikeElement.textContent = "";
            humidityElement.textContent = "";
            windElement.textContent = "";
            iconElement.innerHTML = "";

        });
}
