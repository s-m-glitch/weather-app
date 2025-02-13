// Get the elements
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const locationText = document.getElementById('location');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const weatherBtn = document.getElementById('get-weather-btn');

// Add loading state variable
let isLoading = false;

// Function to fetch weather data
async function getWeather(city) {
    if (isLoading) return; // Prevent multiple simultaneous requests

    // Basic input validation
    if (!/^[a-zA-Z\s-]+$/.test(city)) {
        alert('Please enter a valid city name');
        return;
    }

    try {
        isLoading = true;
        weatherBtn.disabled = true;
        weatherBtn.textContent = 'Loading...';
        weatherInfo.style.display = 'none';

        const apiKey = '02b1a95af8426d3e34b391f4632ea9b6';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        // Display weather data
        locationText.querySelector('span').textContent = `${data.name}, ${data.sys.country}`;
        temperature.querySelector('span').textContent = `${Math.round(data.main.temp)}°F`;
        condition.querySelector('span').textContent = `${data.weather[0].description}`;

        weatherInfo.style.display = 'block';
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to retrieve weather data. Please try again later.');
    } finally {
        isLoading = false;
        weatherBtn.disabled = false;
        weatherBtn.textContent = 'Get Weather';
    }
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add event listener to the button with debouncing
weatherBtn.addEventListener('click', debounce(() => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name');
    }
}, 300));

// Add enter key support
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        weatherBtn.click();
    }
});