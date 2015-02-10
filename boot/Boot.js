function booting() {
	var mraa = require('mraa');
	var display, button, led, temp, light, gas;
	var scheduler, panicMode = false;
	var STATES = { ON:0, OFF:1, ERRR:2 };
	var GAS_THRESHOLD = 200;

	this.init = function() {
		console.log('Initializing the hardware...');

		initLED();
		swithOnLCD();
		initButtonSwitch();
		initSensors();

		console.log('Initializing successfully...');
		display.clear();
		scheduler = setInterval(function(){ timer()  }, 1000);
		display.setColor(255, 255, 255);
		setTimeout(function(st) { updateDisplayStatus(st); }, 3500, STATES.OFF);
	},

	initLED = function() {
		console.log("Encendiendo LED");
		var upmLED = require('jsupm_grove');
		led = new upmLED.GroveLed(4);
	},

	swithOnLCD = function() {
		console.log("Encendiendo LCD");
		var LCD = require('jsupm_i2clcd');
		display = new LCD.Jhd1313m1(0, 0x3E, 0x62);
		display.clear();
		display.home();
		display.setCursor(0,0);
		display.write(' Starting...');
		setInterval(function(){ checkButton() }, 100);
	},

	initButtonSwitch = function() {
		button = new mraa.Gpio(2);
		button.dir(mraa.DIR_IN);
	},	

	initSensors = function() {
		console.log("Iniciando sensores...");
		var sensors = require('jsupm_grove');
		temp = new sensors.GroveTemp(0);
		light = new sensors.GroveLight(1);
		var gasSensor = require('jsupm_gas');
		gas = new gasSensor.MQ5(2);
	},

	timer = function() {
		var d = new Date();
		display.setCursor(0,0);
		display.write("[Sema] " + d.toLocaleTimeString() + "   ");
		showSensorsInformation();
		monitorizeGasSensor();
	},

	showSensorsInformation = function() {
		display.setCursor(1,0);
		display.write(
	            "T:" + temp.value() + ", " +
        	    "L:" + (light.value() < 2 ? "No" : "Si") + ", " +
	            "G:" + (gas.getSample() > 200 ? "KO" : "OK")
        	);
	},

	monitorizeGasSensor = function() {
		if(gas.getSample() >= GAS_THRESHOLD && !panicMode) {
			console.log("Enabling panic mode");
			panicMode = true;
			updateDisplayStatus(STATES.ERR);
			led.on();
		} else if(gas.getSample() > GAS_THRESHOLD && panicMode) {
			console.log("Already in a panic mode");
		} else if(gas.getSample() < GAS_THRESHOLD && panicMode) {
			console.log("Disabling panic mode");
			panicMode = false;
			updateDisplayStatus(STATES.ON);
			setTimeout(function(st) { updateDisplayStatus(st); }, 2000, STATES.OFF);
			led.off();
		}
	},

	checkButton = function() {
		if(button.read() ==  1 && !panicMode) {
			updateDisplayStatus(STATES.ON);
			setTimeout(function(st) { updateDisplayStatus(st); }, 5000, STATES.OFF);
		} else if(button.read() == 1 && panicMode) {
			console.log("PANIC MODE!!");
		}
	},	

	updateDisplayStatus = function(state) {
		if(state === STATES.ON)
			display.setColor(255, 255, 255);
		else if(state === STATES.OFF)
			display.setColor(0, 0, 0);
		else if(state === STATES.ERR)
			display.setColor(255, 50, 50);
	},

	this.getDisplayLCD = function() {
		return display;
	},

	this.getButton = function() {
		return button;
	},

	this.getLED = function() {
		return led;
	},

	this.getTemperatureSensor = function() {
		return temp;
	},

	this.getLightSensor = function() {
		return light;
	},

	this.getGasSensor = function() {
		return gas;
	}

}

exports.booting = booting;
