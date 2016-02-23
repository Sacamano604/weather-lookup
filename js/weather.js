'use strict';

var openWeatherAppId = '312a556e7bcb74eec3df243532b1ccd7', openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
// On document ready we map the button presses to the prepare data function and pass the unit that's pressed
// Used celsius and fahrenheit on buttons names because it's easier to use, but the unit needs to be in metric or imperial for the API
var tempType;
$(document).ready(function(){
	$('.btn-celsius').click(function(){
		tempType = 'C';
		prepareData('metric');
	});
	$('.btn-fahrenheit').click(function(){
		tempType = 'F';
		prepareData('imperial');
	});
});
// Function that prepares the data based on the unit that's passed to it
// Console logs an error if the field is empty, will handle the error in a more user friendly way once app fully works
var prepareData = function(units) {
	var cityName = $('#city-name').val();
	if (cityName && cityName != '') {
		cityName = cityName.trim();
		getData(openWeatherUrl, cityName, openWeatherAppId, units);
	} else {
		console.log('City name empty');
	};
};

function getData(url, cityName, appId, units) {
	var request = $.ajax({
		url: url,
		dataType: 'jsonp',
		data: {q: cityName, appId: appId, units: units},
		jsonpCallback: 'fetchData',
		type: 'GET'
	}).fail(function(error){
		console.log(error);
	});
};

function fetchData(forecast) {
	console.log(forecast);
	var html = '',
		cityName = forecast.city.name,
		country = forecast.city.country;
		html += '<h3> Weather forecast for ' + cityName + ', ' + country + '</h3>';
		forecast.list.forEach(function(forecastEntry, index, list){
			html += '<h4>' + forecastEntry.main.temp + ' &deg' + tempType + ', with ' + forecastEntry.weather[0].description + '.</h4><p id="time">' + forecastEntry.dt_txt + '<p>'
		});
	$('#results').html(html);
};