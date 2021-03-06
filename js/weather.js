'use strict';

var openWeatherAppId = '312a556e7bcb74eec3df243532b1ccd7';
var openWeatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';
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
		$('#error').html('City name empty');
	};
};
// Function that does a GET request for the json data
function getData(url, cityName, appId, units) {
	var request = $.ajax({
		url: url,
		dataType: 'jsonp',
		data: {q: cityName, appId: appId, units: units},
		jsonpCallback: 'fetchData',
		type: 'GET'
	}).fail(function(error){
		console.log(error);
		$('#error').html('Look up failed'); 
	});
};
//Function to present the HTML data
function fetchData(forecast) {
	// Clears any previous errors
	$('#error').html('');
	//console.log(forecast); Used previously while debugging, keeping it in for now
	var html = '',
		cityName = forecast.city.name,
		country = forecast.city.country;
		html += '<h3 id="forecastCity">Weather forecast for ' + cityName + ', ' + country + '</h3>';
		forecast.list.forEach(function(forecastEntry, index, list){
			var date = new Date(forecastEntry.dt_txt + ' UTC');
			var stringDate = date.toString();
			var cleanDate = stringDate.substring(0,21);
			html += '<div class="col-md-2">' + cleanDate + '<br /><h3>' 
			+ forecastEntry.main.temp + ' &deg' + tempType + '</h3><br />' 
			+ '<img id="weatherIcon" src="http://openweathermap.org/img/w/' + forecastEntry.weather[0].icon + '.png" />' + '<br />'	
			+ forecastEntry.weather[0].description + '</div>';
		});
	$('#results').html(html);
};