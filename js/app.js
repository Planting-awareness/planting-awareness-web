/* Globals: jQuery can PlantChooser Plant SensorReading  */

(function ($) {
	'use strict';

	$(document).ready(function () {

		/* TODO: the route bits here are doing nothing.
		They have simply taken been taken from the TodoMVC example, and
		they are awaiting further usage. Don't know what they do yet.
		 */
		// Set up a route that maps to the `filter` attribute
		can.route(':filter');
		// Delay routing until we initialized everything
		can.route.ready(false);


		Plant.findAll({}, function (plants) {
			new PlantChooser('#planting-awareness-app', {
				plants : plants,
				state : can.route,
				view : 'views/plants.ejs'
			});
		});

		// Now we can start routing
		can.route.ready(true);
	});

}(jQuery));

