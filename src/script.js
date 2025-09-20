// ---------------------- Kabul Section ---------------------- //
// Update Kabul time
function updateKabulTime() {
  const kabulTimeElement = document.getElementById("kabulTime");
  const kabulDateElement = document.getElementById("kabulDate");

  const kabul = moment().tz("Asia/Kabul");
  kabulTimeElement.innerHTML = `
    <h1 class="h1">
      ${kabul.format("hh:mm:ss")}<small>${kabul.format("A")}</small>
    </h1>`;
  kabulDateElement.innerHTML = kabul.format("dddd, MMMM D");
}
setInterval(updateKabulTime, 1000);
// Display Kabul weather
function displayKabulWeather(response) {
  console.log("Kabul Weather:", response.data);

  const tempDetails = document.getElementById("temperature-detail");
  const extraDetails = document.getElementById("extra-details");

  const iconUrl = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`;

  tempDetails.innerHTML = `
    <div class="temperaure-icon">
      <img src="${iconUrl}" alt="${response.data.condition.description}" />
    </div>
    <div class="temperature">${Math.round(
      response.data.temperature.current
    )}℃</div>
  `;

  extraDetails.innerHTML = `
    <div class="description">${response.data.condition.description}</div>
    <div class="humidity">H: ${response.data.temperature.humidity}%</div>
    <div class="wind">W: ${Math.round(response.data.wind.speed)} km/h</div>
  `;
}

// Run Kabul time & weather on page load
updateKabulTime();

const apiKey = "8tc45bb70811ad02c7716f84fe4ocbe3";
axios
  .get(
    `https://api.shecodes.io/weather/v1/current?query=Kabul&key=${apiKey}&units=metric`
  )
  .then(displayKabulWeather);

// ---------------------- Search Section ---------------------- //
// Display searched city time
function displayCity(response) {
  console.log("City Time:", response.data);
  const cities1 = document.querySelector(".cities");
  if (cities1) {
    cities1.style.display = "flex"; // or "block", depending on your layout
  }
  const cityElement = document.getElementById("city");
  const timeElement = document.getElementById("time");

  let timeZone = response.data.timeZone;
  let cityName = timeZone.includes("/")
    ? timeZone.split("/")[1].replace("_", " ")
    : timeZone;
  let time2 = response.data.dateTime;

  cityElement.innerHTML = `<h1>${cityName}</h1>`;
  timeElement.innerHTML = `
    <h2 class="time2">
      ${moment(time2).format("hh:mm")}
      <small class="small2">${moment(time2).format("A")}</small>
    </h2>`;
}

// Display searched city weather
function displayWeather(response) {
  console.log("City Weather:", response.data);

  const tempDetails = document.querySelector(
    ".cities .temperature-detail-cities-part"
  );
  const details1 = document.querySelector(".cities .details1");

  const iconUrl = `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`;

  tempDetails.innerHTML = `
    <div class="temperaure-icon">
      <img src="${iconUrl}" alt="${response.data.condition.description}" />
    </div>
    <div class="temperature">${Math.round(
      response.data.temperature.current
    )}℃</div>
  `;

  details1.innerHTML = `
    <div class="description1">${response.data.condition.description}</div>
    <div class="humidity1">H:${response.data.temperature.humidity}%</div>
    <div class="wind1">W:${Math.round(response.data.wind.speed)} km/h</div>
  `;
}

// Handle search
function search(event) {
  event.preventDefault();

  const searchInput = document.getElementById("searchInput").value;

  // Get city time
  const apiTimeUrl = `https://timeapi.io/api/Time/current/zone?timeZone=${searchInput}`;
  axios
    .get(apiTimeUrl)
    .then(displayCity)
    .catch((error) => {
      console.error(error);
      alert("Invalid timezone. Try e.g. Europe/Paris or Asia/Kabul.");
    });

  // Get city weather
  const cityName = searchInput.includes("/")
    ? searchInput.split("/")[1]
    : searchInput;
  const apiWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;
  axios.get(apiWeatherUrl).then(displayWeather);
}

// Attach event
const form = document.getElementById("form");
form.addEventListener("submit", search);
