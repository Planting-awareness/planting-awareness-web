(function (namespace) {
	'use strict';

	var Plant = can.Model({
		findAll : 'GET /plants.json',
		findOne : 'GET /plants/{id}.json'
	}, {});

	namespace.Plant = Plant;
}(window));