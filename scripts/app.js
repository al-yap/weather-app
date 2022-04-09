// const key = process.env.WEATHERAPIKEY;
const weatherApi = `https://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function convertUnixTime(unix_timestamp) {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in ms, not s.
  let date = new Date(unix_timestamp * 1000);
  // Get all required time components from the timestamp
  let year = date.getFullYear();
  let month = months[date.getMonth()];
  let day = date.getDate();
  let hms = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return `${day} ${month} ${year}, ${hms}`;
}

function getTempUnit(unit) {
  const obj = {
    metric: 'C',
    imperial: 'F',
    standard: 'K',
  };
  return obj[unit];
}

// map OpenWeatherMap weather icons to SkyCons
// https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
// https://github.com/maxdow/skycons
function getIconName(iconId) {
  const obj = {
    '01d': 'CLEAR_DAY',
    '02d': 'PARTLY_CLOUDY_DAY',
    '03d': 'CLOUDY',
    '04d': 'CLOUDY',
    '09d': 'SHOWERS_DAY',
    '10d': 'RAIN',
    '11d': 'THUNDER_RAIN',
    '13d': 'SNOW',
    '50d': 'FOG',
    '01n': 'CLEAR_NIGHT',
    '02n': 'PARTLY_CLOUDY_NIGHT',
    '03n': 'CLOUDY',
    '04n': 'CLOUDY',
    '09n': 'SHOWERS_NIGHT',
    '10n': 'RAIN',
    '11n': 'THUNDER_RAIN',
    '13n': 'SNOW',
    '50n': 'FOG',
  };
  return obj[iconId];
}

async function getCurrentWeather(lat, long, unit = 'metric') {
  const api = `${weather_api}&lat=${lat}&lon=${long}&units=${unit}`;
  const result = {};
  const tempUnit = getTempUnit(unit);

  return fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dataTimePoint = convertUnixTime(data.dt);
      result.latitude = data.coord.lat;
      result.longitude = data.coord.lon;
      result.weatherTitle = data.weather[0].main;
      result.weatherDesc = data.weather[0].description;
      result.weatherIcon = data.weather[0].icon;
      result.tempActual = data.main.temp;
      result.tempFeelsLike = data.main.feels_like;
      result.tempMin = data.main.temp_min;
      result.tempMax = data.main.temp_max;
      result.humidity = data.main.feels_like;
      result.location = data.name;
      result.country = data.sys.country;
      result.tempUnit = tempUnit;
      result.timeZone = data.timezone;
      result.time = dataTimePoint;
      return result;
    });
}

window.addEventListener('load', () => {
  let long;
  let lat;
  let tempDesc = document.querySelector('.temp-description');
  let tempDeg = document.querySelector('.temp-degree');
  let timeDegUnit = document.querySelector('.temp-degree-unit');
  let area = document.querySelector('.location-area');
  let timeZone = document.querySelector('.location-timezone');

  let tempSection = document.querySelector('.temp-degree-section');
  let tempSectionSpan = document.querySelector('.temp-degree-section span');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      getCurrentWeather(lat, long).then((result) => {
        console.log(result);
        // Set DOM Elements from the API
        tempDeg.textContent = result.tempActual;
        tempDesc.textContent = result.weatherDesc;
        area.textContent = `${result.location}, ${result.country}`;
        timeDegUnit.textContent = result.tempUnit;
        timeZone.textContent = `Last update: ${result.time}`;
        // set icon
        icon = getIconName(result.weatherIcon);
        setIcons(icon, document.querySelector('.banner-icon'));

        // change temperature section to other units
        let fahrenheit = result.tempActual * 1.8 + 32;
        tempSection.addEventListener('click', () => {
          if (tempSectionSpan.textContent === 'F') {
            tempSectionSpan.textContent = 'C';
            tempDeg.textContent = result.tempActual;
          } else if (tempSectionSpan.textContent === 'C') {
            tempSectionSpan.textContent = 'F';
            tempDeg.textContent = fahrenheit;
          }
        });
      });
    });
  }

  function setIcons(icon, iconId) {
    const skycons = new Skycons({ color: 'white' });
    skycons.play();
    return skycons.set(iconId, Skycons[icon]);
  }
});

// 'use strict';
// var request = require('request');

// // replace the 'demo' apikey below with your own key from https://www.alphavantage.co/support/#api-key
// // var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${key}`;
// var url = `${weather_api}&lat=-37.7&lon=144.9&units=metric`

// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       console.log(data);
//     }
// });
