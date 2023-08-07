// selects element suggestion
const suggestionSearch = document.querySelector(".suggestion-search");
const listSuggestion = document.querySelector(".list-suges");
const findLocationInput = document.querySelector("#findLocation");
const findBtn = document.querySelector(".main-btn");
// function ob btn find
findBtn.addEventListener("click", function () {
  if (findLocationInput.value == "") {
    suggestionSearch.classList.remove("opacity-0");
    suggestionSearch.classList.add("auto-min-height");
    listSuggestion.classList.add("d-none");
    suggestionSearch.firstElementChild.classList.remove("d-none");
    suggestionSearch.firstElementChild.innerHTML = "empty input!";
  } else {
    suggestionSearch.classList.add("opacity-0");
    suggestionSearch.classList.remove("auto-min-height");
    callAPI(findLocationInput.value);
    findLocationInput.value = "";
  }
});

// eng ahmed then method
function callAPISearch(item) {
  fetch(
    `https://api.weatherapi.com/v1/search.json?key=1b12b41c47674d7d9e2223839230608&q=${item}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);

      suggestionSearch.classList.remove("opacity-0");
      suggestionSearch.classList.add("auto-min-height");

      if (response.length == 0) {
        listSuggestion.classList.add("d-none");
        suggestionSearch.firstElementChild.classList.remove("d-none");
        suggestionSearch.firstElementChild.innerHTML = "not found!";
      } else {
        suggestionSearch.firstElementChild.classList.add("d-none");
        listSuggestion.classList.remove("d-none");
        getSuggestion(response);
      }
    });
}

// function getSuggestion list(response)
function getSuggestion(response) {
  let list = "";
  for (let i = 0; i < response.length; i++) {
    list += `<li class="suggestion pt-3" data-url="${response[i].url}">${response[i].name}-${response[i].country}</li>`;
  }
  listSuggestion.innerHTML = list;
  SelectionItemSuggest();
}

// function Selection Item Suggest to display its weather
function SelectionItemSuggest() {
  let selected = Array.from(document.getElementsByClassName("suggestion"));
  console.log(selected);
  for (let i = 0; i < selected.length; i++) {
    selected[i].addEventListener("click", function (e) {
      callAPI(e.target.getAttribute("data-url"));
      suggestionSearch.classList.add("opacity-0");
      suggestionSearch.classList.remove("auto-min-height");
      findLocationInput.value = "";
    });
  }
}

// anther way is that asynchronous-await
async function callAPI(item) {
  try {
    let data = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=1b12b41c47674d7d9e2223839230608&q=${item}&days=3`
    );
    data = await data.json();
    displayWeatherToday(data.location, data.current);
    displayWeather(data.forecast.forecastday);
  } catch (error) {
    console.log("error");
  }
}

// get geolocation data
navigator.geolocation.getCurrentPosition(
  function (data) {
    console.log(data.coords.latitude);
    callAPI(data.coords.latitude + "," + data.coords.longitude);
  },
  function (error) {
    console.log("error geolocation");
  }
);

// input name
findLocationInput.addEventListener("keyup", function (e) {
  if (e.target.value == "") {
    suggestionSearch.classList.add("opacity-0");
    suggestionSearch.classList.remove("auto-min-height");
  } else callAPISearch(e.target.value);
});

// selections elements inside row

const Row = document.getElementById("row");
let elements = "";

// days and months arrays
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// console.log(new Date("2023-08-07").getDay());=1
// console.log(new Date("2023-08-07").getMonth()); month=7
// console.log(new Date(2023, 8, 7).getDate());=7
// console.log(new Date("2023-08-07"));
// console.log(new Date("2023-05-12 02:45").getDay());
// note that when the day=0 getData returns num days in month

// function display weather today
function displayWeatherToday(location, currentWeather) {
  elements = "";
  let data = new Date(currentWeather.last_updated);
  //
  console.log(data);
  elements += `<div class="col-lg-4 mb-3 mb-lg-0 bg-dark1">
    <div class="forecastday today bg-dark1">
      <div
        class="forecastday__header d-flex justify-content-between text-capitalize"
      >
        <span>${days[data.getDay()]} </span>
        <span><span>${data.getDate()}</span class="text-capitalize">${
    monthNames[data.getMonth()]
  }</span>
      </div>
      <div class="forecastday__body">
        <div>
          <p class="location text-capitalize">${location.name} <span>${
    location.country
  }</span></p>
          <div class="degree d-xxl-block d-xl-flex d-lg-block d-flex">
            <div class="temp-c">${
              currentWeather.temp_c
            }<sup>o</sup><span>C</span></div>
            <div class="forecastday-icon d-flex align-items-center">
              <img src="${
                currentWeather.condition.icon
              }" class="w-100" alt="" />
            </div>
          </div>
        </div>
        <p class="condition text-capitalize">${
          currentWeather.condition.text
        }</p>
        <div class="forecastday-samples d-flex justify-content-between">
          <div><i class="fa-solid fa-droplet"></i>${
            currentWeather.humidity
          }%</div>
          <div><i class="fa-solid fa-wind"></i>${
            currentWeather.wind_kph
          }Kph</div>
          <div><i class="fa-solid fa-umbrella"></i>${
            currentWeather.precip_mm
          }%</div>
          <div><i class="fa-solid fa-compass"></i>${
            currentWeather.wind_dir
          }</div>
          <div>
            <i class="fa-solid fa-gauge"></i> ${currentWeather.pressure_in}in
          </div>
        </div>
      </div>
    </div>
  </div>`;
  Row.innerHTML = elements;
}

// function display for weather tomorrow and next day
function displayWeather(forecast) {
  console.log(forecast);
  let data;
  let weather = "";
  for (let i = 1; i < forecast.length; i++) {
    data = new Date(forecast[i].date);
    console.log(data.getDay());
    weather += `<div class="col-lg-4 mb-3 mb-lg-0">
    <div class="forecastday">
      <div
        class="forecastday__header d-flex justify-content-center text-capitalize"
      >
        <span>${days[data.getDay()]}</span>
      </div>
      <div class="forecastday__body2 text-center ">
        <div class="forecastday-icon  w-100">
          <img src="${forecast[i].day.condition.icon}" alt="" class=""/>
        </div>
        <div class="degree-temp">${
          forecast[i].day.maxtemp_c
        } <sup>o</sup><span>C</span></div>
        <p class="night">${
          forecast[i].day.mintemp_c
        }<sup>o</sup><span></span></p>
        <div class="condition text-capitalize text-center">${
          forecast[i].day.condition.text
        }</div>
      </div>
    </div>
  </div>`;
    // console.log(weather);
  }
  Row.innerHTML += weather;
}
