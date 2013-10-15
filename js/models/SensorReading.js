/* global: can */
(function (namespace) {
	'use strict';

	var SensorReading = can.Model({
		findAll : 'GET /plants/{id}/sensorvalues.json?from={from}&to={to}&page={page}'
	}, {});

	namespace.SensorReading = SensorReading;
}(window));
