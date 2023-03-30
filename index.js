const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grand-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initial variables
let currentTab = userTab;
const API_KEY = "2c70304b2ffdf1055090e2041bcd4951";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
	if (clickedTab != currentTab) {
		// Remove current tab class
		currentTab.classList.remove("current-tab");
		currentTab = clickedTab; // Update current tab variable
		clickedTab.classList.add("current-tab");
		
        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
	}
}

// Event Listeners
userTab.addEventListener("click", () => {
	// Pass clicked tab as input parameter
	switchTab(userTab);
});

searchTab.addEventListener("click", () => {
	// Pass clicked tab as input parameter
	switchTab(searchTab);
});

// Check if cordination is already available in session storage
function getfromSessionStorage(){
    const localCordinate = sessionStorage.getItem("user-cordinate");
    if(!localCordinate){
        grantAccessContainer.classList.add("active");
    }
    else{
        const cordinate = JSON.parse(localCordinate);
        fetchUserWeatherInfo(cordinate);
    }
}

async function fetchUserWeatherInfo(cordinate) {
	const { lat, lon } = cordinate;
	// Make gerantcontainer invisible
	grantAccessContainer.classList.remove("active");

	// Make loading screen visible
	loadingScreen.classList.add("active");

	// API call
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
		);
		const data = await response.json();
		loadingScreen.classList.remove("active");
		userInfoContainer.classList.add("active");
		renderWeatherInfo(data);
	} catch (error) {
		loadingScreen.classList.remove("active");
		console.log(error);
	}
}

function renderWeatherInfo(weatherInfo){
    // const {name, main, weather} = data;
    // const {temp, feels_like, humidity} = main;
    // const {description, icon} = weather[0];

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidityInfo = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Fatch values from weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidityInfo.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-cordinate", JSON.stringify(userCordinate));
    fetchUserWeatherInfo(userCordinate);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation)

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityName = searchInput.value;

    if(cityName === ""){
        alert("Please enter a city name");
        return;
    }
    else{
        fetchCityWeatherInfo(cityName);
    }
});

async function fetchCityWeatherInfo(cityName){
    // Make loading screen visible
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        loadingScreen.classList.remove("active");
        console.log(error);
    }
}