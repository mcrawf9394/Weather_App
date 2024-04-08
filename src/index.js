import './style.css';
class locationTabs {
    constructor (locationName, locationRegion,locationCountry, currentTemp, currentTempC, currentCondition, wind, windKph,windDir, humidity, feelsLike, feelsLikeC) {
        const locationTab = {
            location: locationName,
            locationRegion: locationRegion,
            locationCountry: locationCountry,
            currentTemp: currentTemp,
            currentTempC: currentTempC,
            currentCondition: currentCondition,
            wind: wind,
            windKph: windKph,
            windDir: windDir,
            humidity:humidity,
            feelsLike: feelsLike,
            feelsLikeC: feelsLikeC
        }
        return locationTab
    }
}
let info = async function (location) {
    try {
        const response = await fetch('http://api.weatherapi.com/v1/current.json?key=78a9139ec4a1456ab09173528240504&q=' + location + '&aqi=no', {mode: 'cors'})
        let weatherInfo = await response.json()
        let locationName = weatherInfo.location.name
        let locationRegion = weatherInfo.location.region
        let locationCountry = weatherInfo.location.country
        let currentTemp = weatherInfo.current.temp_f
        let currentTempC = weatherInfo.current.temp_c
        let currentCondition = weatherInfo.current.condition.text
        let wind = weatherInfo.current.wind_mph
        let windKph = weatherInfo.current.wind_kph
        let windDir = weatherInfo.current.wind_dir
        let humidity = weatherInfo.current.humidity
        let feelsLike = weatherInfo.current.feelslike_f
        let feelsLikeC = weatherInfo.current.feelslike_c
        let locationTab = new locationTabs (locationName, locationRegion, locationCountry, currentTemp, currentTempC, currentCondition, wind, windKph,windDir, humidity, feelsLike, feelsLikeC)
        elements.tabs.push(locationTab)
        currentDisplay.displayCurrentWeather(locationTab)
        return locationTab
    } catch (error) {
        console.error("error", error)
    }
}
let search = async function (value) {
    if (value.length > 4)
    try {
        currentDisplay.deleteRecommendations()
        const response = await fetch('http://api.weatherapi.com/v1/search.json?key=78a9139ec4a1456ab09173528240504&q=' + value + '&aqi=no', {mode: 'cors'})
        let recommendations = await response.json()
        recommendations.forEach(recommendation => {
            let title = recommendation.name + " " + recommendation.region
            currentDisplay.displayRecommentations(title)
        });
    } catch (error) {
        console.error("error", error)
    }
}
const elements = {
    tabs: [],
    form: document.getElementById('city'),
    tabsContainer: document.getElementById('tabs'),
    body: document.getElementById('content'),
    search: document.getElementById('search'),
    datalist: document.getElementById('recommendations')
}
elements.form.addEventListener('input', () => {
    search(elements.form.value)
})
elements.search.addEventListener('click', () => {
    info(elements.form.value)
})
const currentDisplay = {
    displayCurrentWeather (locationTab) {
        while (elements.body.firstChild) {
            elements.body.removeChild(elements.body.firstChild)
        }
        const tabTitle = document.createElement('h3')
        tabTitle.textContent = locationTab.location + ", " + locationTab.locationRegion + ", " + locationTab.locationCountry
        const measurementChange = document.createElement('div')
        measurementChange.id = "measurementChange"
        const label = document.createElement('label')
        label.textContent = "Not in the U.S.?"
        const checkBox = document.createElement('input')
        checkBox.type = "checkbox"
        checkBox.addEventListener('click', () => {
            if (checkBox.checked == true) {
                temp.textContent = "Current Temp " + locationTab.currentTempC + "°C"
                feelsLike.textContent = "Feels Like " + locationTab.feelsLikeC + "°C"
                wind.textContent = "Wind Speed " + locationTab.windKph + " kph " + "Wind Direction " + locationTab.windDir
            }
            else {
                temp.textContent = "Current Temp " + locationTab.currentTemp + "°F"
                wind.textContent = "Wind Speed " + locationTab.wind + " mph " + "Wind Direction " + locationTab.windDir
                feelsLike.textContent = "Feels Like " + locationTab.feelsLike + "°F"
            }
        })
        measurementChange.append(label, checkBox)
        const currentContainer = document.createElement('div')
        currentContainer.id = "currentContainer"
        const currentWeather = document.createElement('div')
        const temp = document.createElement('h4')
        temp.textContent = "Current Temp " + locationTab.currentTemp + "°F"
        temp.id = "temp"
        const feelsLike = document.createElement('h4')
        feelsLike.textContent = "Feels Like " + locationTab.feelsLike + "°F"
        const currentCondition = document.createElement('h4')
        currentCondition.textContent = locationTab.currentCondition
        const wind = document.createElement('h4')
        wind.textContent = "Wind Speed " + locationTab.wind + " mph " + "Wind Direction " + locationTab.windDir
        const humidity = document.createElement('h4')
        humidity.textContent = "Humidity " + locationTab.humidity + "%"
        currentWeather.append(temp, feelsLike, currentCondition, wind, humidity)
        currentContainer.append(currentWeather)
        elements.body.append(tabTitle, measurementChange, currentContainer)
    },
    displayRecommentations (title) {
        const recommendation = document.createElement('option')
        recommendation.textContent = title
        recommendation.value = title
        elements.datalist.append(recommendation)
    },
    deleteRecommendations () {
        while (elements.datalist.firstChild) {
            elements.datalist.removeChild(elements.datalist.firstChild)
        }
    }
}
console.log(info("grand rapids"))