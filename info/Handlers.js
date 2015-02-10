exports.collectAllSensorsInfo = function(request, response) {
	console.log('New request to: /info');

	var boot = require('../boot/Boot').booting;
	var hardware = new boot();

	response.setHeader('Content-Type', 'application/json');
	response.json({
		"temp" : hardware.getTemperatureSensor().value() + " ºC",
		"light" : (hardware.getLightSensor().value() > 2) ? "Light enough!" : "Too dark...",
		"gas" : (hardware.getGasSensor().getSample() > 200) ? "Warning!! I've detected some kind of gas!! :-(" : "No gas detected! :-)"
	});
};

exports.infoTemperature = function(request, response) {
	console.log("New requet to: /info/temp");

	var boot = require('../boot/Boot').booting;
	var hardware = new boot();

	response.setHeader('Content-Type', 'application/json');
	response.json({
		"temp" : hardware.getTemperatureSensor().value() + " ºC"
	});
}

exports.infoLight = function(request, response) {
	console.log("New requet to: /info/light");

	var boot = require('../boot/Boot').booting;
	var hardware = new boot();

	response.setHeader('Content-Type', 'application/json');
	response.json({
		"light" : (hardware.getLightSensor().value() > 2) ? "Light enough!" : "Too dark..."
	});
}

exports.infoGas = function(request, response) {
	console.log("New requet to: /info/gas");

	var boot = require('../boot/Boot').booting;
	var hardware = new boot();

	response.setHeader('Content-Type', 'application/json');
	response.json({
		"gas" : (hardware.getGasSensor().getSample() > 200) ? "Warning!! I've detected some kind of gas!! :-(" : "No gas detected! :-)"
	});
}
