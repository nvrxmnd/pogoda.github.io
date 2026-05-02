const API_KEY ='ccd5d7b9-e8bb-4dce-9576-f664a0c2dae1';

const BASE_URL ='https://api.weather.yandex.ru/v2/forecast?lat=52.37125%lon=4.89388';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const weatherInfo = document.getElementById('weatherInfo');
const cityName =document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescrpition = document.getElementById('weatherDescrpition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

let currentCity = '';

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
      getWeatherData(city);
  }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

refreshBtn.addEventListener('click', () => {
    if (currentCity) {
        getWeatherDat(currentCity);
    }
});

async function getWeatherData(city) {
    showLoading();

    try {
        const response = await fetch (`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ru`);

        if (!response.ok) {
            throw new Error('Город не найден');
        }
        const data = await response.json();
        currentCity = city;
        displayWeatherData(data);
        hideLoading();
        } catch (error) {
        hideLoading ();
        showError (error.message);
    }
}
function displayWeatherData(data) {
    hideError();
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    const date = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    currentDate.textContent = date.toLocaleDateString('ru-RU', options);
    temperature.textContent = Math.round(data.main.temp);
    weatherDescrpition.textContent = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} м/с`;
    const pressureMmHg = Math.round(data.main.pressure * 0.750062);
    pressure.textContent = `${pressureMmHg} мм рт. ст.`;
    weatherInfo.classList.remove(`hidden`);
    weatherInfo.style.animation='none';
    weatherInfo.offset.animation='fadeIn 0.5s ease-in';
}
function showLoading () {
    loading.classList.remove ('hidden');
    weatherInfo.classlist.add('hidden');
    error.classlist.add('hidden');
}
function hideLoading () {
    loading.classList.remove ('hidden');
}
function showError (message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    error.style.animation='none';
    error.offset.animation='fadeIn 0.5s ease-in';
}
function hideError() {
    error.classList.remove ('hidden');
}
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.getlocation.getCurrentPosition(
            async (position) => {
                const {latitude, longitude} = position.coords;
                showLoading();
                try {
                    const response = await fetch(
                        `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
                    );
                    if (!response.ok) {
                        throw new Error('Не удалось получить данные о погоде');
                    }
                    const data = await response.json();
                    currentCity = data.name;
                    cityInput.value = data.name;
                    displayWeatherData(data);
                    hideLoading();

                } catch (error) {
                    hideLoading();
                    showError(error.message);
                }
            },
            () => {
                showError('Не удалось получить доступ к геолокации');
            }
        );
    } else {
        showError('Геолокация не поддерживается вашим браузером');
    }
}
window.addEventListener('load', () => {
    getWeatherByLocation();
});
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}
function getWindDirection(degrees) {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}



