//=========================================================================
// All our api urls here: (for reference)
// * Find Nearby StreetName
// * Weather Forecast;
// * Elevation Level
//=========================================================================

const pop_url = "https://api.openweathermap.org/data/2.5/forecast?q=Accra&appid=fafa6ab7292c2ed9cd80deb7a8e501a6";

window.onload = function() {


    

    const date = document.getElementById('date');
    const time = document.getElementById('time');
    const pop_value = document.getElementById('pop_value');

    date.textContent = new Date().toDateString();
    time.textContent = new Date().toTimeString();

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }
    getPoPData(pop_url, pop_value);

    // Setup for risk-history chart
    const labels = ["Sept 27", "Sept 28", "Sept 29", "Sept 30", "Oct 01", "Oct 02", "Oct 03"];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Risk Levels',
            data: [40.12, 15.24, 88.12, 11.12, 60.22, 66.01, 58.12],
            fill: true,
            borderColor: 'rgb(75, 192, 198)',
            tension: 0.1
        }]
    };

    // Charts - Risk History
    var risk_history = document.getElementById('risk-history');
    var risk_config = {
        type: 'line',
        data: data
    };
    var risk_trend = new Chart(risk_history, risk_config);



    // Setup for hourly forecast chart
    const forelabels = ["2am", "3am", "4am", "5am", "6am", "7am", "8am"];
    const foredata = {
        labels: forelabels,
        datasets: [{
            label: 'Temperature',
            data: [23.12, 26.07, 25.01, 24.00, 26.11, 25.03, 24.07],
            fill: true,
            borderColor: 'rgba(75, 192, 198)',
            tension: 0.1
        }]
    }

    // Charts - Hourly Forecast
    var forecast = document.getElementById('hourly-forecast');
    var forecast_config = {
        type: 'line',
        data: foredata,
    };
    var forecast_trend = new Chart(forecast, forecast_config);
}

function successCallback (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //console.log(latitude + ", " + longitude);
    var streeturl = "http://api.geonames.org/findNearbyPlaceNameJSON?lat="+latitude+"&lng="+longitude+"&username=e.papabear";
    var elevation_api_url = "https://api.open-elevation.com/api/v1/lookup?locations=" + latitude + "," + longitude;
    getNearbyStreetName(streeturl);
    getApiElevationData(elevation_api_url);
    probFlood(pop_url, elevation_api_url);
}


function errorCallback (error) {
    console.log(error.message);
}

async function getNearbyStreetName(url){
    const response = await fetch(url);
    var data = await response.json();
    var location = document.getElementById('location');
    location.textContent = data.geonames[0].name + ", " + data.geonames[0].countryCode;
}

async function getPoPData(url, pop){
    const response = await fetch(url);
    var data = await response.json();
    pop.textContent = "PoP: "+(data.list[0].pop*100).toFixed(2)+"%";
    var values = data.list[0];

    const temp_main = document.getElementById('temp_main');
    let celcius = -273.15, todayTemp = data.list[0].main.temp + celcius;
    temp_main.textContent = todayTemp.toFixed(1);

    const info_weather = document.getElementById('info_weather');
    let feel_temp, description, windspeed, humidity, visibility;
    feel_temp = values.main.feels_like + celcius;
    description = values.weather[0].description;
    windspeed = values.wind.speed;
    humidity = values.main.humidity;
    visibility = values.visibility;
    info_weather.innerHTML = `Feels like ${feel_temp.toFixed(1)}°C
                                <br /> ${description}
                                <br /> Wind speed: ${windspeed} m/s SW
                                <br /> Humidity: ${humidity}%
                                <br/ > Visibility levels: ${visibility/1000} km`;

    const info_weather_misc = document.getElementById('info_weather_misc');
    let min_temp, pressure, cloudPercentage, wind_gust;
    min_temp = values.main.temp_min + celcius;
    pressure = values.main.pressure;
    cloudPercentage = values.clouds.all;
    wind_gust = values.wind.gust;
    info_weather_misc.innerHTML = `Min temp: ${min_temp.toFixed(1)}°C
                                    <br /> Pressure: ${pressure} hPa
                                    <br /> Clouds: ${cloudPercentage}%
                                    <br /> Wind gust: ${wind_gust}m/s`;
}

async function getApiElevationData(url){
    const response = await fetch(url);
    var data = await response.json();
    const elevation_level = document.getElementById('elevation_level');
    elevation_level.textContent = "Elevation: " + data.results[0].elevation + "km";
}

async function probFlood(perurl, elurl){

    const resper = await fetch(perurl);
    var perData = await resper.json();
    let per  = perData.list[0].pop;

    const resel = await fetch(elurl);
    var elData = await resel.json();
    let el = elData.results[0].elevation;

    let prob = 0;

    if(el >= -1 && el < 200){
        prob = 0.5812;
      }
      else if(el >= 199 && el < 400){
        prob = 0.08;
      }
      else if(el >= 399 && el < 600){
        prob = 0.08;
      }
      else if(el >= 599 && el < 800){
        prob = 0.24;
      }
      else if(el >= 799 && el < 1000){
        prob = 0.04;
      }
      else if(el >= 999 && el < 1200){
        prob = 0.004;
      }
      else if(el >= 1199 && el < 1400){
        prob = 0.02;
      }
      else if(el >= 1399 && el < 1600){
        prob = 0.004;
      }
      else{
        console.log('Error! Elevation [' + el + '] is out of bounds.');
      }

      finProb = (per + prob)*100;

      const risk_level = document.getElementById('risk_level');
      const risk_echo_value = document.getElementById('risk_echo_value');

      risk_level.textContent = finProb.toFixed(2) + "%";
      risk_echo_value.textContent = "Flood Risk: " + finProb.toFixed(2) + "%";
}