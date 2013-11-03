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
//			console.log("Change ");
		},

		"plant/:plantId/day/:day route" : function (data) {
			console.log("Day route", data);
			
			$('#'+dayChooserId).fadeOut().remove();
			$rootElem.html('<div id="'+ chosenDayId + '"></div>');
			new app.ReadingsView('#'+chosenDayId, {
				view : 'views/readings_view.ejs',
				plantId: data.plantId,
				day: data.day	
			});
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
