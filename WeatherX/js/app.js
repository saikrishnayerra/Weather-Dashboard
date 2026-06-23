const API_KEY = "0c45fbee5ebd9e726fb6cb4c34eb633c";

/* ELEMENTS */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

const themeToggle = document.getElementById("themeToggle");

/* THEME */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }

});

/* SEARCH */

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
        getForecast(city);
    }

});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        searchBtn.click();
    }

});

/* CURRENT WEATHER */

async function getWeather(city) {

    try {

        showLoading();

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        cityName.textContent = data.name;

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        description.textContent =
            data.weather[0].description;

        humidity.textContent =
            `${data.main.humidity}%`;

        wind.textContent =
            `${data.wind.speed} km/h`;

        feelsLike.textContent =
            `${Math.round(data.main.feels_like)}°C`;

        weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherIcon.alt =
            data.weather[0].description;

        updateBackground(
            data.weather[0].main,
            data.weather[0].description,
            data.main.temp
        );

    }

    catch (error) {

        forecastContainer.innerHTML =
            `<p class="error">${error.message}</p>`;

    }

}

/* FORECAST */

async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );

        const data = await response.json();
        console.log(data);

        forecastContainer.innerHTML = "";

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.slice(0, 5).forEach(day => {

            const date = new Date(day.dt_txt);

            const card = document.createElement("div");

            card.className = "forecast-card";

            card.innerHTML = `
                <h3>
                    ${date.toLocaleDateString("en-US", {
                        weekday: "short"
                    })}
                </h3>

                <img
                    src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                    alt="Weather Icon"
                >

                <p>${Math.round(day.main.temp)}°C</p>

                <p>${day.weather[0].main}</p>
            `;

            forecastContainer.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

    }

}

/* LOADING */

function showLoading() {

    forecastContainer.innerHTML =
        `<p class="loading">Loading...</p>`;

}

/* SMART BACKGROUND SYSTEM */

function updateBackground(main, weatherDescription, temp) {

    weatherDescription =
        weatherDescription.toLowerCase();

    if (temp >= 38) {

        document.body.style.backgroundImage =
            "url('assets/images/sunny.jpg')";

    }

    else if (main === "Clear") {

        document.body.style.backgroundImage =
            "url('assets/images/sunny.jpg')";

    }

    else if (
        weatherDescription.includes("few clouds") ||
        weatherDescription.includes("scattered clouds")
    ) {

        document.body.style.backgroundImage =
            "url('assets/images/partly-cloudy.jpg')";

    }

    else if (
        weatherDescription.includes("broken clouds") ||
        weatherDescription.includes("overcast clouds")
    ) {

        document.body.style.backgroundImage =
            "url('assets/images/cloudy.jpg')";

    }

    else if (
        main === "Rain" ||
        main === "Drizzle"
    ) {

        document.body.style.backgroundImage =
            "url('assets/images/rainy.jpg')";

    }

    else if (
        main === "Thunderstorm"
    ) {

        document.body.style.backgroundImage =
            "url('assets/images/storm.jpg')";

    }

    else if (
        main === "Snow"
    ) {

        document.body.style.backgroundImage =
            "url('assets/images/snow.jpg')";

    }

    else {

        document.body.style.backgroundImage =
            "url('assets/images/night.jpg')";

    }

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

}

/* DEFAULT CITY */

getWeather("Hyderabad");
getForecast("Hyderabad");