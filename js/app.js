/*
Plante
	- sensor data
	- diverse
 */
(function () {
	var Plant = can.Model({
		findAll : 'GET /plants.json',
		findOne : 'GET /plants/{id}.json'
	}, {});

	var SensorReading = can.Model({
		findAll : 'GET /plants/{id}/sensorvalues.json?from={from}&to={to}&page={page}'
	}, {});


	window.app = {};
	window.app.Plant = Plant;
	window.app.SensorReading= SensorReading;
}());

