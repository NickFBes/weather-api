
const apiKey = "f2f34793e75b4bf280101438240711";

const localBtn = document.getElementById("btn-local");
const searchBtn = document.getElementById("btn-search");
const sectionLocal = document.getElementById("section-local");
const sectionSearch = document.getElementById("section-search");
const inputSearch = document.getElementById("input-search");
const searchButton = document.querySelector(".btn-search");

localBtn.addEventListener("click", () => toggleSection("local"));
searchBtn.addEventListener("click", () => toggleSection("search"));

function toggleSection(type) {
  if (type === "local") {
    sectionLocal.classList.add("active");
    sectionSearch.classList.remove("active");
    localBtn.classList.add("active");
    searchBtn.classList.remove("active");
  } else {
    sectionLocal.classList.remove("active");
    sectionSearch.classList.add("active");
    localBtn.classList.remove("active");
    searchBtn.classList.add("active");
  }
}

function renderWeather(containerId, data) {
  const container = document.getElementById(containerId);
  const current = data.current;
  const forecast = data.forecast.forecastday;
  container.innerHTML = `
    <div class="weather-day">
      <h3>${data.location.name}</h3>
      <img src="https:${current.condition.icon}" alt="icon" />
      <p>${current.temp_c} ºC - ${current.condition.text}</p>
      <p>Feels like: ${current.feelslike_c} ºC</p>
      <p>Humidity: ${current.humidity}%</p>
      <p>Wind: ${current.wind_kph} km/h ${current.wind_dir}</p>
      <p>Pressure: ${current.pressure_mb} mb</p>
      <p>UV Index: ${current.uv}</p>
    </div>
    <div class="forecast">
      ${forecast
        .map(
          (day) => `
        <div class="forecast-day">
          <h4>${day.date}</h4>
          <img src="https:${day.day.condition.icon}" alt="icon" />
          <p>${day.day.avgtemp_c} ºC</p>
          <p>${day.day.condition.text}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

async function fetchWeather(query, containerId) {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5&lang=en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching data");
    const data = await response.json();
    renderWeather(containerId, data);
  } catch (error) {
    console.error("Weather fetch error:", error);
    document.getElementById(containerId).innerHTML =
      "<p>Error loading weather data.</p>";
  }
}

searchButton.addEventListener("click", () => {
  const city = inputSearch.value.trim();
  if (city) fetchWeather(city, "searched-weather");
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(`${latitude},${longitude}`, "local-weather");
    });
  } else {
    document.getElementById("local-weather").innerHTML =
      "<p>Geolocation not supported.</p>";
  }
});

