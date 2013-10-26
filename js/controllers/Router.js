/**
 * @author carl-erik@gmail.com
 * @date   2013-10-22
 */

(function () {
	"use strict";
	var plantChooserId = '#plant-chooser';
	var dayChooserId = '#day-chooser';

	app.Router = can.Control({}, {

		"{can.route} change" : function() {
//			console.log("Change ");
		},

		"plant/:plantId/day/:day route" : function (data) {
			console.log("Day route", data);
		},

		"plant/:plantId route" : function (data) {
			console.log("Plant route", data.plantId);

			new app.DayChooser(dayChooserId, {
				view : 'views/day-chooser.ejs'
			});
		},

		"route" : function (data) {
			console.log('route Default route', arguments);

			new app.PlantChooser(plantChooserId, {
				view : 'views/plants.ejs'
			});

		}
	});
}());
