/* Globals: jQuery can PlantChooser Plant SensorReading  */

(function ($) {
	'use strict';

	$(document).ready(function () {

		//TODO: setup listeners to react to changes in the hashstring
		//@see http://canjs.com/guides/RecipesRouting.html
		can.route('plant/:plant_id', {
			plant : undefined,
			day   : undefined
		});
		can.route('plant/:plant_id/day/:day', {
			plant : undefined,
			day   : undefined
		});

		// Delay routing until we initialized everything
		can.route.ready(false);

		new Breadcrumb('#breadcrumb');

		Plant.findAll({}, function (plants) {
			new PlantChooser('#plant-chooser', {
				plants : plants,
				state  : can.route,
				view   : 'views/plants.ejs'
			});
		});

		// Now we can start routing
		can.route.ready(true);
	});

}(jQuery));

