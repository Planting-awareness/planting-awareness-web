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

	var Reading = can.Model({
		findAll : 'GET /plants/{id}/sensorvalues.json'
	}, {});


	window.app = {};
	window.app.Plant = Plant;
}());

