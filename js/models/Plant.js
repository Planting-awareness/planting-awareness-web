(function () {
	'use strict';

	app.Plant = can.Model({
		findAll : 'GET /plants.json',
		findOne : 'GET /plants/{id}.json'
	}, {});
}());