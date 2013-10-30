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
				dayList = can.List(),
				imageMap = can.Map();

			app.SensorReading.findFirstAndLast({id : plantId}).done(function (res) {
				can.List.prototype.push.apply(dayList, generateDayList(res.first.created(), res.last.created()));

				/*
				 * Server calls to fetch the images for each day
				 */
//				console.log('Daylist', dayList);
				dayList.each(function (day) {
					console.log('Day', day);
					// get sensordata of day
					// add imageurl to the imagemap
					//imageMap.attr(currentDay, imageUrl)
					app.SensorReading.findOne({id: plantId, from : day})
						.done(function (sensorData) {
							var imageUrl = sensorData[0]
							console.log(imageUrl);
							imageMap.attr(day, imageUrl.img_url);
						});
				});
			});


			window.imageMap = imageMap;

			this.element.html(can.view(view, { plantId : plantId, days : dayList, imageMap : imageMap }));
		}
	});
}());