const search = document.getElementById("search");
const searchBtn = document.getElementById("search-img");
const locBtn = document.getElementById("loc-img");
const form = document.getElementById("select");
const temp = document.getElementById('temp');
const maxmin = document.getElementById('max-min');
const desc = document.getElementById('desc');
const feelsLike = document.getElementById('feels');
const sec1 = document.getElementById('sec1');
const wind = document.getElementById('wind');
const set = document.getElementById('set');
const rise = document.getElementById('rise');
const humidity = document.getElementById('humidity');
const bg = document.getElementById('bg-img');

// connecting to current weather api
const getWeather = async (location) => {

    const apikey = config.API_KEY;
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apikey}`;

    const response = await fetch(url);
    blur();
    const data = await response.json();

    if (response.status == 200)
    {
        if (data.main.temp <= 5) {
            sec1.style.backgroundImage = 'url("images/winter.jpg")';
            bg.setAttribute('src',"images/winter.jpg");
        }
        else if (/rain|drizzle/.test(data.weather[0].description)) {
            sec1.style.backgroundImage = 'url("images/rain.jpg")';
            bg.setAttribute('src',"images/rain.jpg");
        }
        else if (/cloud/.test(data.weather[0].description)) {
            sec1.style.backgroundImage = 'url("images/cloud.jpg")';
            bg.setAttribute('src', "images/cloud.jpg");
        }
        else {
            sec1.style.backgroundImage = 'url("images/sunny.jpg")';
            bg.setAttribute('src',"images/sunny.jpg");
        }
        addToPage(data);
        show();
    }
    else if(response.status===404){
        temp.innerText = 'Not Found !!';
        document.querySelectorAll('.value').forEach(each => { each.innerText = '' });
        show();
    }
};

// get location by ip address
const getLocIP = async () => {

    const locUrl = "http://ip-api.com/json/";
    const response = await fetch(locUrl);
    const data = await response.json();
    getWeather(data.city);
}
getLocIP();

// search button event
locBtn.addEventListener('click', getLocIP);

// adding to html page
const addToPage = (data) => {
    // section 1
    search.value = `${data.name}, ${data.sys.country}`;
    temp.innerText = `${Math.round(data.main.temp)}°C`;
    maxmin.innerText = `${Math.round(data.main.temp_max)}°/${Math.round(data.main.temp_min)}°`;
    desc.innerText = `${data.weather[0].description}`;
    feelsLike.innerText = `feels like ${data.main.feels_like}°C`;
    // section 2
    rise.innerText = `${timeHrs(data.sys.sunrise)}`;
    set.innerText = `${timeHrs(data.sys.sunset)}`;
    wind.innerText = `${data.wind.speed}km/h`;
    humidity.innerText = `${data.main.humidity}%`;
};

// function called while submitting 
searchBtn.addEventListener('click', onEvent);
form.addEventListener('submit', onEvent);
function onEvent(e) {
    e.preventDefault();
    search.blur();
    getWeather(search.value)
        .catch(err => console.log("Error", err));  // 'reject' from response.json() promise
};

// convet time in seconds to GMT+5.30
function timeHrs(time) {
    let min = Math.round(time / 60+30)%60;
    if (min < 10)
        min = '0' + min;
    let hr = Math.round(time / 3600+5)%24;
    if (hr < 10)
        hr = '0' + hr;
    return `${hr}:${min}`;
}

// function to blur while loading
const main = document.getElementById('main');
const blur = () => {
    main.style.filter = 'blur(5px)';
}
const show = () => {
    main.style.filter = 'blur(0)';
}