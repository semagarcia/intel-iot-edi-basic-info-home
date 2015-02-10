// Require-imports
var http = require('http');
var express = require('express');
var boot = require('./boot/Boot').booting;
var REP = require('./constants/RestEndPoints').RestEndPoints;
var handlers = require('./info/Handlers');

// Initialize the server
var app = express();
var server = http.createServer(app).listen(3000);

// Init the hardare [Desacoplarlo de aquí y moverlo]
var hardware = new boot();
hardware.init();

// Handle the requests
app.get(REP.home, function(request, response){
	console.log('New request to: /');
	response.setHeader('Content-Type', 'application/json');
	response.json({ status: 'online' });
});

app.get(REP.info, handlers.collectAllSensorsInfo);
app.get(REP.temp, handlers.infoTemperature);
app.get(REP.light, handlers.infoLight);
app.get(REP.gas, handlers.infoGas);
