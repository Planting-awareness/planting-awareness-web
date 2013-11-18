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
			dateList = [],
			len;

		function formatDate (date) {
			return date.toISOString().substring(0, 10);
		}

		while (current < last) {
			dateList.push(formatDate(current));
			current = new Date(current.getTime() + oneDay);
		}
		dateList.push(formatDate(last));

		/* Get rid of duplicates at the end */
		len = dateList.length;
		if(len >= 2 && dateList[len-1] === dateList[len-2]) {
			dateList.pop();
		}

		return dateList;
	}

	// constructor function for the PlantChooser controller
	app.DayChooser = can.Control({
		/* here you can put static data/functions for the constructor object itself */
	}, {
		init : function () {
			var element = this.element,
				plantId = this.options.plantId,
				view = this.options.view,
				dayList = can.List(),
				imageMap = can.Map(),
				numberOfLoadedImgs = 0,
				task = new can.Map({
					progress : 0.0
				}),
				progressPercent = can.compute(function () {
					return task.attr('progress') * 100;
				});

			app.SensorReading.findFirstAndLast({id : plantId}).done(function (res) {
				can.List.prototype.push.apply(dayList, generateDayList(res.first.created(), res.last.created()));

				/*
				 * Server calls to fetch the images for each day
				 */
				dayList.each(function (day) {
					// get sensordata of day
					// add imageurl to the imagemap
					//imageMap.attr(currentDay, imageUrl)
					app.SensorReading.findOne({id : plantId, from : day})
						.done(function (sensorData) {
							var imageUrl = sensorData[0]
							imageMap.attr(day, imageUrl.thumb_url);
						})
						.done(function () {
							numberOfLoadedImgs++;
							task.attr('progress', progress())
						});
				});
			});

			function progress () {
				var totalLen = dayList.length || 1;
				return numberOfLoadedImgs / totalLen;
			}

			// progress loader
			progressPercent.bind("change", function(ev, newVal, oldVal){
				if(newVal > 99) {
					element.find('.loading-info').fadeOut(1500);
				}
			});

			window.imageMap = imageMap;

			this.element.html(can.view(view, {
				plantId  : plantId,
				days     : dayList,
				imageMap : imageMap,
				progress : progressPercent
			}));
		}
	});
}());