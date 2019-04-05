var corsUrl 		= 'https://cors-anywhere.herokuapp.com/';
var zipCodeAPIKey 	= '<API_KEY>'; // https://www.zipcodeapi.com/
var darkSkyAPIKey	= '<API_KEY>'; // https://darksky.net/dev
var newsapiOrgKey	= '<API_KEY>'; // https://newsapi.org/
var bookmarks		= [
	{
		'name': 'Reddit',
		'url': 'https://reddit.com'
	},
	{
		'name': 'Google',
		'url': 'https://google.com'
	},
	{
		'name': 'GitHub',
		'url': 'https://github.com'
	},
	{
		'name': 'YouTube',
		'url': 'https://youtube.com'
	},
	{
		'name': 'Google Photos',
		'url': 'https://photos.google.com'
	},
	{
		'name': 'Google News',
		'url': 'https://news.google.com'
	}
];

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
		console.log("Zipcode: " + zipcode);
		// get5DaysWeatherForecast(zipcode);
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

function getDayOfTheWeek(today) {
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var day = weekday[today.getDay()];
	return day;
}

function getMonthOfTheYear(today) {
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
	return mon;
}

function timeSince(previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var current = new Date();

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function checkDate() {
    var today = new Date();
    var h = today.getHours();
    var day = getDayOfTheWeek(today);
	var mon = getMonthOfTheYear(today);

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
	var url = corsUrl + 'https://www.zipcodeapi.com/rest/' + zipCodeAPIKey + '/info.json/' + zipcode + '/degrees';
	var req = new Request(url);

	fetch(req)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			// console.log(response);
			populateCityNameFromZipCode(response);
			getCurrentWeatherCondition(response.lat, response.lng);
		})
		.catch(function(error) {
			console.log(error)
		});
}

function populateCityNameFromZipCode(response) {
	var city = response.city;
	console.log("City: " + city);
	var h2 = document.getElementById("cityName");
	h2.innerHTML = city;
}

function getCurrentWeatherCondition(lat, lng) {
	var url = corsUrl + 'https://api.darksky.net/forecast/' + darkSkyAPIKey + '/' + lat + ',' + lng;
	var req = new Request(url);

	fetch(req)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			// console.log(response);
			populateCurrentWeatherCondition(response.currently);
			populate5DaysWeatherForecast(response.daily);
			// console.log(response);
		}).catch(function(error) {
			console.log(error)
			var myCurrentWeatherConditionObj = 
			[{
				
					"WeatherText": "Cloudy",
					"Temperature": {
						"Imperial": {
							"Value": 30
						}
					}
				
			}];
			// Dummy Data if the API Doesnt work
			var my5DaysWeatherForecastObj = {
				"DailyForecasts": [
					{
						"Date": "2018/11/24",
						"Temperature": {
							"Maximum": {
								"Value": 50
							},
							"Minimum": {
								"Value": 25
							}
						}
					},
					{
						"Date": "2018/11/25",
						"Temperature": {
							"Maximum": {
								"Value": 50
							},
							"Minimum": {
								"Value": 25
							}
						}
					},
					{
						"Date": "2018/11/26",
						"Temperature": {
							"Maximum": {
								"Value": 50
							},
							"Minimum": {
								"Value": 25
							}
						}
					},
					{
						"Date": "2018/11/27",
						"Temperature": {
							"Maximum": {
								"Value": 50
							},
							"Minimum": {
								"Value": 25
							}
						}
					},
					{
						"Date": "2018/11/28",
						"Temperature": {
							"Maximum": {
								"Value": 50
							},
							"Minimum": {
								"Value": 25
							}
						}
					}
				]
			};
			populateCurrentWeatherCondition(myCurrentWeatherConditionObj);
			populate5DaysWeatherForecast(my5DaysWeatherForecastObj);
		});
	// get5DaysWeatherForecast(zipcode);
}

function populateCurrentWeatherCondition(response) {
	console.log("Weather summary: " + response.summary);
	var weatherText = response.summary;
	var temperatureValue = Math.round(response.temperature);
	var node = document.createElement("div");
	node.setAttribute("class", "col-8");

	var innerDiv1 = document.createElement("div");
	innerDiv1.setAttribute("class", "weather-type");
	innerDiv1.innerHTML = weatherText;
	node.appendChild(innerDiv1);

	var span = document.createElement("span");
	span.setAttribute("class", "number");
	span.innerHTML = temperatureValue + "&deg;<span class=\"unit\">F</span>"
	node.appendChild(span);

	document.getElementById("currentWeather").appendChild(node);

	var node1 = document.createElement("div");
	node1.setAttribute("class", "col-4");

	var innerDiv2 = document.createElement("div");
	innerDiv2.setAttribute("class", "weather-icon-current");
	innerDiv2.setAttribute("width", "84");
	innerDiv2.setAttribute("height", "84");
	node1.appendChild(innerDiv2);

	var iconImg = document.createElement("img");
	iconImg.setAttribute("src", "assets/icons/" + response.icon + ".svg");
	iconImg.setAttribute("title", response.summary);
	innerDiv2.appendChild(iconImg);

	document.getElementById("currentWeather").appendChild(node1);
}

function populate5DaysWeatherForecast(response) {
	for (var i = 0; i < 5; i++) {
		var Maximum = Math.round(response.data[i].temperatureHigh);
		var Minimum = Math.round(response.data[i].temperatureLow);
		var weatherDate = response.data[i].time;

		// console.log("Maximum: " + Maximum);
		// console.log("Minimum: " + Minimum);
		// console.log("Weather Date: " + weatherDate);

		var node = document.createElement("div");
		node.setAttribute("class", "col");

		var outerSpan = document.createElement("span");
		outerSpan.setAttribute("class", "day");
		var date = new Date(weatherDate * 1000);

		var getTodaysDate = new Date();
		var dayOfTheWeek = getDayOfTheWeek(date);
		var res = "";
		
		if (date.getDate() === getTodaysDate.getDate()) {
			res = "Today";
		} else {
			res = dayOfTheWeek.substring(0, 3);
		}
		outerSpan.innerHTML = res;
		node.appendChild(outerSpan);

		var innerDiv1 = document.createElement("div");
		innerDiv1.setAttribute("class", "weather-icon-forecast");
		innerDiv1.setAttribute("width", "39");
		innerDiv1.setAttribute("height", "39");
		node.appendChild(innerDiv1);

		var iconImg = document.createElement("img");
		iconImg.setAttribute("src", "assets/icons/" + response.data[i].icon + ".svg");
		iconImg.setAttribute("width", "39");
		iconImg.setAttribute("height", "39");
		iconImg.setAttribute("title", response.data[i].summary);
		innerDiv1.appendChild(iconImg);


		var innerDiv2 = document.createElement("div");
		innerDiv2.setAttribute("class", "high-low");

		var spanMax = document.createElement("span");
		spanMax.setAttribute("class", "high")
		spanMax.innerHTML = Maximum + "&deg;F";
		innerDiv2.appendChild(spanMax);

		var breakLine = document.createElement("br");
		innerDiv2.appendChild(breakLine);

		var spanMin = document.createElement("span");
		spanMin.setAttribute("class", "low")
		spanMin.innerHTML = Minimum + "&deg;F";
		innerDiv2.appendChild(spanMin);

		node.appendChild(innerDiv2);
		// console.log(node);

		document.getElementById("weatherForecast").appendChild(node);
	}
}

function getNews() {
	var url = 'https://newsapi.org/v2/top-headlines?sources=google-news&apiKey=' + newsapiOrgKey;
	var req = new Request(url);
	fetch(req)
	.then(function(response) {
		return response.json();
	})
	.then(function(response) {
		// console.log(JSON.stringify(response));
		populateNews(response);
	}).catch(function(error) {
		console.log(error)
        var myNewsApiObj = {   
            "articles": [
                {
                    "source": {
                        "name": "CNBC"
                    },
                    "title": "Fed holds line on rates, says no more hikes ahead this year - CNBC",
                    "url": "https://news.google.com/articles/",
                    "publishedAt": "2019-03-20T18:00:08Z"
                },{
                    "source": {
                        "name": "Ars Technica"
                    },
                    "title": "“Energizing Times”: Microsoft to “go big” at E3 in response to Google Stadia - Ars Technica",
                    "url": "https://arstechnica.com/gaming/2019/03/in-wake-of-googles-stadia-reveal-microsofts-phil-spencer-promises-to-go-big-at-e3/",
                    "publishedAt": "2019-03-20T17:24:00Z"
                },
                {
                    "source": {
                        "name": "Fox News"
                    },
                    "title": "Clarence Thomas makes rare intervention during Supreme Court arguments - Fox News",
                    "url": "https://www.foxnews.com/politics/clarence-thomas-makes-rare-intervention-during-supreme-court-arguments",
                    "publishedAt": "2019-03-20T17:21:01Z"
                },{
                    "source": {
                        "name": "The New York Times"
                    },
                    "title": "Confusion, Then Prayer, in Cockpit of Doomed Lion Air Jet - The New York Times",
                    "url": "https://www.nytimes.com/2019/03/20/world/asia/lion-air-crash-boeing.html",
                    "publishedAt": "2019-03-20T17:10:29Z"
                }
            ]
        };
        populateNews(myNewsApiObj);
	});
}

function populateNews(response) {
	for (var i = 0; i < 4; i++) {

		var node = document.createElement("li");
		node.setAttribute("class", "card px-4 py-3 mb-2");

		var a = document.createElement("a");
		a.setAttribute("href", response.articles[i].url);
		var heading = document.createElement("h5");
		var s = response.articles[i].title
		// s = s.substring(0, s.indexOf('-'));
		var textForHeading = document.createTextNode(s);
		heading.appendChild(textForHeading)
		a.appendChild(heading)
		node.appendChild(a);

		var div = document.createElement("div");
		div.setAttribute("class", "meta");
		var span = document.createElement("span");
		span.setAttribute("class", "site");
		span.innerHTML = response.articles[i].source.name;
		var time = document.createElement("time");
		var t = new Date(response.articles[i].publishedAt);
		time.innerHTML = timeSince(t);

		div.appendChild(span);
		div.appendChild(time);

		node.appendChild(div);

		document.getElementById("topHeadlines").appendChild(node);
	}
}

function populateFavicons() {
	var url = 'https://api.faviconkit.com/';

	for (var i = 0; i < bookmarks.length; i++) {
		var imgSrc = bookmarks[i].url;
		imgSrc = imgSrc.replace(/^(https?:|)\/\//, '');
		imgSrc = url + imgSrc + "/64";

		var node = document.createElement("div");
		node.setAttribute("class", "col");

		var a = document.createElement("a");
		a.setAttribute("href", bookmarks[i].url);

		var iconImg = document.createElement("img");
		iconImg.setAttribute("src", imgSrc);
		iconImg.setAttribute("title", bookmarks[i].name);
		iconImg.setAttribute("width", "32");
		iconImg.setAttribute("height", "32");
		iconImg.setAttribute("class", "mb-3");
		a.appendChild(iconImg);

		node.appendChild(a);

		document.getElementById("bookmarks").appendChild(node);
	}
}

window.onload = function() {
	checkCookie();
	checkDate();
	startTime();
	getNews();
	populateFavicons();
}