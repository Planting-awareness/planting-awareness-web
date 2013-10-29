/* globals: jQuery can app */
(function () {

	/**
	 * @param first {Date}
	 * @param last {Date}
	 * @returns [String] an array of ISO8601 date strings from the first date up to and including the last
	 */
	function generateDayList (first, last) {
		var current = first,
			oneDay = 1000 * 60 * 60 * 24,
			dateList = [];

		function formatDate (date) {
			return date.toISOString().substring(0, 10);
		}

		while (current < last) {
			dateList.push(formatDate(current));
			current = new Date(current.getTime() + oneDay);
		}
		dateList.push(formatDate(last));
		return dateList;
	}

	// constructor function for the PlantChooser controller
	app.DayChooser = can.Control({
		/* here you can put static data/functions for the constructor object itself */
	}, {
		init : function () {
			var plantId = this.options.plantId,
				view = this.options.view,
				dayList = can.List();

			app.SensorReading.findFirstAndLast({id : plantId}).done(function(res) {
				can.List.prototype.push.apply(dayList, generateDayList(res.first.created(), res.last.created()));
			});

			this.element.html(can.view(view, { plantId : plantId, days : dayList }));
		}
	});
}());