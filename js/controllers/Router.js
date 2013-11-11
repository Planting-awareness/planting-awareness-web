/**
 * @date   2013-10-22
 */

(function () {
	"use strict";
	var $rootElem,
		plantChooserId = 'plant-chooser',
		dayChooserId = 'day-chooser',
		chosenDayId = 'choosen-day',
		statisticsViewId = "#statistics-view";

	app.Router = can.Control({}, {

		init : function() {
			$rootElem = this.element;
		},

		"{can.route} change" : function () {
		},

		"plant/:plantId/day/:day/:sensor route" : function (data) {

			$('#'+dayChooserId).fadeOut().remove();
			$rootElem.html('<div id="'+ chosenDayId + '"></div>');
			new app.ReadingsView('#'+chosenDayId, {
				view : 'views/readings_view.ejs',
				plantId: data.plantId,
				day: data.day,
				sensor : data.sensor
			});
		},

		"plant/:plantId/day/:day route" : function (data) {
			console.log("Day route", data);
			// by default load the light sensor
			window.location.hash = can.route.url({plantId : data.plantId, day : data.day, sensor : 'light'});

		},

		"plant/:plantId route" : function (data) {
			console.log("Plant route", data.plantId);

//			$('#'+plantChooserId).fadeOut().remove();
			$rootElem.html('<div id="'+ dayChooserId + '"></div>');

			new app.DayChooser('#' + dayChooserId, {
				view    : 'views/day-chooser.ejs',
				plantId : data.plantId
			});
		},

		"route" : function (data) {
			console.log('route Default route', arguments);

			$rootElem.html('<div id="'+ plantChooserId + '"></div>');
			new app.PlantChooser('#'+plantChooserId, {
				view : 'views/plants.ejs'
			});

		}
	});
}());
