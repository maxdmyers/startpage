var accuweatherAPIKey 	= '<API_KEY>';
var corsUrl 			= 'https://cors-anywhere.herokuapp.com/';

function setCookie(zipcode, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = zipcode + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(zipcode) {
	var zip = zipcode + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');

	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(zip) == 0) {
			return c.substring(zip.length, c.length);
		}
	}

	return "";
}

function checkCookie() {
	var zipcode = getCookie("zipcode");

	if (zipcode != "") {
		alert("Zipcode : " + zipcode);
		get5DaysWeatherForecast(zipcode);
	} else {
		zipcode = prompt("Please enter your Zipcode:", "");
		if (zipcode != "" && zipcode != null) {
			setCookie("zipcode", zipcode, 30);
		}
	}

	getCityNameFromZipCode(zipcode);
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var amPM = (h > 11) ? "pm" : "am";

    h = today.getHours() % 12 || 12
    m = checkTime(m);

    document.getElementById('txt').innerHTML = h + ":" + m;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    return (i < 10) ? i = "0" + i : i;  // add zero in front of numbers < 10
}

function checkDate() {
    var today = new Date();
    var h = today.getHours();

    var weekday = new Array(7);
    weekday[0] =  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[today.getDay()];

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var mon = month[today.getMonth()];

    var timeOfDayArray = [
        [0, 4, "Good night."], 
        [5, 11, "Good morning."],
        [12, 17, "Good afternoon."],
        [18, 22, "Good evening."],
        [23, 24, "Good night."]
    ];

    for(var i = 0; i < timeOfDayArray.length; i++){
        if(h >= timeOfDayArray[i][0] && h <= timeOfDayArray[i][1]){
            document.getElementById('salutation').innerHTML = timeOfDayArray[i][2];
        }
    }

    document.getElementById('today').innerHTML = day + ', ' + mon + ' ' + today.getDate();
}

function getCityNameFromZipCode(zipcode) {
	var url = corsUrl + 'http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=' + accuweatherAPIKey + '&q=' + zipcode;
	var req = new Request(url);

	fetch(req)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			populateCityNameFromZipCode(response);
		})
		.catch(function(error) {
			console.log(error)
		});
}

function populateCityNameFromZipCode(response) {
	console.log("City: " + response[0].LocalizedName);
	var h2 = document.getElementById("cityName");
	h2.innerHTML = response[0].LocalizedName;
}

window.onload = function() {
	checkCookie();
	checkDate();
	startTime();
}