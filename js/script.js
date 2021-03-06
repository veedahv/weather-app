
// get elements
function get(element) {
    return document.getElementById(element)
}
const form = document.querySelector('.form'),
    dialog = document.querySelector('dialog'),
    weatherIntroDiv = document.querySelector('.weather-intro-div'),
    weatherInfoDiv = document.querySelector('.weather-info-div'),
    preloader = document.querySelector('.pre-loader-div'),
    nameInput = get('name-input'),
    weatherIcon = get('weather-icon'),
    time = get('time'),
    back = get('back'),
    dialogNote = get('dialog-note'),
    okBtn = get('ok-btn'),
    locationInput = document.getElementById('location-input'),
    name = document.getElementById('name'),
    date = document.getElementById('date'),
    locationName = document.getElementById('location'),
    temperature = document.getElementById('temperature'),
    temperatureDesc = document.getElementById('temperature-desc'),
    humidity = document.getElementById('humidity'),
    wind = document.getElementById('wind'),
    weatherNote = document.getElementById('weather-note');

    // functions
    function repeat() {
        date.innerHTML = moment().format('MMMM Do YYYY');
        time.innerHTML = moment().format('h:mm:ss a');
    }
    function preloadRemove() {
        preloader.style.zIndex = '-5';
        preloader.style.opacity = '0';
    }
    function preloadAdd() {
        preloader.style.zIndex = '5';
        preloader.style.opacity = '1';
    }
    setTimeout(preloadRemove, 1000)
    function errorMsg(err) {
        let re = /undefined/i;
        let errTest = re.test(err);
        console.log(errTest);
        if (locationInput.value === '') {
            dialogNote.innerText = 'No location Inputed';
        } else if (errTest) {
            dialogNote.innerText = 'Input a correct location';
        } else {
            dialogNote.innerText = 'Check your internet connection.';
        }
        dialog.showModal();
    }
    function checkClear() {
        console.log('working');
        if (temperature.innerText >= 20) {
            weatherInfoDiv.className = 'weather-info-div clearSun'
        } else {
            weatherInfoDiv.className = 'weather-info-div clearSky'
        }
    }
    function checkRain() {
        console.log('working');
        if (temperature.innerText >= 25) {
            weatherInfoDiv.className = 'weather-info-div clearSky'
        } else {
            weatherInfoDiv.className = 'weather-info-div rainy'
        }
    }
    function weatherType(mainData) {
        switch (mainData) {
            case 'Thunderstorm':
                console.log('oui')
                weatherInfoDiv.className = 'weather-info-div thunderstorm'
                break;
            case 'Drizzle':
                console.log('oui')
                weatherInfoDiv.className = 'weather-info-div drizzle'
                break;
            case 'Rain':
                console.log('oui')
                checkRain()
                // weatherInfoDiv.className = 'weather-info-div rainy'
                break;
            case 'Snow':
                console.log('oui')
                weatherInfoDiv.className = 'weather-info-div snow'
                break;
            case 'Clear':
                console.log('oui')
                checkClear();
                // weatherInfoDiv.className = 'weather-info-div clear'
                break;
            case 'Clouds':
                console.log('oui')
                weatherInfoDiv.className = 'weather-info-div clouds'
                break;

            default:
                weatherInfoDiv.className = 'weather-info-div default'
                break;
        }
    }
    function getWeatherInfo(data) {
        let tempText = data.current.temp - 273;
        temperature.innerText = Math.ceil(tempText);
        humidity.innerText = data.current.humidity;
        wind.innerText = data.current.wind_deg;
        let weatherMode = data.current.weather[0].description;
        let main = data.current.weather[0].main;
        temperatureDesc.innerText = weatherMode;
        let icon = data.current.weather[0].icon;
        weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`
        console.log(main);
        weatherType(main);
    }
    function getLocationInfo(data) {
        let lat = data[0].lat;
        let long = data[0].lon;
        locationName.innerText = data[0].display_name;
        let weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=4d88d3e1c5203a9607563a61727364a2`;

        fetch(weatherUrl).then(
            function (response) {
                console.log(response.status)
                return response.json();
            }
        ).then(
            function (data) {
                getWeatherInfo(data)
            }
        ).catch(function (error) {
            errorMsg(error);
        })
    }
    // to keep running repeat func after 1s
    setInterval(repeat, 1000);

    // eventlisteners
    back.addEventListener('click', function (event) {
        event.preventDefault()
        preloadAdd();
        weatherInfoDiv.style.display = 'none';
        weatherIntroDiv.style.display = 'block';
        setTimeout(preloadRemove, 500)
                // location.href='index.html';

    })
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        document.body.style.cursor = 'wait'
        let locationValue = locationInput.value;
        nameInitial = nameInput.value;
        nameFirstLetter = nameInitial.slice(0, 1).toUpperCase();
        nameRest = nameInitial.slice(1, 10).toLowerCase();
        if (nameInput.value === '') {
            name.innerText = 'Dear';
        } else {
            name.innerText = nameFirstLetter + nameRest;
        }
        console.log(name.innerText)
        const locationCord = `https://us1.locationiq.com/v1/search.php?key=pk.251ea510fb4602dd7e4f6100d02f729e&q=${locationValue}&format=json`;
        // const locationCord2 = 'https://us1.locationiq.com/v1/search.php?key=pk.251ea510fb4602dd7e4f6100d02f729e&q=' + locationValue + '&format=json';
        preloadAdd();
        fetch(locationCord).then(
            function (response) {
                return response.json();
            }
        ).then(
            function (data) {
                getLocationInfo(data);
                document.body.style.cursor = 'none'
                function changeDisplay() {
                    document.body.style.cursor = 'initial';
                    weatherIntroDiv.style.display = 'none';
                weatherInfoDiv.style.display = 'block';
                // location.href='weather.html';
                // preloadRemove();
                }
                changeDisplay();
                nameInput.value = '';
                locationInput.value = '';
                setTimeout(preloadRemove, 1000)
            }
        ).catch(function (error) {
            setTimeout(preloadRemove, 50)
            document.body.style.cursor = 'initial';
            console.log(error)
            errorMsg(error)
        })
    })
    // https://us1.locationiq.com/v1/search.php?key=pk.251ea510fb4602dd7e4f6100d02f729e&q=uyo&format=json
    // https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily&appid=4d88d3e1c5203a9607563a61727364a2
